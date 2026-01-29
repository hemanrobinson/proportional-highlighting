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
 * @param  {boolean} isStacked      true iff bars are stacked, otherwise not
 */
Bar.draw = ( selection, label, x, y, width, height, values, valuesSelected, isHorz, isStacked ) => {
    
    // Initialization.
    const margin = Graph.margin,
        xScale = d3.scaleBand()
            .domain( values.map( d => d[ 0 ]))
            .range([ width * margin, width * ( 1 - margin )])
            .padding( 0.1 ),
        yScale = d3.scaleLinear()
            .domain([ d3.min( values, d => d[ 1 ]), d3.max( values, d => d[ 1 ])])
            .range( isHorz ? [ height * margin, height * ( 1 - margin )] : [ height * ( 1 - margin ), height * margin ]);
    if( isStacked ) {
        yScale.domain([ 2 * d3.min( values, d => d[ 1 ]), 2 * d3.max( values, d => d[ 1 ])]);
    }
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
    selection.selectAll( ".fillSelected" )
        .data( valuesSelected )
        .enter()
        .append( "rect" )
        .classed( 'fillSelected', true )
        .attr( isHorz ? "y" : "x", ( d ) => xScale( d[ 0 ]))
        .attr( isHorz ? "x" : "y", ( d ) => ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? yScale( d[ 1 ]) : yScale( 0 ))
        .attr( isHorz ? "height" : "width", xScale.bandwidth())
        .attr( isHorz ? "width" : "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0,
             ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? ( yScale( 0 ) - yScale( d[ 1 ])) : ( yScale( d[ 1 ]) - yScale( 0 ))) : 0 ));
    
    // Draw the stacked bars.
    if( isStacked ) {
        let valuesAll = values.concat();
        valuesAll.forEach(( element, i ) => {
            element[ 2 ] = valuesSelected[ i ][ 1 ];
        });
        selection.selectAll( ".allStacked" )
            .data( values )
            .enter()
            .append( "rect" )
            .classed( 'allStacked', true )
            .attr( isHorz ? "y" : "x", ( d ) => xScale( d[ 0 ]))
            .attr( isHorz ? "x" : "y", ( d ) => ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? yScale( 2 * d[ 1 ]) : yScale( d[ 1 ]))
            .attr( isHorz ? "height" : "width", xScale.bandwidth())
            .attr( isHorz ? "width" : "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0,
                 ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? ( yScale( 0 ) - yScale( d[ 1 ])) : ( yScale( d[ 1 ]) - yScale( 0 ))) : 0 ));
        selection.selectAll( ".fillSelectedStacked" )
            .data( valuesAll )
            .enter()
            .append( "rect" )
            .classed( 'fillSelectedStacked', true )
            .attr( isHorz ? "y" : "x", ( d ) => xScale( d[ 0 ]))
            .attr( isHorz ? "x" : "y", ( d ) => ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? yScale( d[ 1 ] + d[ 2 ]) : yScale( d[ 1 ]))
            .attr( isHorz ? "height" : "width", xScale.bandwidth())
            .attr( isHorz ? "width" : "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0,
                 ( isHorz ? ( d[ 1 ] <= 0 ) : ( d[ 1 ] >= 0 )) ? ( yScale( 0 ) - yScale( d[ 2 ])) : ( yScale( d[ 2 ]) - yScale( 0 ))) : 0 ));
    }
};

export default Bar;
