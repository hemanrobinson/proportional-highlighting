import * as d3 from 'd3';
import Graph from './Graph';
import './Graph.css';

/**
 * Bar chart in an SVG element.
 *
 * The X domain is stored as a state.  The Y domain is calculated from the X domain.
 *
 * @return component
 */
const Bar = () => {
};

/**
 * Y axis margin, as a percentage between 0 and 1.
 *
 * @const {number}
 */
Bar.yMargin = 0.05;

/**
 * Draws the bar chart.
 *
 * @param  {Element} selection      d3 selection
 * @param  {number}  x              X coordinate, in pixels
 * @param  {number}  y              Y coordinate, in pixels
 * @param  {number}  width          width, in pixels
 * @param  {number}  height         height, in pixels
 * @param  {D3Scale} xScale         X scale
 * @param  {D3Scale} yScale         Y scale
 * @param  {Array}   bars           bars
 * @param  {Array}   selectedBars   selected bars
 */
Bar.draw = ( selection, x, y, width, height, xScale, yScale, bars, selectedBars ) => {

    // Draw the bars.
    selection.selectAll( ".all" )
        .data( bars )
        .enter()
        .append( "rect" )
        .classed('all', true )
        .attr( "x", ( d ) => xScale( d[ 0 ]))
        .attr( "y", ( d ) => yScale( d[ 1 ]))
        .attr( "width", xScale.bandwidth())
        .attr( "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0, height - yScale( d[ 1 ])) : 0 ));
    selection.selectAll( ".selected" )
        .data( selectedBars )
        .enter()
        .append( "rect" )
        .classed('selected', true )
        .attr( "x", ( d ) => xScale( d[ 0 ]))
        .attr( "y", ( d ) => yScale( d[ 1 ]))
        .attr( "width", xScale.bandwidth())
        .attr( "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0, height - yScale( d[ 1 ])) : 0 ));
};

export default Bar;
