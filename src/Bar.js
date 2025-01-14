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
 * @param  {string}  label          label, or none if undefined
 * @param  {number}  x              X coordinate, in pixels
 * @param  {number}  y              Y coordinate, in pixels
 * @param  {number}  width          width, in pixels
 * @param  {number}  height         height, in pixels
 * @param  {Array}   values         all values
 * @param  {Array}   valuesSelected selected values
 * @param  {boolean} isHorz         true iff graph is horizontal, otherwise vertical
 */
Bar.draw = ( selection, label, x, y, width, height, values, valuesSelected, isHorz ) => {
    
    // Initialization.
    const margin = Graph.margin,
        xScale = d3.scaleBand()
            .domain( values.map( d => d[ 0 ]))
            .range([ width * margin, width * ( 1 - margin )])
            .padding( 0.1 ),
        yScale = d3.scaleLinear()
            .domain([ d3.min( values, d => d[ 1 ]), d3.max( values, d => d[ 1 ])])
            .range( isHorz ? [ height * margin, height * ( 1 - margin )] : [ height * ( 1 - margin ), height * margin ]);
    Graph.draw( selection, label, x, y, width, height, yScale, isHorz );
    
    // Draw the bars.
    selection.selectAll( ".all" )
        .data( values )
        .enter()
        .append( "rect" )
        .classed( 'all', true )
        .attr( isHorz ? "y" : "x", ( d ) => xScale( d[ 0 ]))
        .attr( isHorz ? "x" : "y", ( d ) => ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? yScale( d[ 1 ]) : yScale( 0 ))
        .attr( isHorz ? "height" : "width", xScale.bandwidth())
        .attr( isHorz ? "width" : "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0,
             ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? ( yScale( 0 ) - yScale( d[ 1 ])) : ( yScale( d[ 1 ]) - yScale( 0 ))) : 0 ));
    selection.selectAll( ".selected" )
        .data( valuesSelected )
        .enter()
        .append( "rect" )
        .classed( 'selected', true )
        .attr( isHorz ? "y" : "x", ( d ) => xScale( d[ 0 ]))
        .attr( isHorz ? "x" : "y", ( d ) => ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? yScale( d[ 1 ]) : yScale( 0 ))
        .attr( isHorz ? "height" : "width", xScale.bandwidth())
        .attr( isHorz ? "width" : "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0,
             ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? ( yScale( 0 ) - yScale( d[ 1 ])) : ( yScale( d[ 1 ]) - yScale( 0 ))) : 0 ));
};

export default Bar;
