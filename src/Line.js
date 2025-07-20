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
        xScale = d3.scaleLinear()
            .domain([ 0, values.length - 1 ])
            .range([ width * ( margin + offset ), width * ( 1 - margin + offset )]),
        yScale = d3.scaleLinear()
            .domain([ d3.min( values, d => d[ 1 ]), d3.max( values, d => d[ 1 ])])
            .range([ height * ( 1 - margin ), height * margin ]);
    let selected, line;
    Graph.draw( selection, label, x, y, width, height, yScale, false );
    
    // Convert the X values to numbers.
    let myValues = [];
    values.forEach(( d, i ) => {
        myValues.push([ i, d[ 1 ]]);
    });
    
    // Draw the deselected line.
    selection
        .append( "path" )
        .datum( myValues )
        .attr( "d", d3.line()
            .x(( d ) => xScale( d[ 0 ]))
            .y(( d ) => yScale( d[ 1 ]))
        )
        .classed( 'strokeAll', true );
    
    // Draw the selected line: if separate from the deselected line...
    if( !isColocated ) {
    
        // If the deselected line crosses the axis, add that point to the selected line.
        let myValuesSelected = [];
        valuesSelected.forEach(( d, i ) => {
            myValuesSelected.push([ i, d[ 1 ]]);
            if( i < myValues.length - 1 ) {
                let e = myValues[ i ];
                let f = myValues[ i + 1 ];
                if((( e[ 1 ] < 0 ) && ( f[ 1 ] > 0 )) ||
                   (( e[ 1 ] > 0 ) && ( f[ 1 ] < 0 ))) {
                    myValuesSelected.push([ i + e[ 1 ] / ( e[ 1 ] - f[ 1 ]), 0 ]);
                }
            }
        });
        
        // Draw the selected line.
        selection
            .append( "path" )
            .datum( myValuesSelected )
            .attr( "d", d3.line()
                .x(( d ) => xScale( d[ 0 ]))
                .y(( d ) => yScale( d[ 1 ]))
            )
            .classed( 'strokeSelected', true );
     }
     
     // ...or if colocated.
     else {

        // Create a new Array that includes two intermediate values between adjacent vertices.
        myValues = [];
        values.forEach(( d, i ) => {
            myValues.push([ i, d[ 1 ]]);
            if( i < values.length - 1 ) {
                myValues.push([ i + 0.5, ( d[ 1 ] + values[ i + 1 ][ 1 ]) / 2 ]);
                myValues.push([ i + 0.5, ( d[ 1 ] + values[ i + 1 ][ 1 ]) / 2 ]);
            }
        });

        // Accumulate the selected line segments.
        selected = [];
        line = [];
        values.forEach(( d, i ) => {
            const [ x0, y0 ] = myValues[ 3 * i ],
                f = d[ 1 ] ? valuesSelected[ i ][ 1 ] / d[ 1 ] : 0;
            let x1, y1;
            if( f && ( i > 0 )) {
                [ x1, y1 ] = myValues[ 3 * i - 1 ];
                line.push([ x0 + f * ( x1 - x0 ), y0 + f * ( y1 - y0 )]);
            }
            line.push( myValues[ 3 * i ]);
            if( f && ( i < values.length - 1 )) {
                [ x1, y1 ] = myValues[ 3 * i + 1 ];
                line.push([ x0 + f * ( x1 - x0 ), y0 + f * ( y1 - y0 )]);
            }
            selected.push( line );
            line = [];
        });
        
        // Draw the selected line segments.
        selected.forEach(( d ) => {
            selection
                .append( "path" )
                .datum( d )
                .attr( "d", d3.line()
                    .x(( d ) => xScale( d[ 0 ]))
                    .y(( d ) => yScale( d[ 1 ]))
                )
                .classed( 'strokeSelected', true );
        });
    }
}

export default Line;
