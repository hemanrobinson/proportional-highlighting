import React, { useRef, useEffect }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import BarChart from './BarChart';
import PieChart from './PieChart';
import Plot from './Plot';
import './Matrix.css';

/**
 * @typedef  Point  point
 *
 * @type  {object}
 * @property  {number}   x        X coordinate, in pixels
 * @property  {number}   y        Y coordinate, in pixels
 */

/**
 * @typedef  Rect  rectangle
 *
 * @type  {object}
 * @property  {number}   x        X coordinate, in pixels
 * @property  {number}   y        Y coordinate, in pixels
 * @property  {number}   width    width, in pixels
 * @property  {number}   height   height, in pixels
 */

/**
 * Scatter plot matrix in an SVG element.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const Matrix = ( props ) => {
    
    // Initialization.
    const ref = useRef(),
        { nData, opacity } = props,
        width = 200,
        height = 200,
        nColumns = 3,
        nRows = 2,
        data = Data.getValues( nData ),
        totalWidth = nColumns * width,
        totalHeight = nRows * height,
        brushNodeOffset = 0;
        
    /**
     * Returns a function, that, as long as it continues to be invoked, will not be triggered.
     * The function will be called after it stops being called for `wait` milliseconds.
     *
     * From https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086.
     *
     * @param func  function
     * @param wait  delay, in milliseconds
     * @return debounced function
     */
    const debounce = ( func, wait ) => {
        let timeout;
        return function executedFunction( ...args ) {
            const later = () => {
                clearTimeout( timeout );
                func( ...args );
            };
            clearTimeout( timeout );
            timeout = setTimeout( later, wait );
        };
    };
    
    // Cache scaled coordinates.
    Matrix.scaled = [];
    let scale = [];
    for( let i = 0; ( i < nColumns ); i++ ) {
        Matrix.scaled[ i ] = new Uint16Array( nData );
        let x = i * width;
        scale[ i ] = d3.scaleLinear().domain( Data.getDomain( nData, i )).range([ x + Plot.padding, x + width - Plot.padding ]);
    }
    data.forEach(( datum, row ) => {
        for( let i = 0; ( i < nColumns ); i++ ) {
            let x = i * width;
            Matrix.scaled[ i ][ row ] = Math.round( scale[ i ]( datum[ i ]) - x );
        }
    });
    
    // Set hook to select and draw on mounting.
    useEffect(() => {
        
        // Create the SVG elements (after https://observablehq.com/@d3/brushable-scatterplot-matrix?collection=@d3/d3-brush).
        Matrix.canvas = d3.select( ref.current.childNodes[ 0 ]).node();
        const svg = d3.select( ref.current.childNodes[ 1 ]);
        svg.selectAll( "*" ).remove();
        const cell = svg.append( "g" )
            .selectAll( "g" )
            .data( d3.cross( d3.range( nColumns ), d3.range( nRows )))
            .join( "g" )
            .attr( "transform", ([ i, j ]) => `translate(${ i * width },${ j * height })` );
            
        // Create the brush.
        const onStart = ( event ) => {
            if( event.sourceEvent ) {
                const target = event.sourceEvent.target.parentNode;
                if( Matrix.brushNode !== target ) {
                    d3.select( Matrix.brushNode ).call( brush.move, null );
                    Matrix.brushNode = target;
                    Data.deselectAll();
                } else if( event.selection ) {
                    const xDown = event.selection[ 0 ][ 0 ],
                    yDown = event.selection[ 0 ][ 1 ],
                    xUp = event.selection[ 1 ][ 0 ],
                    yUp = event.selection[ 1 ][ 1 ];
                    let offsetX, offsetY;
                    if( event.sourceEvent.touches ) {
                        const touch = event.sourceEvent.touches[ 0 ];
                        offsetX = touch.clientX - Matrix.canvas.getBoundingClientRect().x;
                        offsetY = touch.clientY - Matrix.canvas.getBoundingClientRect().y;
                    } else {
                        offsetX = event.sourceEvent.offsetX;
                        offsetY = event.sourceEvent.offsetY;
                    }
                    let i = Math.floor( offsetX / width ),
                    j = Math.floor( offsetY / height ),
                    x = i * width,
                    y = j * height;
                    if( !Plot.isWithin({ x: offsetX, y : offsetY }, { x: x + xDown, y: y + yDown, width: xUp - xDown, height: yUp - yDown })) {
                        Data.deselectAll();
                    }
                }
            }
        };
        const debouncedDraw = debounce( Matrix.draw, 1 );
        const onBrush = ( event ) => {
            if( event.selection ) {
                const xDown = event.selection[ 0 ][ 0 ],
                    yDown = event.selection[ 0 ][ 1 ],
                    xUp = event.selection[ 1 ][ 0 ],
                    yUp = event.selection[ 1 ][ 1 ];
                let offsetX, offsetY;
                if( event.sourceEvent ) {
                    if( event.sourceEvent.touches ) {
                        const touch = event.sourceEvent.touches[ 0 ];
                        offsetX = touch.clientX - Matrix.canvas.getBoundingClientRect().x;
                        offsetY = touch.clientY - Matrix.canvas.getBoundingClientRect().y;
                    } else {
                        offsetX = event.sourceEvent.offsetX;
                        offsetY = event.sourceEvent.offsetY;
                    }
                } else {
                    offsetX = width * Math.floor( brushNodeOffset / 4 );
                    offsetY = height * ( brushNodeOffset % 4 );
                }
                let i = Math.floor( offsetX / width ),
                j = Math.floor( offsetY / height ),
                x = i * width,
                y = j * height;
                if( i === j ) {
                    Data.deselectAll();
                } else {
                    Data.selectedRows = Plot.select( x, y, width, height, i, j, Matrix.scaled, { x: x + xDown, y: y + yDown, width: xUp - xDown, height: yUp - yDown });
                    if( Matrix.bitmaps && Matrix.bitmaps[ i ]) {
                        Plot.draw( undefined, ref.current.firstChild, x, y, width, height, i, j, Matrix.scaled, opacity, Data.selectedRows, Matrix.bitmaps[ i ][ j ]);
                    }
                }
            }
            debouncedDraw( width, height, ref, nData, opacity, false );
        };
        const onEnd = ( event ) => {
            Matrix.draw( width, height, ref, nData, opacity, true );
        };
        const brush = d3.brush()
            .extent([[ 2, 2 ], [ width, height ]])
            .on( "start", onStart )
            .on( "brush", onBrush )
            .on( "end", onEnd );
        cell.call( brush );
        
        // Initialize the brush.
        Matrix.brushNode = svg.node().firstChild.childNodes[ brushNodeOffset ];
        const brushCell = d3.select( Matrix.brushNode );
        brushCell.call( brush.move, [[ 40, 40 ], [ 80, 80 ]]);
    });
    
    // Return the component.
    return <div ref={ref}><canvas width={totalWidth} height={totalHeight}></canvas><svg width={totalWidth} height={totalHeight}></svg></div>;
};

/**
 * Bitmaps of deselected rows, cached for optimization, or undefined if none.
 *
 * @type {ImageData[][]|undefined}
 */
Matrix.bitmaps = undefined;

/**
 * CANVAS element, or undefined if none.
 *
 * @type {Element|undefined}
 */
Matrix.canvas = undefined;
 
/**
 * Node containing a brush, or undefined if none.
 *
 * @type {Node|undefined}
 */
Matrix.brushNode = undefined;
 
/**
 * Scaled coordinates, or undefined if none.
 *
 * @type {Uint16Array[]|undefined}}
 */
Matrix.scaled = undefined;

/**
 * Clears data structures.
 */
Matrix.clear = () => {
    Data.deselectAll();
    Matrix.bitmaps = undefined;
};

/**
 * Draws the grid, the plots, and the axes.
 *
 * @param  {number}  width          width in pixels
 * @param  {number}  height         height in pixels
 * @param  {Object}  ref            reference to DIV
 * @param  {number}  nData          number of data values
 * @param  {number}  opacity        alpha
 * @param  {boolean} isDrawingAll   true iff clearing and redrawing grid and axes
 */
Matrix.draw = ( width, height, ref, nData, opacity, isDrawingAll ) => {
    
    // Initialization.  If no context, do nothing.
    const nColumns = 3,
        nRows = 2;
    if( !ref ) {
        return;
    }
    let canvas = ref.current.firstChild,
        g = canvas.getContext( "2d" );
    if( !g ) {
        return;
    }
    
    // If requested, clear the drawing area and draw the grid.
    if( isDrawingAll ) {
        g.clearRect( 0, 0, nColumns * width, nRows * height );
        g.strokeStyle = "#939ba1";
        for( let i = 1; ( i < nColumns ); i++ ) {
            g.moveTo( i * width + 0.5, 0 );
            g.lineTo( i * width + 0.5, nRows * height );
        }
        for( let j = 1; ( j < nRows ); j++ ) {
            g.moveTo( 0, j * height + 0.5 );
            g.lineTo( nColumns * width, j * height + 0.5 );
        }
        g.stroke();
    }
    
    // Draw the plots and the charts.  On first draw, store the bitmaps.
    let isFirstDraw = !Matrix.bitmaps;
    if( isFirstDraw ) {
        Matrix.bitmaps = [];
    }
    for( let i = 0; ( i < nColumns ); i++ ) {
        for( let j = 0; ( j < nRows ); j++ ) {

            // Get the position and the selection.
            let x = i * width,
                y = j * height;
                
            let k = i + 3 * j;
            const svg = d3.select( ref.current.childNodes[ 1 ]);
            let selection = d3.select( svg.node().firstChild.childNodes[ k ]);
            
            // Draw a plot or chart.
            switch( k ) {
                case 0:
                    BarChart.draw( selection, canvas, x, y, width, height, {}, {}, { bandwidth: () => {}}, {}, {}, {}, {}, {}, []);
                    break;
                case 4:
                    PieChart.draw( selection, canvas, x, y, width, height, undefined, undefined );
                    break;
                case 5:
                    if( isFirstDraw ) {
                        if( Matrix.bitmaps[ i ] === undefined ) {
                            Matrix.bitmaps[ i ] = [];
                        }
                        Matrix.bitmaps[ i ][ j ] =
                            Plot.draw( selection, canvas, x, y, width, height, i, j, Matrix.scaled, opacity, Data.selectedRows );
                    } else {
                        Plot.draw( selection, canvas, x, y, width, height, i, j, Matrix.scaled, opacity, Data.selectedRows, Matrix.bitmaps[ i ][ j ]);
                    }
                    break;
                default:
                    break;

            }
        }
    }
};

export default Matrix;
