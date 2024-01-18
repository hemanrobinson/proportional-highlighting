import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';


/**
 * Pie chart in an SVG element.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const PieChart = ( props ) => {
};

/**
 * Draws the pie chart.
 *
 * @param  {number}  x        X coordinate, in pixels
 * @param  {number}  y        Y coordinate, in pixels
 * @param  {number}  width    width, in pixels
 * @param  {number}  height   height, in pixels
 * @param  {Element} canvas   CANVAS element
 * @param  {number}  nData    number of data values
 * @param  {number}  index    column index
 */
PieChart.draw = ( x, y, width, height, canvas, nData, index ) => {
    d3.select( "#Pie" ).selectAll( "text" ).remove();
    d3.select( "#Pie" )
        .append( "text" )
        .attr( "x", width / 2 - 30 )
        .attr( "y", height / 2 + 5 )
        .attr( "fill", "black" )
        .text( "Pie Chart" );
};

export default PieChart;
