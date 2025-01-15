import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Line in an SVG element.
 */
const Line = ( props ) => {
};

/**
 * Line style for proportional highlighting.
 */
Line.style = {
    SEPARATE: 0,
    DISCRETE: 1,
    CONTINUOUS: 2
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
 * @param  {number}  style          one of Line.style values
 */
Line.draw = ( selection, label, x, y, width, height, values, valuesSelected, style ) => {
    
    // Initialization.
    const margin = Graph.margin,
        offset = ( 1 - 2 * margin ) / values.length / 2,
        yScale = d3.scaleLinear()
            .domain([ d3.min( values, d => d[ 1 ]), d3.max( values, d => d[ 1 ])])
            .range([ height * ( 1 - margin ), height * margin ]);
    let xScale = d3.scaleBand()
            .domain( values.map( d => d[ 0 ]))
            .range([ width * ( margin + offset ), width * ( 1 - margin + offset )]),
        newValues, selected, line;
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
    switch( style ) {
    
        case Line.style.SEPARATE:
            selection
                .append( "path" )
                .datum( valuesSelected )
                .attr( "d", d3.line()
                    .x(( d ) => xScale( d[ 0 ]))
                    .y(( d ) => yScale( d[ 1 ]))
                )
                .classed( 'strokeSelected', true );
            break;
            
        case Line.style.DISCRETE:

            // Create a new Array that includes intermediate values.
            newValues = [];
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
            line = [];
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
            
            // Draw the selected line segments.
            selected.forEach(( d ) => {
                selection
                    .append( "path" )
                    .datum( d )
                    .attr( "d", d3.line()
                        .x(( d ) => xScale( d[ 0 ]))
                        .y(( d ) => yScale( d[ 1 ]))
                    )
                    .classed( 'strokeSelectedThick', true );
            });
            break;
            
        case Line.style.CONTINUOUS:

            // Create a new Array that includes two intermediate values.
            newValues = [];
            values.forEach(( d, i ) => {
                newValues.push([ i, d[ 1 ]]);
                if( i < values.length - 1 ) {
                    newValues.push([ i + 0.5, ( d[ 1 ] + values[ i + 1 ][ 1 ]) / 2 ]);
                    newValues.push([ i + 0.5, ( d[ 1 ] + values[ i + 1 ][ 1 ]) / 2 ]);
                }
            });
            
            // Create a continuous X scale. (Why does it need one more?)
            xScale = d3.scaleLinear()
                .domain([ 0, values.length ])
                .range([ width * ( margin + offset ), width * ( 1 - margin + offset )]);

            // Accumulate the selected line segments.
            selected = [];
            line = [];
            values.forEach(( d, i ) => {
                const [ x0, y0 ] = newValues[ 3 * i ],
                    f = d[ 1 ] ? valuesSelected[ i ][ 1 ] / d[ 1 ] : 0;
                let x1, y1;
                if( f && ( i > 0 )) {
                    [ x1, y1 ] = newValues[ 3 * i - 1 ];
                    line.push([ x0 + f * ( x1 - x0 ), y0 + f * ( y1 - y0 )]);
                }
                line.push( newValues[ 3 * i ]);
                if( f && ( i < values.length - 1 )) {
                    [ x1, y1 ] = newValues[ 3 * i + 1 ];
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
                    .classed( 'strokeSelectedThick', true );
            });
            break;
            
        default:
            break;
    }
}

export default Line;
