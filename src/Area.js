import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Area in an SVG element.
 */
const Area = ( props ) => {
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
Area.draw = ( selection, x, y, width, height, sums, sumsSelected ) => {
    
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
    
    // Draw the area.
    selection
        .append( "path" )
        .datum( sums )
        .attr( "d", d3.area()
            .x(( d ) => xScale( d[ 0 ]))
            .y0(( d ) => yScale( 0 ))
            .y1(( d ) => yScale( d[ 1 ]))
        )
        .classed( 'all', true )
    selection
        .append( "path" )
        .datum( sumsSelected )
        .attr( "d", d3.area()
            .x(( d ) => xScale( d[ 0 ]))
            .y0(( d ) => yScale( 0 ))
            .y1(( d ) => yScale( d[ 1 ]))
        )
        .classed( 'selected', true )
        
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

export default Area;
