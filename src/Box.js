import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Box plot in an SVG element.
 */
const Box = () => {
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
Box.draw = ( selection, label, x, y, width, height, values, valuesSelected ) => {
    
    // Initialization.
    const margin = Graph.margin,
        xScale = d3.scaleBand()
            .domain( values.map( d => d[ 0 ]))
            .range([ width * margin, width * ( 1 - margin )])
            .padding( 0.1 ),
        yScale = d3.scaleLinear()
            .domain([ d3.min( values, d => d[ 1 ]), d3.max( values, d => d[ 1 ])])
            .range([ height * ( 1 - margin ), height * margin ]);
    Graph.draw( selection, label, x, y, width, height, yScale, false );
    
    // create dummy data
    var data = [12,19,11,13,12,22,13,4,15,16,18,19,20,12,11,9]

    // Compute summary statistics used for the box:
    var data_sorted = data.sort(d3.ascending)
    var q1 = d3.quantile(data_sorted, .25)
    var median = d3.quantile(data_sorted, .5)
    var q3 = d3.quantile(data_sorted, .75)
    var interQuantileRange = q3 - q1
    var min = q1 - 1.5 * interQuantileRange
    var max = q1 + 1.5 * interQuantileRange

    // Show the Y scale
    var y = d3.scaleLinear()
      .domain([0,24])
      .range([height, 0]);

    // Draw the box plot.
    var center = height / 2;
    selection.selectAll( ".all" )
        .append("line") // main vertical line
            .attr("x1", center)
            .attr("x2", center)
            .attr("y1", y(min) )
            .attr("y2", y(max) )
            .classed( 'all', true )
        .append("rect") // box
            .attr("x", center - width/2)
            .attr("y", y(q3) )
            .attr("height", (y(q1)-y(q3)) )
            .attr("width", width )
            .classed( 'all', true )
        .data([min, median, max])
        .enter()
        .append("line") // median, min and max horizontal lines
            .attr("x1", center-width/2)
            .attr("x2", center+width/2)
            .attr("y1", function(d){ return(y(d))} )
            .attr("y2", function(d){ return(y(d))} )
            .classed( 'all', true );
  
    // Draw the box plot.
//    selection.selectAll( ".all" )
//        .data( values )
//        .enter()
//        .append( "rect" )
//        .classed( 'all', true )
//        .attr( "x", ( d ) => xScale( d[ 0 ]))
//        .attr( "y", ( d ) => ( d[ 1 ] >= 0 ) ? yScale( d[ 1 ]) : yScale( 0 ))
//        .attr( "width", xScale.bandwidth())
//        .attr( "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0,
//             ( d[ 1 ] >= 0 ) ? ( yScale( 0 ) - yScale( d[ 1 ])) : ( yScale( d[ 1 ]) - yScale( 0 ))) : 0 ));
//    selection.selectAll( ".selected" )
//        .data( valuesSelected )
//        .enter()
//        .append( "rect" )
//        .classed( 'selected', true )
//        .attr( "x", ( d ) => xScale( d[ 0 ]))
//        .attr( "y", ( d ) => ( d[ 1 ] >= 0 ) ? yScale( d[ 1 ]) : yScale( 0 ))
//        .attr( "width", xScale.bandwidth())
//        .attr( "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0,
//             ( d[ 1 ] >= 0 ) ? ( yScale( 0 ) - yScale( d[ 1 ])) : ( yScale( d[ 1 ]) - yScale( 0 ))) : 0 ));
};

export default Box;
