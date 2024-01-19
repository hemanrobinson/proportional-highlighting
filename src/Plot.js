import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';

/**
 * Scatter plot in an SVG element.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const Plot = ( props ) => {
};
 
/**
 * Padding, in pixels.
 *
 * @constant {number}
 */
Plot.padding = 10;
    
/**
 * Returns normalized rectangle.
 *
 * @param   {Rect}  rect   rectangle
 * @return  {Rect}  normalized rectangle
 */
Plot.normalize = ( rect ) => {
    let nx = rect.x,
        ny = rect.y,
        nw = rect.width,
        nh = rect.height;
    if( nw < 0 ) {
        nx += nw;
        nw = -nw;
    }
    if( nh < 0 ) {
        ny += nh;
        nh = -nh;
    }
    return { x: nx, y: ny, width: nw, height: nh };
}

/**
 * Returns whether point is within rectangle, within tolerance.
 *
 * @param  {Point}   point  point
 * @param  {Rect}    rect   rectangle
 * @param  {number}  tol    tolerance, or 0 for undefined
 */
Plot.isWithin = ( point, rect, tol ) => {
    let nRect = Plot.normalize( rect );
    if( tol !== undefined ) {
        nRect.x -= tol;
        nRect.y -= tol;
        nRect.width += 2 * tol;
        nRect.height += 2 * tol;
    }
    return ( nRect.x <= point.x ) && ( point.x < nRect.x + nRect.width  ) &&
           ( nRect.y <= point.y ) && ( point.y < nRect.y + nRect.height );
}

/**
 * Selects rows within the brush and returns them.
 *
 * @param  {number}     x       X coordinate, in pixels
 * @param  {number}     y       Y coordinate, in pixels
 * @param  {number}     width   width, in pixels
 * @param  {number}     height  height, in pixels
 * @param  {number}     i       X column index
 * @param  {number}     j       Y column index
 * @param  {number[][]} scaled  scaled coordinates
 * @param  {Rect}       brush   brush
 * @return {number[]}   indices of selected rows
 */
Plot.select = ( x, y, width, height, i, j, scaled, brush ) => {
    
    // Initialization.
    let selectedRows = [];
    const scaledi = scaled[ i ],
        scaledj = scaled[ j ],
        nRows = scaledi.length,
        xMin = Math.floor( Math.min( brush.x, brush.x + brush.width ) - x ),
        xMax = Math.floor( Math.max( brush.x, brush.x + brush.width ) - x ),
        yMin = height - Math.floor( Math.max( brush.y, brush.y + brush.height ) - y ),
        yMax = height - Math.floor( Math.min( brush.y, brush.y + brush.height ) - y );
    
    // Collect the selected row indices and return them.
    for( let row = 0; ( row < nRows ); row++ ) {
        let xScaled = scaledi[ row ],
            yScaled = scaledj[ row ];
        if(( xMin <= xScaled ) && ( xScaled < xMax ) && ( yMin < yScaled ) && ( yScaled <= yMax )) {
            selectedRows.push( row );
        }
    };
    return selectedRows;
};

/**
 * Draws the plot.
 *
 * @param  {Element}    selection     d3 selection
 * @param  {number}     x             X coordinate, in pixels
 * @param  {number}     y             Y coordinate, in pixels
 * @param  {number}     width         width, in pixels
 * @param  {number}     height        height, in pixels
 * @param  {number}     i             X column index
 * @param  {number}     j             Y column index
 * @param  {number[][]} scaled        scaled coordinates
 * @param  {number}     opacity       alpha
 * @param  {number[]}   selectedRows  indices of selected rows
 */
Plot.draw = ( selection, x, y, width, height, si, j, caled, opacity, selectedRows ) => {
    selection.selectAll( "text" ).remove();
    selection
        .append( "text" )
        .attr( "x", width / 2 - 15 )
        .attr( "y", height / 2 + 5 )
        .attr( "fill", "black" )
        .text( "Plot" );
};

export default Plot;
