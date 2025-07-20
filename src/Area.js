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
        xScale = d3.scaleLinear()
            .domain([ 0, values.length - 1 ])
            .range([ width * ( margin + offset ), width * ( 1 - margin + offset )]),
        yScale = d3.scaleLinear()
            .domain([ d3.min( values, d => d[ 1 ]), d3.max( values, d => d[ 1 ])])
            .range([ height * ( 1 - margin ), height * margin ]);
    Graph.draw( selection, label, x, y, width, height, yScale, false );
    
    // Convert the X values to numbers.
    let myValues = [];
    values.forEach(( d, i ) => {
        myValues.push([ i, d[ 1 ]]);
    });
    
    // Draw the deselected area.
    selection
        .append( "path" )
        .datum( myValues )
        .attr( "d", d3.area()
            .x(( d ) => xScale( d[ 0 ]))
            .y0(( d ) => yScale( 0 ))
            .y1(( d ) => yScale( d[ 1 ]))
        )
        .classed( 'all', true );
    
    // If the deselected area crosses the axis, add that point to the selected area.
    let myValuesSelected = [];
    valuesSelected.forEach(( d, i ) => {
        myValuesSelected.push([ i, d[ 1 ]]);
        if( i < values.length - 1 ) {
            let e = values[ i ];
            let f = values[ i + 1 ];
            if((( e[ 1 ] < 0 ) && ( f[ 1 ] > 0 )) ||
               (( e[ 1 ] > 0 ) && ( f[ 1 ] < 0 ))) {
                myValuesSelected.push([ i + e[ 1 ] / ( e[ 1 ] - f[ 1 ]), 0 ]);
            }
        }
    });
    
    // Draw the selected area.
    selection
        .append( "path" )
        .datum( myValuesSelected )
        .attr( "d", d3.area()
            .x(( d ) => xScale( d[ 0 ]))
            .y0(( d ) => yScale( 0 ))
            .y1(( d ) => yScale( d[ 1 ]))
        )
        .classed( 'selected', true );
}

export default Area;
