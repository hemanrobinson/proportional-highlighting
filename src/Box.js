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
    const n = 100;
    if( Box.data.length <= 0 ) {
        Box.data = Array.from({ length: n }, d3.randomNormal( ( yMin + yMax ) / 2, 6 )).sort( d3.ascending );
    }

    // Compute summary statistics.
    const q1 = d3.quantile( Box.data, .25 ),
         median = d3.quantile( Box.data, .5 ),
         q3 = d3.quantile( Box.data, .75 ),
         interQuantileRange = q3 - q1;
    let min = q1 - 1.5 * interQuantileRange,
        max = q3 + 1.5 * interQuantileRange;
    let i = 0;
    if( min > Box.data[ 0 ]) {
        i = Box.data.findIndex(( item ) => ( min < item )) + 1;
    }
    min = Box.data[ i ];
    i = n - 1;
    if( max < Box.data[ n - 1 ]) {
        i = Box.data.findLastIndex(( item ) => ( max > item )) - 1;
    }
    max = Box.data[ i ];
    
    // Generate selected states to match the specified percentage selected.
    const pct = d3.sum( valuesSelected, ( d ) => d[ 1 ]) / d3.sum( values, ( d ) => d[ 1 ]),
        f = Math.round( 1 / (( 0 < pct ) && ( pct < 0.5 ) ? pct : ( 1 - pct )));
    let selected = [];
    for( let i = 0; ( i < n ); i++ ) {
        selected[ i ] = ( 0 < pct ) && ( pct < 0.5 ) ? ( i % f === 0 ) : ( pct < 1 ) ? ( i % f !== 0 ) : true;
    };
    
    // Calculate percentages selected in each box and whisker, based on selected state.
    // TODO: For accuracy in degenerate cases, check for repeated exactly matching quantile values, and put half on each side.
    let pctCalculation = (( i, n, stopValue ) => {
        let i0 = i, i1 = i, k = 0;
        while(( i1 < n ) && ( Box.data[ i1 ] < stopValue )) {
            if( selected[ i1 ]) {
                k++;
            }
            i1++;
        }
        return [ i1, k / ( i1 - i0 )];
    });
    let p0, p1, p2, p3;
    [ i, p0 ] = pctCalculation( 0, n, min );
    [ i, p0 ] = pctCalculation( i, n, q1 );
    [ i, p1 ] = pctCalculation( i, n, median );
    [ i, p2 ] = pctCalculation( i, n, q3 );
    [ i, p3 ] = pctCalculation( i, n, max );
    
    // Get the outliers and the selected outliers.
    let outliers = [];
    Box.data.forEach(( d, i ) => {
        if(( d < min ) || ( max < d )) {
            outliers.push([ d, selected[ i ]]);
        }
    });
    let outliersSelected = outliers.filter(( d ) => d[ 1 ]);
    
    // Draw the deselected box plot.
    const center = width / 2,
        boxWidth = width / 4,
        serifWidth = width / 8;
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
            .attr( "x1", center - serifWidth / 2 )
            .attr( "x2", center + serifWidth / 2 )
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
            .attr( "x1", center - serifWidth / 2 )
            .attr( "x2", center + serifWidth / 2 )
            .attr( "y1", yScale( max ))
            .attr( "y2", yScale( max ))
            .classed( 'all', true );
    selection.selectAll( ".fillAll" )
        .data( outliers )
        .enter()
        .append( "circle" )
        .attr( "cx", center )
        .attr( "cy", ( d ) => yScale( d[ 0 ]))
        .attr( "r", Graph.pointRadius )
        .classed( 'fillAll', true );
            
    // Draw the selected box plot.
    const whiskerWidth = 1;
    let dataSelected = [[ center - boxWidth / 2, median, boxWidth, median - p1 * ( median - q1 )],
        [ center - boxWidth / 2, median + p2 * ( q3 - median ), boxWidth, median ],
        [ center - whiskerWidth / 2, q1, whiskerWidth, q1 - p0 * ( q1 - min )],
        [ center - whiskerWidth / 2, q3 + p3 * ( max - q3 ), whiskerWidth, q3 ]
    ];
    selection.selectAll( ".selected" )
        .data( dataSelected )
        .enter()
        .append( "rect" )
        .classed( "selected", ( d, i ) => i <= 1 )
        .classed( "strokeSelected", ( d, i ) => i > 1 )
        .attr( "x", ( d ) => d[ 0 ])
        .attr( "y", ( d ) => yScale( d[ 1 ]))
        .attr( "width", ( d ) => d[ 2 ])
        .attr( "height", ( d ) => yScale( d[ 3 ]) - yScale( d[ 1 ]));
    selection.selectAll( ".fillSelected" )
        .data( outliersSelected )
        .enter()
        .append( "circle" )
        .attr( "cx", center )
        .attr( "cy", ( d ) => yScale( d[ 0 ]))
        .attr( "r", Graph.pointRadius )
        .classed( 'fillSelected', true );
};

export default Box;
