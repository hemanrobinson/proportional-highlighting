import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * TreeMap in an SVG element.
 */
const TreeMap = () => {
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
TreeMap.draw = ( selection, label, x, y, width, height, values, valuesSelected ) => {
    
    // Initialization.
    const margin = Graph.margin;
    Graph.draw( selection, label, x, y, width, height, undefined, false );

    // Get the absolute values.
//    const absValues = values.map( innerArray => [ innerArray[ 0 ], Math.abs( innerArray[ 1 ])]),
//        absValuesSelected = valuesSelected.map( innerArray => [ innerArray[ 0 ], Math.abs( innerArray[ 1 ])]);
    
    // Merge the values and selected values.
    let valuesMerged = [];
    values.forEach(( item, i ) => {
        valuesMerged.push([ values[ i ][ 0 ], values[ i ][ 1 ], valuesSelected[ i ][ 1 ]]);
    });
    
    // Add a root to the data, and filter only the positive values.
    const data = { name: "root", children: valuesMerged.filter(( d ) => ( d[ 1 ] >= 0 ))};
    
    // Create a treemap layout.
    const treemap = d3.treemap().size([ width * ( 1 - 2 * margin ), height * ( 1 - 2 * margin )]);

    // Create a hierarchy and calculate node sizes.
    const root = d3.hierarchy( data ).sum(d => d[ 1 ]);
    treemap( root );
    
    // Add elements for each node.
    const offset = 1;
    selection.selectAll( ".all" )
        .data( root.descendants())
        .enter()
        .append( "rect" )
        .attr( "x", d => width * margin + offset + d.x0 )
        .attr( "y", d => height * margin + offset + d.y0 )
        .attr( "width", d => d.x1 - d.x0 )
        .attr( "height", d => d.y1 - d.y0 )
        .classed( 'all', true );
    
    // Add elements for each selected node.
    selection.selectAll( ".selected" )
        .data( root.descendants())
        .enter()
        .append( "rect" )
        .attr( "x", d => width * margin + offset + d.x0 )
        .attr( "y", d => height * margin + offset + d.y0 + ( d.y1 - d.y0 ) * ( d.data[ 1 ] ? 1 - ( d.data[ 2 ] / d.data[ 1 ]) : 0 ))
        .attr( "width", d => d.x1 - d.x0 )
        .attr( "height", d => ( d.y1 - d.y0 ) * ( d.data[ 1 ] ? ( d.data[ 2 ] / d.data[ 1 ]) : 0 ))
        .classed( 'selected', true );
};

export default TreeMap;
