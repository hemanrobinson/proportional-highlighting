import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Scatter plot in an SVG element.
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
 * Draws the plot.
 *
 * @param  {Element} selection      d3 selection
 * @param  {number}  x              X coordinate, in pixels
 * @param  {number}  y              Y coordinate, in pixels
 * @param  {number}  width          width, in pixels
 * @param  {number}  height         height, in pixels
 * @param  {Array}   sums           sums
 * @param  {Array}   sumsSelected   selected sums
 */
Plot.draw = ( selection, x, y, width, height, sums, sumsSelected ) => {
    
    // Initialization.
    selection.selectAll( "*" ).remove();
    
    selection
        .append( "text" )
        .attr( "x", width / 2 - 15 )
        .attr( "y", height / 2 + 5 )
        .attr( "fill", "black" )
        .text( "Plot" );
};

export default Plot;
