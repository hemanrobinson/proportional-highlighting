import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Circle in an SVG element.
 */
const Circle = () => {
};

/**
 * Draws the graph.
 *                              
 * @param  {Element} selection      d3 selection
 * @param  {number}  x              X coordinate, in pixels
 * @param  {number}  y              Y coordinate, in pixels
 * @param  {number}  width          width, in pixels
 * @param  {number}  height         height, in pixels
 * @param  {Array}   sums           sums
 * @param  {Array}   sumsSelected   selected sums
 * @param  {number}  radiusStart    a percentage between 0 and 1, 0 for pie charts, >0 for doughnut charts
 */
Circle.draw = ( selection, x, y, width, height, sums, sumsSelected, radiusStart ) => {
    
    // Initialization.
    Graph.draw( selection, x, y, width, height );
    const margin = Graph.margin,
        outerRadius = Math.min( width, height ) * ( 1 - 2 * margin ) / 2,
        innerRadius = radiusStart * outerRadius;

    // Compute the position of each slice.
    let data = d3.pie()( d3.map( sums, ( x ) => x[ 1 ]));
    data.forEach(( d, i ) => { d.selectedValue = sumsSelected[ i ][ 1 ]; });
    data = data.filter(( d ) => ( d.value >= 0 ));
    
    // Draw the slices.
    const x0 = Math.floor( width / 2 ) + 0.5,
        y0 = Math.floor( height / 2 ) + 0.5;
    selection.selectAll( ".all" )
        .data( data )
        .enter()
        .append( 'path' )
        .attr( "transform", "translate( " + x0 + "," + y0 + " )")
        .classed( 'all', true )
        .attr( 'd', d3.arc()
            .innerRadius( innerRadius )
            .outerRadius( outerRadius )
        )
    selection.selectAll( ".selected" )
        .data( data )
        .enter()
        .append( 'path' )
        .attr( "transform", "translate( " + x0 + "," + y0 + " )")
        .classed( 'selected', true )
        .attr( 'd', d3.arc()
            .innerRadius( innerRadius )
            .outerRadius(( d ) => ( innerRadius + ( outerRadius - innerRadius ) * Math.sqrt( d.selectedValue / d.value )))
        )
};

export default Circle;
