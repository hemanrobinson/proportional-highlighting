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
    
    // Get the data.
    let data = [];
    values.forEach(( value ) => { data.push( value[ 1 ]); });

    // Compute summary statistics.
    const data_sorted = data.sort( d3.ascending ),
         q1 = d3.quantile( data_sorted, .25 ),
         median = d3.quantile( data_sorted, .5 ),
         q3 = d3.quantile( data_sorted, .75 ),
         interQuantileRange = q3 - q1,
         min = Math.max( q1 - 1.5 * interQuantileRange, data_sorted[ 0 ]),
         max = Math.min( q1 + 1.5 * interQuantileRange, data_sorted[ data_sorted.length - 1 ]);
            
    // Draw the box plot.
    const center = width / 2,
        boxWidth = width / 4;
    selection
        .append( "line" )   // whiskers
            .attr( "x1", center )
            .attr( "x2", center )
            .attr( "y1", yScale( min ))
            .attr( "y2", yScale( max ))
            .classed( 'all', true );
    selection
        .append( "rect" )   // box
            .attr( "x", center - boxWidth / 2 )
            .attr( "y", yScale( q3 ))
            .attr( "width", boxWidth )
            .attr( "height", ( yScale( q1 ) - yScale( q3 )))
            .classed( 'all', true );
    selection
        .append( "line" )   // min
            .attr( "x1", center - boxWidth / 2 )
            .attr( "x2", center + boxWidth / 2 )
            .attr( "y1", yScale( min ))
            .attr( "y2", yScale( min ))
            .classed( 'all', true );
    selection
        .append( "line" )   // median
            .attr( "x1", center - boxWidth / 2 )
            .attr( "x2", center + boxWidth / 2 )
            .attr( "y1", yScale( median ))
            .attr( "y2", yScale( median ))
            .classed( 'all', true );
    selection
        .append( "line" )   // max
            .attr( "x1", center - boxWidth / 2 )
            .attr( "x2", center + boxWidth / 2 )
            .attr( "y1", yScale( max ))
            .attr( "y2", yScale( max ))
            .classed( 'all', true );


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
