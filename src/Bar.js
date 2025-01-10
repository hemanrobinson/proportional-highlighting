import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Bars in an SVG element.
 */
const Bar = () => {
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
 * @param  {boolean} isHorz         true iff bars are horizontal, otherwise vertical
 */
Bar.draw = ( selection, x, y, width, height, sums, sumsSelected, isHorz ) => {
    
    // Initialization.
    Graph.draw( selection, x, y, width, height );
    const margin = Graph.margin,
        xScale = d3.scaleBand()
            .domain( sums.map( d => d[ 0 ]))
            .range([ width * margin, width * ( 1 - margin )])
            .padding( 0.1 ),
        yScale = d3.scaleLinear()
            .domain([ d3.min( sums, d => d[ 1 ]), d3.max( sums, d => d[ 1 ])])
            .range( isHorz ? [ height * margin, height * ( 1 - margin )] : [ height * ( 1 - margin ), height * margin ]);
    
    // Draw the bars.
    selection.selectAll( ".all" )
        .data( sums )
        .enter()
        .append( "rect" )
        .classed( 'all', true )
        .attr( isHorz ? "y" : "x", ( d ) => xScale( d[ 0 ]))
        .attr( isHorz ? "x" : "y", ( d ) => ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? yScale( d[ 1 ]) : yScale( 0 ))
        .attr( isHorz ? "height" : "width", xScale.bandwidth())
        .attr( isHorz ? "width" : "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0,
             ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? ( yScale( 0 ) - yScale( d[ 1 ])) : ( yScale( d[ 1 ]) - yScale( 0 ))) : 0 ));
    selection.selectAll( ".selected" )
        .data( sumsSelected )
        .enter()
        .append( "rect" )
        .classed( 'selected', true )
        .attr( isHorz ? "y" : "x", ( d ) => xScale( d[ 0 ]))
        .attr( isHorz ? "x" : "y", ( d ) => ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? yScale( d[ 1 ]) : yScale( 0 ))
        .attr( isHorz ? "height" : "width", xScale.bandwidth())
        .attr( isHorz ? "width" : "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0,
             ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? ( yScale( 0 ) - yScale( d[ 1 ])) : ( yScale( d[ 1 ]) - yScale( 0 ))) : 0 ));
             
    // Draw the axis.
    selection.selectAll( "line" )
        .data( sums )
        .enter()
        .append( "line" )
        .classed( 'grid', true )
        .attr( isHorz ? "y1" : "x1", width * margin / 1.2 )
        .attr( isHorz ? "x1" : "y1", yScale( 0 ))
        .attr( isHorz ? "y2" : "x2", width * ( 1 - margin / 1.2 ))
        .attr( isHorz ? "x2" : "y2", yScale( 0 ))
};

export default Bar;
