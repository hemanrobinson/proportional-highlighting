import * as d3 from 'd3';
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
 * @param  {number}  radiusStart    a percentage between 0 and 1, 0 for pie charts, >0 for doughnut charts
 */
Pie.draw = ( selection, x, y, width, height, sums, selectedSums, radiusStart ) => {
    
    // Initialization.
    const outerRadius = Math.min( width, height ) / 2 - 20,
        innerRadius = radiusStart * outerRadius;
    selection.selectAll( "*" ).remove();

    // Compute the position of each slice of the pie.
    let data = d3.pie()( d3.map( sums, ( x ) => x[ 1 ]));
    data.forEach(( d, i ) => { d.selectedValue = selectedSums[ i ][ 1 ]; });
    data = data.filter(( d ) => ( d.value >= 0 ));
    
    console.log( innerRadius, outerRadius );
    
    // Draw the pie slices.
    selection.selectAll( ".all" )
        .data( data )
        .enter()
        .append( 'path' )
        .attr( "transform", "translate( " + width / 2 + "," + height / 2 + " )")
        .classed( 'all', true )
        .attr( 'd', d3.arc()
            .innerRadius( innerRadius )
            .outerRadius( outerRadius )
        )
    selection.selectAll( ".selected" )
        .data( data )
        .enter()
        .append( 'path' )
        .attr( "transform", "translate( " + width / 2 + "," + height / 2 + " )")
        .classed( 'selected', true )
        .attr( 'd', d3.arc()
            .innerRadius( innerRadius )
            .outerRadius(( d ) => ( innerRadius + ( outerRadius - innerRadius ) * Math.sqrt( d.selectedValue / d.value )))
        )
};

export default Pie;
