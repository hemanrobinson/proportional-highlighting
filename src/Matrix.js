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
        width = 200,
        height = 200,
        nColumns = 3,
        nRows = 3,
        totalWidth = nColumns * width,
        totalHeight = nRows * height;
    
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
        Matrix.draw( ref, width, height, -1, -1, Data.selectedRowIndices, true );
    });
    
    // Return the component.
    return <div ref={ref}><canvas width={totalWidth} height={totalHeight}></canvas><svg width={totalWidth} height={totalHeight}></svg></div>;
};

/**
 * Deselects all rows.
 */
Matrix.clear = () => {
    Data.deselectAll();
};

/**
 * Draws the grid, the graphs, and the axes.
 *
 * @param  {Object}     ref                 reference to DIV
 * @param  {number}     width               width in pixels
 * @param  {number}     height              height in pixels
 * @param  {number}     i                   column index, or <0 to draw all
 * @param  {number}     j                   row index, or <0 to draw all
 * @param  {number[]}   selectedRowIndices  indices of selected rows
 * @param  {boolean}    isDrawingGrid       true iff clearing and redrawing the grid
 */
Matrix.draw = ( ref, width, height, i, j, selectedRowIndices, isDrawingGrid ) => {
    
    // Initialization.  If no context, do nothing.
    const nColumns = 3,
        nRows = 3;
    if( !ref ) {
        return;
    }
    let canvas = ref.current.firstChild,
        g = canvas.getContext( "2d" );
    if( !g ) {
        return;
    }
    
    // Calculate the sums.
    let rows = Data.getRows(),
        sums = Array.from( d3.rollup( rows, v => d3.sum( v, d => d[ 2 ]), d => d[ 0 ])),
        selectedRows = rows.filter(( d, index ) => selectedRowIndices.includes( index )),
        zeroes = sums.map(( x ) => [ x[ 0 ], 0, 0 ]),
        selectedSums = Array.from( d3.rollup( selectedRows.concat( zeroes), v => d3.sum( v, d => d[ 2 ]), d => d[ 0 ]));
    
    // Draws a graph.
    let drawGraph = ( ref, width, height, i, j, selectedRowIndices ) => {
    
        // Get the position and the selection.
        let x = i * width,
            y = j * height;
        let k = i + nColumns * j;
        const svg = d3.select( ref.current.childNodes[ 1 ]);
        let selection = d3.select( svg.node().firstChild.childNodes[ k ]);
        
        // Draw the graph.
        switch( k ) {
            case 0:
                Bar.draw( selection, x, y, width, height, sums, selectedSums );
                break;
            case 1:
                // Horizontal Bar
                break;
            case 2:
                // Area
                break;
            case 3:
                // Line
                break;
            case 4:
                Plot.draw( selection, x, y, width, height, sums, selectedSums );
                break;
            case 5:
                // Box
                break;
            case 6:
                // Map
                break;
            case 7:
                Pie.draw( selection, x, y, width, height, sums, selectedSums, 0 );
                break;
            case 8:
                Pie.draw( selection, x, y, width, height, sums, selectedSums, 0.5 );
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
        drawGraph( ref, width, height, i, j, selectedRowIndices );
    } else {
        for( let j = 0; ( j < nRows ); j++ ) {
            for( let i = 0; ( i < nColumns ); i++ ) {
                drawGraph( ref, width, height, i, j, selectedRowIndices );
            }
        }
    }
};

export default Matrix;
