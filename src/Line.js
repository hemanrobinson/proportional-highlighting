import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Line in an SVG element.
 */
const Line = ( props ) => {
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
 * @param  {boolean} isColocated    true if all and selected values occupy the same position; otherwise separate positions
 */
Line.draw = ( selection, label, x, y, width, height, values, valuesSelected, isColocated ) => {
    
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
    
    // Draw the line.
    selection
        .append( "path" )
        .datum( values )
        .attr( "d", d3.line()
            .x(( d ) => xScale( d[ 0 ]))
            .y(( d ) => yScale( d[ 1 ]))
        )
        .classed( 'strokeAll', true );
    
    // Draw the selected line.
    let selected = [ valuesSelected ];
    if( isColocated ) {

        // Create a new Array that includes intermediate values.
        let newValues = [];
        values.forEach(( d, i ) => {
            newValues.push([ 2 * i, d[ 1 ]]);
            if( i < values.length - 1 ) {
                newValues.push([ 2 * i + 1, ( d[ 1 ] + values[ i + 1 ][ 1 ]) / 2 ]);
            }
        });

        // Add intermediate values to the X scale. (Why does it need one more?)
        xScale.domain( newValues.map( d => d[ 0 ]).concat([ newValues.length ]));

        // Identify the selected line segments.
        let selectedIndices = [];
        valuesSelected.forEach(( d, i ) => {
            const a = values[ i ];
            if( a[ 1 ] && ( d[ 1 ] / a[ 1 ] > 0 )) {
                selectedIndices.push( i );
            }
        });

        // Accumulate the selected line segments.
        selected = [];
        let line = [];
        selectedIndices.forEach(( d, i ) => {
            const j = selectedIndices[ i ];
            if(( j > 0 ) && ( line.length === 0 )) {
                line.push( newValues[ 2 * j - 1 ]);
            }
            line.push( newValues[ 2 * j ]);
            if( j < values.length - 1 ) {
                line.push( newValues[ 2 * j + 1 ]);
            }
            if(( i === selectedIndices.length - 1 ) || ( selectedIndices[ i + 1 ] > selectedIndices[ i ] + 1 )) {
                selected.push( line );
                line = [];
            }
        });
    }
    selected.forEach(( d ) => {
        selection
            .append( "path" )
            .datum( d )
            .attr( "d", d3.line()
                .x(( d ) => xScale( d[ 0 ]))
                .y(( d ) => yScale( d[ 1 ]))
            )
            .classed( isColocated ? 'strokeSelectedThick' : 'strokeSelected', true );
    });
}

export default Line;
