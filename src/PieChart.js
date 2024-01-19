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
 * @param  {Element} selection  d3 selection
 * @param  {Element} canvas     CANVAS element
 * @param  {number}  x          X coordinate, in pixels
 * @param  {number}  y          Y coordinate, in pixels
 * @param  {number}  width      width, in pixels
 * @param  {number}  height     height, in pixels
 * @param  {number}  nData      number of data values
 * @param  {number}  index      column index
 */
PieChart.draw = ( selection, canvas, x, y, width, height, nData, index ) => {
    selection.selectAll( "text" ).remove();
    selection
        .append( "text" )
        .attr( "x", width / 2 - 30 )
        .attr( "y", height / 2 + 5 )
        .attr( "fill", "black" )
        .text( "Pie Chart" );
};

export default PieChart;
