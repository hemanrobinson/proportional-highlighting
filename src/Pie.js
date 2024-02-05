import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';

/**
 * Pie chart in an SVG element.
 */
const Pie = () => {
};

/**
 * Draws the pie chart.
 *                              
 * @param  {Element} selection      d3 selection
 * @param  {number}  x              X coordinate, in pixels
 * @param  {number}  y              Y coordinate, in pixels
 * @param  {number}  width          width, in pixels
 * @param  {number}  height         height, in pixels
 * @param  {Array}   sums           sums
 * @param  {Array}   selectedSums   selected sums
 */
Pie.draw = ( selection,  x, y, width, height, sums, selectedSums ) => {
    
    // Initialization.
    selection.selectAll( "*" ).remove();
    
    selection
        .append( "text" )
        .attr( "x", width / 2 - 10 )
        .attr( "y", height / 2 + 5 )
        .attr( "fill", "black" )
        .text( "Pie" );
};

export default Pie;
