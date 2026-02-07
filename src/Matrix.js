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
        { type, percentSelected } = props,
        width = 200,
        height = 200;
    
    // Get the numbers of rows and columns.
    let nColumns = 1, nRows = 1;
    switch( type ) {
        case "bar":         nColumns = 2; nRows = 1; break;
        case "stacked":     nColumns = 2; nRows = 1; break;
        case "treemap":     nColumns = 1; nRows = 1; break;
        case "pie":         nColumns = 2; nRows = 2; break;
        case "bubble":      nColumns = 2; nRows = 1; break;
        case "area":        nColumns = 2; nRows = 1; break;
        case "map":         nColumns = 1; nRows = 1; break;
        case "linear":      nColumns = 2; nRows = 1; break;
        case "small":       nColumns = 2; nRows = 1; break;
        case "mixed":       nColumns = 2; nRows = 1; break;
        default: break;
    }
    const totalWidth = nColumns * width,
        totalHeight = nRows * height
    
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
        Matrix.draw( ref, nColumns, nRows, width, height, type, Data.selectedRowIndices, true );
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
 * @param  {number}     width               width in pixels
 * @param  {number}     height              height in pixels
 * @param  {string}     type                glyph type: "rectangular", "pie", "bubble", "complex", "linear", "small", or "mixed"
 * @param  {number[]}   selectedRowIndices  indices of selected rows
 * @param  {boolean}    isDrawingGrid       true iff clearing and redrawing the grid
 */
Matrix.draw = ( ref, nColumns, nRows, width, height, type, selectedRowIndices, isDrawingGrid ) => {
    
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
    
    // Get the childNodes and the values.
    const svg = d3.select( ref.current.childNodes[ 1 ]),
        childNodes = svg.node().firstChild.childNodes,
        label = "",
        value = [[ 'Total', values.reduce(( v, d ) => v + d[ 1 ], 0 )]],
        valueSelected = [[ 'Total', valuesSelected.reduce(( v, d ) => v + d[ 1 ], 0 )]]
    
    // Draw the matrix.
    switch( type ) {
        case "bar":
            Bar.draw( d3.select( childNodes[ 0 ]), label,     0, 0, width, height, values, valuesSelected, false );
            Bar.draw( d3.select( childNodes[ 1 ]), label, width, 0, width, height, values, valuesSelected, true );
            break;
        case "stacked":
            Bar.draw( d3.select( childNodes[ 0 ]), label,     0, 0, width, height, values, valuesSelected, false, true );
            Bar.draw( d3.select( childNodes[ 1 ]), label, width, 0, width, height, values, valuesSelected, true,  true );
            break;
        case "treemap":
            TreeMap.draw( d3.select( childNodes[ 0 ]), label, 0, 0, width, height, values, valuesSelected );
            break;
        case "pie":
            Circle.draw( d3.select( childNodes[ 0 ]), label,     0,      0, width, height, values, valuesSelected, 0 );
            Circle.draw( d3.select( childNodes[ 1 ]), label, width,      0, width, height, values, valuesSelected, 0,   true );
            Circle.draw( d3.select( childNodes[ 2 ]), label,     0, height, width, height, values, valuesSelected, 0.5 );
            Circle.draw( d3.select( childNodes[ 3 ]), label, width, height, width, height, values, valuesSelected, 0.5, true );
            break;
        case "bubble":
            Circle.draw( d3.select( childNodes[ 0 ]), label, 0,      0, width, height, value, valueSelected, 0 );
            Circle.draw( d3.select( childNodes[ 1 ]), label, 0, height, width, height, value, valueSelected, 0, true );
            break;
        case "area":
            Area.draw( d3.select( childNodes[ 0 ]),   label,     0,      0, width, height, values, valuesSelected );
            Bar.draw( d3.select( childNodes[ 1 ]),    label, width,      0, width, height, values, valuesSelected, false );
            break;
        case "map":
            Map.draw( d3.select( childNodes[ 0 ]), label, width, 0, width, height, values, valuesSelected );
            break;
        case "linear":
            Line.draw( d3.select( childNodes[ 0 ]), label,     0, 0, width, height, values, valuesSelected, false );
            Line.draw( d3.select( childNodes[ 1 ]), label, width, 0, width, height, values, valuesSelected, true );
            break;
        case "small":
            Points.draw( d3.select( childNodes[ 0 ]), label,     0, 0, width, height, values, valuesSelected, false );
            Points.draw( d3.select( childNodes[ 1 ]), label, width, 0, width, height, values, valuesSelected, true );
            break;
        case "mixed":
            Box.draw( d3.select( childNodes[ 0 ]), label, 0, 0, width, height, values, valuesSelected, true );
            Box.draw( d3.select( childNodes[ 1 ]), label, 0, 0, width, height, values, valuesSelected );
            break;
        default:
            break;
    }
};

export default Matrix;
