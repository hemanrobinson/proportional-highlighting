import React, { useRef, useEffect }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Bar from './Bar';
import Pie from './Pie';
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
        { percentSelected } = props,
        nData = 100,
        width = 200,
        height = 200,
        nColumns = 3,
        nRows = 2,
        data = Data.getValues( nData ),
        totalWidth = nColumns * width,
        totalHeight = nRows * height;
    
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
        svg.append( "g" )
            .selectAll( "g" )
            .data( d3.cross( d3.range( nRows ), d3.range( nColumns )))
            .join( "g" )
            .attr( "transform", ([ i, j ]) => `translate(${ j * width },${ i * height })` );
            
        // Select the data and draw the graphs.
        Data.selectPercentage( percentSelected );
        Matrix.draw( ref, width, height, -1, -1, Data.selectedRows, true );
    });
    
    // Return the component.
    return <div ref={ref}><canvas width={totalWidth} height={totalHeight}></canvas><svg width={totalWidth} height={totalHeight}></svg></div>;
};
 
/**
 * Scaled coordinates, or undefined if none.
 *
 * @type {Uint16Array[]|undefined}}
 */
Matrix.scaled = undefined;

/**
 * Deselects all rows.
 */
Matrix.clear = () => {
    Data.deselectAll();
};

/**
 * Draws the grid, the graphs, and the axes.
 *
 * @param  {Object}     ref            reference to DIV
 * @param  {number}     width          width in pixels
 * @param  {number}     height         height in pixels
 * @param  {number}     i              X column index, or <0 to draw all
 * @param  {number}     j              Y column index, or <0 to draw all
 * @param  {number[]}   selectedRows   indices of selected rows
 * @param  {boolean}    isDrawingGrid  true iff clearing and redrawing the grid
 */
Matrix.draw = ( ref, width, height, i, j, selectedRows, isDrawingGrid ) => {
    
    // Initialization.  If no context, do nothing.
    const nColumns = 3,
        nRows = 2,
        padding = { top: 20, right: 20, bottom: 0, left: 20 },
        margin = { top: 0, right: 0, bottom: 120, left: 60 },
        top    = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left;
    if( !ref ) {
        return;
    }
    let canvas = ref.current.firstChild,
        g = canvas.getContext( "2d" );
    if( !g ) {
        return;
    }
    
    // Calculate the bars.
    let data = Data.getValues(),
        bars;
    bars = Array.from( d3.rollup( data, v => d3.sum( v, d => d[ 1 ]), d => d[ 0 ]));
    
    // Draws a graph.
    let drawGraph = ( ref, width, height, i, j, selectedRows ) => {
    
        // Get the position and the selection.
        let x = i * width,
            y = j * height;
        let k = i + 3 * j;
        const svg = d3.select( ref.current.childNodes[ 1 ]);
        let selection = d3.select( svg.node().firstChild.childNodes[ k ]);
        let xDomain0,
            yDomain0,
            xScale,
            yScale;
        const nData = Data.getValues().length;
        
        // Get the scales.
        yScale = d3.scaleLinear()
          .domain( Data.getDomain( nData, 1 ))
          .range([ height, 0]);
    
        // Set the X domain.
        xDomain0 = bars.map( x => x[ 0 ]);
        xScale = d3.scaleBand().domain( xDomain0 ).range([ left, width - right ]).padding( 0.2 );

        // Get the Y scale.
        yDomain0 = [ 0, ( 1 + Bar.yMargin ) * d3.max( bars, d => d[ 1 ])];
        yScale = d3.scaleLinear()
            .domain( yDomain0 )
            .range([ height - bottom, top ]);
        
        // Draw the graph.
        switch( k ) {
            case 0:
                Bar.draw( selection, x, y, width, height, margin, padding, xScale, yScale, bars );
                break;
            case 1:
                Pie.draw( selection, x, y, width, height, undefined, undefined );
                break;
            case 2:
                // Area
                break;
            case 3:
                // Map
                break;
            case 4:
                Plot.draw( selection, x, y, width, height, i, j, Matrix.scaled, selectedRows );
                break;
            case 5:
                // Box
                break;
            default:
                break;

        }
    };
    
    // If requested, clear the drawing area and draw the grid.
    if( isDrawingGrid ) {
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
    
    // Draw the graphs.
    if(( i >= 0 ) && ( j >= 0 )) {
        drawGraph( ref, width, height, i, j, selectedRows );
    } else {
        for( let j = 0; ( j < nRows ); j++ ) {
            for( let i = 0; ( i < nColumns ); i++ ) {
                drawGraph( ref, width, height, i, j, selectedRows );
            }
        }
    }
};

export default Matrix;
