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
 * @param  {Array}   values         all values
 * @param  {Array}   valuesSelected selected values
 * @param  {boolean} isColocated    true if all and selected values occupy the same position; otherwise separate positions
 */
Points.draw = ( selection, x, y, width, height, values, valuesSelected, isColocated ) => {
    
    // Initialization.
    const margin = Graph.margin,
        offset = ( 1 - 2 * margin ) / values.length / 2,
        xScale = d3.scaleBand()
            .domain( values.map( d => d[ 0 ]))
            .range([ width * ( margin + offset ), width * ( 1 - margin + offset )]),
        yScale = d3.scaleLinear()
            .domain([ d3.min( values, d => d[ 1 ]), d3.max( values, d => d[ 1 ])])
            .range([ height * ( 1 - margin ), height * margin ]);
    Graph.draw( selection, x, y, width, height, yScale, false );
    
    // Draw the points.
    let radius = 3;
    selection.selectAll( ".fillAll" )
        .data( values )
        .enter()
        .append( "circle" )
        .attr( "cx", ( d ) => xScale( d[ 0 ]))
        .attr( "cy", ( d ) => yScale( d[ 1 ]))
        .attr( "r", radius )
        .classed( 'fillAll', true );
    
    // Draw the selected points.
    let selected = valuesSelected;
    if( isColocated ) {
        radius = 3.5;
        selected = [];
        valuesSelected.forEach(( d, i ) => {
            const a = values[ i ];
            if( a[ 1 ] && ( d[ 1 ] / a[ 1 ] > 0 )) {
                selected.push( a );
            }
        });
    }
    selection.selectAll( ".fillSelected" )
        .data( selected )
        .enter()
        .append( "circle" )
        .attr( "cx", ( d ) => xScale( d[ 0 ]))
        .attr( "cy", ( d ) => yScale( d[ 1 ]))
        .attr( "r", radius )
        .classed( 'fillSelected', true );
}

export default Points;
