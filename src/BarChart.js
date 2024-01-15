import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';

/**
 * Bar chart in an SVG element.
 *
 * The X domain is stored as a state.  The Y domain is calculated from the X domain.
 *
 * The X aggregate factor, which determines how the bars are aggregated, is also stored as a state.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const BarChart = ( props ) => {
    
    // Initialization.
    const width = 650,
        height = 400,
        padding = { top: 20, right: 20, bottom: 0, left: 20 },
        margin = { top: 0, right: 0, bottom: 120, left: 60 },
        top    = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left;
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 0 ],
        yLabel = Data.getColumnNames( dataSet )[ 1 ],
        data = Data.getValues( dataSet ),
        xDomain0,
        yDomain0,
        xScale,
        yScale,
        bars;
        
    // Get the X scale.
    const [ xDomain, setXDomain ] = useState([]);
    xScale = d3.scaleBand().domain( xDomain ).range([ left, width - right ]).padding( 0.2 );
    
    // Assign the X aggregate factor.
    const [ xAggregate, setXAggregate ] = useState( 0 );
    let onXAggregate = ( event, value ) => {
        setXDomain( xScale.domain());
        setXAggregate( value );
    };

    // Calculate the bars and sort them.
    bars = Array.from( d3.rollup( data, v => d3.sum( v, d => d[ 1 ]), d => d[ 0 ]));
    bars.sort(( a, b ) => ( b[ 1 ] - a[ 1 ]));
    
    // Set the X domain.
    xDomain0 = bars.map( x => x[ 0 ]);
    xScale.domain( xDomain0 );

    // Get the Y scale.
    yDomain0 = [ 0, ( 1 + BarChart.yMargin ) * d3.max( bars, d => d[ 1 ])];
    yScale = d3.scaleLinear()
        .domain( yDomain0 )
        .range([ height - bottom, top ]);
        
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
    };
    
    // Zoom in one dimension.
    let onPointerDown = ( event ) => {
        Graph.onPointerDown( event, width, height, margin, padding, false, 0, 0, xScale, yScale, xDomain0, yDomain0 );
    },
    onPointerUp = ( event ) => {
        if( Graph.downLocation.isX || Graph.downLocation.isY ) {
            Graph.onPointerUp( event, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0 );
            BarChart.draw( ref, width, height, margin, padding, false, true, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bars );
        }
    };
    
    // Show or hide the controls.
    let onPointerOver = ( event ) => {
    };
    let onPointerOut = ( event ) => {
    };
    
    // Set hook to draw on mounting or any state change.
    useEffect(() => {
        BarChart.draw( ref, width, height, margin, padding, false, Graph.isXBinning.get( ref ), Graph.isYBinning.get( ref ), xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bars );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onZoom={onZoom2D} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerOver={onPointerOver} onPointerOut={onPointerOut}  onXAggregate={onXAggregate} ref={ref} />
};

/**
 * Y axis margin, as a percentage between 0 and 1.
 *
 * @const {number}
 */
BarChart.yMargin = 0.05;

/**
 * Draws the bar chart.
 *
 * @param  {Object}   ref          reference to DIV
 * @param  {number}   width        width, in pixels
 * @param  {number}   height       height, in pixels
 * @param  {Box}      margin       margin
 * @param  {Box}      padding      padding
 * @param  {boolean}  isZooming    true iff drawing zoom controls
 * @param  {boolean}  isXBinning   true iff drawing bin controls in X dimension
 * @param  {boolean}  isYBinning   true iff drawing bin controls in Y dimension
 * @param  {D3Scale}  xScale       X scale
 * @param  {D3Scale}  yScale       Y scale
 * @param  {Array}    xDomain0     Initial X domain
 * @param  {Array}    yDomain0     Initial Y domain
 * @param  {string}   xLabel       X axis label
 * @param  {string}   yLabel       Y axis label
 * @param  {Array}    bars         bars
 */
BarChart.draw = ( ref, width, height, margin, padding, isZooming, isXBinning, isYBinning, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bars ) => {
    
    // Initialization.
    const top  = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left,
        svg = d3.select( ref.current.childNodes[ 0 ]);
    svg.selectAll( "*" ).remove();
    if( !bars ) return;

    // Draw the bars.
    let yScale1 = yScale,
        otherLength;
    const n = bars.length,
        maxLength = d3.max( bars.slice( 0, n - 1 ), d => d[ 1 ]);
    svg.selectAll( "rect" )
        .data( bars )
        .enter()
        .append( "rect" )
        .attr( "x", ( d ) => xScale( d[ 0 ]))
        .attr( "y", ( d ) => yScale1( d[ 1 ]))
        .attr( "width", xScale.bandwidth())
        .attr( "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0, height - yScale1( d[ 1 ])) : 0 ))
        .style( "fill", "#99bbdd" );
};

export default BarChart;
