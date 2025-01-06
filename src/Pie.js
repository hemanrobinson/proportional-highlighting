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
    const radius = Math.min( width, height ) / 2 - 20;
    selection.selectAll( "*" ).remove();

    // Compute the position of each slice of the pie.
    const data = d3.pie()( d3.map( sums, ( x ) => Math.abs( x[ 1 ])));
    data.forEach(( d, i ) => { d.selectedValue = Math.abs( selectedSums[ i ][ 1 ]); });

    // Draw the pie slices.
    selection.selectAll( ".all" )
        .data( data )
        .enter()
        .append( 'path' )
        .attr( "transform", "translate( " + width / 2 + "," + height / 2 + " )")
        .classed( 'all', true )
        .attr( 'd', d3.arc()
            .innerRadius( 0 )
            .outerRadius( radius )
        )
    selection.selectAll( ".selected" )
        .data( data )
        .enter()
        .append( 'path' )
        .attr( "transform", "translate( " + width / 2 + "," + height / 2 + " )")
        .classed( 'selected', true )
        .attr( 'd', d3.arc()
            .innerRadius( 0 )
            .outerRadius(( d ) => ( radius * Math.sqrt( d.selectedValue / d.value )))
        )
};

export default Pie;
