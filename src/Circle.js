import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Circle in an SVG element.
 */
const Circle = () => {
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
 * @param  {number}  radiusStart    a percentage between 0 and 1, 0 for pie charts, >0 for doughnut charts
 * @param  {boolean} isAngle        true iff highlighting origin is at angle, otherwise at center
 */
Circle.draw = ( selection, label, x, y, width, height, values, valuesSelected, radiusStart, isAngle ) => {
    
    // Initialization.
    const margin = Graph.margin,
        outerRadius = Math.min( width, height ) * ( 1 - 2 * margin ) / 2,
        innerRadius = radiusStart * outerRadius;
    Graph.draw( selection, label, x, y, width, height, undefined, false );
    const x0 = Math.floor( width / 2 ) + 0.5,
        y0 = Math.floor( height / 2 ) + 0.5,
        pie = d3.pie().sort( null );    // Default start angle is at 12 o'clock, and positive angles proceed clockwise.

    // Get the absolute values.
//    const absValues = values.map( innerArray => [ innerArray[ 0 ], Math.abs( innerArray[ 1 ])]),
//        absValuesSelected = valuesSelected.map( innerArray => [ innerArray[ 0 ], Math.abs( innerArray[ 1 ])]);
    
    // Draw the slices with highlighting origin at an angle...
    if( isAngle ) {
        
        // Merge the values and selected values.
        let valuesMerged = [];
        values.forEach(( item, i ) => {
            valuesMerged.push([ values[ i ][ 0 ], valuesSelected[ i ][ 1 ]]);
            valuesMerged.push([ values[ i ][ 0 ], values[ i ][ 1 ] - valuesSelected[ i ][ 1 ]]);
        });
        
        // Compute the position of each slice.
        let data = pie( d3.map( valuesMerged, ( x ) => x[ 1 ]));
        
        // Draw the slices.
        selection.selectAll( ".all" )
            .data( data )
            .enter()
            .append( 'path' )
            .attr( "transform", "translate( " + x0 + "," + y0 + " )")
            .classed( "all", ( d, i ) => i % 2 === 1 )
            .classed( "selected", ( d, i ) => i % 2 === 0 )
            .attr( 'd', d3.arc()
                .innerRadius( innerRadius )
                .outerRadius( outerRadius )
            )
    }
    
    // ...or at the center
    else {
    
        // Compute the position of each slice.
        let data = pie( d3.map( values, ( x ) => x[ 1 ]));
        data.forEach(( d, i ) => { d.selectedValue = valuesSelected[ i ][ 1 ]; });
    
        // Draw the deselected slices, then the selected slices.
        selection.selectAll( ".all" )
            .data( data )
            .enter()
            .append( 'path' )
            .attr( "transform", "translate( " + x0 + "," + y0 + " )")
            .classed( 'all', true )
            .attr( 'd', d3.arc()
                .innerRadius( innerRadius )
                .outerRadius( outerRadius )
            )
        selection.selectAll( ".selected" )
            .data( data )
            .enter()
            .append( 'path' )
            .attr( "transform", "translate( " + x0 + "," + y0 + " )")
            .classed( 'selected', true )
            .attr( 'd', d3.arc()
                .innerRadius( innerRadius )
                .outerRadius(( d ) => ( innerRadius + ( outerRadius - innerRadius ) * Math.sqrt( d.selectedValue / d.value )))
            )
    }
};

export default Circle;
