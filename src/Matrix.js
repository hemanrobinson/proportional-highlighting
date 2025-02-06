import React, { useRef, useEffect }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Area from './Area';
import Bar from './Bar';
import Box from './Box';
import Circle from './Circle';
import Line from './Line';
import Map from './Map';
import Points from './Points';
import TreeMap from './TreeMap';
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
        nColumns = 4,
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
        Matrix.draw( ref, nColumns, nRows, -1, -1, width, height, Data.selectedRowIndices, true );
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
 * @param  {number}     nColumns            number of columns
 * @param  {number}     nRows               number of rows
 * @param  {number}     i                   column index, or <0 to draw all
 * @param  {number}     j                   row index, or <0 to draw all
 * @param  {number}     width               width in pixels
 * @param  {number}     height              height in pixels
 * @param  {number[]}   selectedRowIndices  indices of selected rows
 * @param  {boolean}    isDrawingGrid       true iff clearing and redrawing the grid
 */
Matrix.draw = ( ref, nColumns, nRows, i, j, width, height, selectedRowIndices, isDrawingGrid ) => {
    
    // Initialization.  If no context, do nothing.
    if( !ref ) {
        return;
    }
    const canvas = ref.current.firstChild,
        g = canvas.getContext( "2d" );
    if( !g ) {
        return;
    }
    
    // Calculate the sums.
    const rows = Data.getRows(),
        rowsSelected = rows.filter(( d, index ) => selectedRowIndices.includes( index )),
        values = Array.from( d3.rollup( rows, v => d3.sum( v, d => d[ 1 ]), d => d[ 0 ])),
        zeroes = values.map(( x ) => [ x[ 0 ], 0, 0 ]),
        valuesSelected = Array.from( d3.rollup( rowsSelected.concat( zeroes ).sort(), v => d3.sum( v, d => d[ 1 ]), d => d[ 0 ]));
    
    // Draws a graph.
    const drawGraph = ( ref, width, height, i, j, selectedRowIndices ) => {
    
        // Get the position and the selection.
        const x = i * width,
            y = j * height,
            k = 1 + i + nColumns * j,
            svg = d3.select( ref.current.childNodes[ 1 ]),
            selection = d3.select( svg.node().firstChild.childNodes[ k - 1 ]),
            label = "" + k;
        
        // Draw the graph.
        switch( k ) {
            case 1:
                Bar.draw( selection, label, x, y, width, height, values, valuesSelected, false );
                break;
            case 2:
                Bar.draw( selection, label, x, y, width, height, values, valuesSelected, true );
                break;
            case 3:
                TreeMap.draw( selection, label, x, y, width, height, values, valuesSelected );
                break;
            case 4:
                Circle.draw( selection, label, x, y, width, height, values, valuesSelected, 0 );
                break;
            case 5:
                Area.draw( selection, label, x, y, width, height, values, valuesSelected );
                break;
            case 6:
                Line.draw( selection, label, x, y, width, height, values, valuesSelected, false );
                break;
            case 7:
                Line.draw( selection, label, x, y, width, height, values, valuesSelected, true );
                break;
            case 8:
                Circle.draw( selection, label, x, y, width, height, values, valuesSelected, 0.5 );
                break;
            case 9:
                Map.draw( selection, label, x, y, width, height, values, valuesSelected );
                break;
            case 10:
                Points.draw( selection, label, x, y, width, height, values, valuesSelected, false );
                break;
            case 11:
                Points.draw( selection, label, x, y, width, height, values, valuesSelected, true );
                break;
            case 12:
                Box.draw( selection, label, x, y, width, height, values, valuesSelected );
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
