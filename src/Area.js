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
 * @param  {string}  label          label, or none if undefined
 * @param  {number}  x              X coordinate, in pixels
 * @param  {number}  y              Y coordinate, in pixels
 * @param  {number}  width          width, in pixels
 * @param  {number}  height         height, in pixels
 * @param  {Array}   values         all values
 * @param  {Array}   valuesSelected selected values
 */
Area.draw = ( selection, label, x, y, width, height, values, valuesSelected ) => {
    
    // Initialization.
    const margin = Graph.margin,
        offset = ( 1 - 2 * margin ) / values.length / 2,
        xScale = d3.scaleBand()
            .domain( values.map( d => d[ 0 ]))
            .range([ width * ( margin + offset ), width * ( 1 - margin + offset )]),
        yScale = d3.scaleLinear()
            .domain([ d3.min( values, d => d[ 1 ]), d3.max( values, d => d[ 1 ])])
            .range([ height * ( 1 - margin ), height * margin ]);
    Graph.draw( selection, label, x, y, width, height, yScale, false );
    
    // Draw the area.
    selection
        .append( "path" )
        .datum( values )
        .attr( "d", d3.area()
            .x(( d ) => xScale( d[ 0 ]))
            .y0(( d ) => yScale( 0 ))
            .y1(( d ) => yScale( d[ 1 ]))
        )
        .classed( 'all', true )
    selection
        .append( "path" )
        .datum( valuesSelected )
        .attr( "d", d3.area()
            .x(( d ) => xScale( d[ 0 ]))
            .y0(( d ) => yScale( 0 ))
            .y1(( d ) => yScale( d[ 1 ]))
        )
        .classed( 'selected', true )
}

export default Area;
