import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';

/**
 * Scatter plot in an SVG element.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const Plot = ( props ) => {
};
 
/**
 * Padding, in pixels.
 *
 * @constant {number}
 */
Plot.padding = 10;

/**
 * Selects rows within the brush and returns them.
 *
 * @param  {number}     x       X coordinate, in pixels
 * @param  {number}     y       Y coordinate, in pixels
 * @param  {number}     width   width, in pixels
 * @param  {number}     height  height, in pixels
 * @param  {number}     i       X column index
 * @param  {number}     j       Y column index
 * @param  {number[][]} scaled  scaled coordinates
 * @param  {Rect}       brush   brush
 * @return {number[]}   indices of selected rows
 */
Plot.select = ( x, y, width, height, i, j, scaled, brush ) => {
    
    // Initialization.
    let selectedRows = [];
    const scaledi = scaled[ i ],
        scaledj = scaled[ j ],
        nRows = scaledi.length,
        xMin = Math.floor( Math.min( brush.x, brush.x + brush.width ) - x ),
        xMax = Math.floor( Math.max( brush.x, brush.x + brush.width ) - x ),
        yMin = height - Math.floor( Math.max( brush.y, brush.y + brush.height ) - y ),
        yMax = height - Math.floor( Math.min( brush.y, brush.y + brush.height ) - y );
    
    // Collect the selected row indices and return them.
    for( let row = 0; ( row < nRows ); row++ ) {
        let xScaled = scaledi[ row ],
            yScaled = scaledj[ row ];
        if(( xMin <= xScaled ) && ( xScaled < xMax ) && ( yMin < yScaled ) && ( yScaled <= yMax )) {
            selectedRows.push( row );
        }
    };
    return selectedRows;
};

/**
 * Draws the plot.
 *
 * @param  {Element}    selection     d3 selection
 * @param  {number}     x             X coordinate, in pixels
 * @param  {number}     y             Y coordinate, in pixels
 * @param  {number}     width         width, in pixels
 * @param  {number}     height        height, in pixels
 * @param  {number}     i             X column index
 * @param  {number}     j             Y column index
 * @param  {number[][]} scaled        scaled coordinates
 * @param  {number[]}   selectedRows  indices of selected rows
 */
Plot.draw = ( selection, x, y, width, height, si, j, scaled, selectedRows ) => {
    selection.selectAll( "text" ).remove();
    selection
        .append( "text" )
        .attr( "x", width / 2 - 15 )
        .attr( "y", height / 2 + 5 )
        .attr( "fill", "black" )
        .text( "Plot" );
};

export default Plot;
