import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Points in an SVG element.
 */
const Points = ( props ) => {
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
 */
Points.draw = ( selection, x, y, width, height, sums, sumsSelected ) => {
    
    // Initialization.
    Graph.draw( selection, x, y, width, height );
    const margin = Graph.margin,
        offset = ( 1 - 2 * margin ) / sums.length / 2,
        xScale = d3.scaleBand()
            .domain( sums.map( d => d[ 0 ]))
            .range([ width * ( margin + offset ), width * ( 1 - margin + offset )]),
        yScale = d3.scaleLinear()
            .domain([ d3.min( sums, d => d[ 1 ]), d3.max( sums, d => d[ 1 ])])
            .range([ height * ( 1 - margin ), height * margin ]);
    
    // Draw the points.
    const radius = 3;
    selection.selectAll( ".fillAll" )
        .data( sums )
        .enter()
        .append( "circle" )
        .attr( "cx", ( d ) => xScale( d[ 0 ]))
        .attr( "cy", ( d ) => yScale( d[ 1 ]))
        .attr( "r", radius )
        .classed( 'fillAll', true )
    selection.selectAll( ".fillSelected" )
        .data( sumsSelected )
        .enter()
        .append( "circle" )
        .attr( "cx", ( d ) => xScale( d[ 0 ]))
        .attr( "cy", ( d ) => yScale( d[ 1 ]))
        .attr( "r", radius )
        .classed( 'fillSelected', true )
        
    // Draw the axis.
    selection.selectAll( "line" )
        .data( sums )
        .enter()
        .append( "line" )
        .classed( 'grid', true )
        .attr( "x1", width * margin / 1.2 )
        .attr( "y1", yScale( 0 ))
        .attr( "x2", width * ( 1 - margin / 1.2 ))
        .attr( "y2", yScale( 0 ))
}

export default Points;
