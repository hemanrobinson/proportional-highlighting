import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Box plot in an SVG element.
 */
const Box = () => {
};

/**
 * Normally distributed data, sorted in ascending order.
 */
Box.data = [];

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
        yMin = d3.min( values, d => d[ 1 ]),
        yMax = d3.max( values, d => d[ 1 ]),
        yScale = d3.scaleLinear()
            .domain([ yMin, yMax ])
            .range([ height * ( 1 - margin ), height * margin ]);
    Graph.draw( selection, label, x, y, width, height, yScale, false );
    
    // Generate normally distributed data to match the specified range.
    if( Box.data.length <= 0 ) {
        Box.data = Array.from({ length: 100 }, d3.randomNormal( ( yMin + yMax ) / 2, 6 )).sort( d3.ascending );
    }

    // Compute summary statistics.
    const q1 = d3.quantile( Box.data, .25 ),
         median = d3.quantile( Box.data, .5 ),
         q3 = d3.quantile( Box.data, .75 ),
         interQuantileRange = q3 - q1,
         min = Math.max( q1 - 1.5 * interQuantileRange, Box.data[ 0 ]),
         max = Math.min( q1 + 1.5 * interQuantileRange, Box.data[ Box.data.length - 1 ]);
            
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
            .attr( "x1", center - boxWidth / 4 )
            .attr( "x2", center + boxWidth / 4 )
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
            .attr( "x1", center - boxWidth / 4 )
            .attr( "x2", center + boxWidth / 4 )
            .attr( "y1", yScale( max ))
            .attr( "y2", yScale( max ))
            .classed( 'all', true );
    // TODO: Draw the outliers.
    
    // Get the percentage of data selected.
    const pct = d3.sum( valuesSelected, ( d ) => d[ 1 ]) / d3.sum( values, ( d ) => d[ 1 ]);
            
    // TODO: Draw the selected rows.

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
