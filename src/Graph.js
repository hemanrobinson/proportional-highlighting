import React from 'react';
import './Graph.css';

/**
 * @typedef  Domains  initial and current domains
 *
 * @type  {object}
 * @property  {number}  xMin0  initial X minimum
 * @property  {number}  xMax0  initial X maximum
 * @property  {number}  xMin   current X minimum
 * @property  {number}  xMax   current X maximum
 * @property  {number}  xD     X difference
 * @property  {number}  yMin0  initial Y minimum
 * @property  {number}  yMax0  initial Y maximum
 * @property  {number}  yMin   current Y minimum
 * @property  {number}  yMax   current Y maximum
 * @property  {number}  yD     Y difference
 */

/**
 * Graph in an SVG element.
 *
 * This component contains code common to the different types of graphs.
 *
 * React functional components don't support inheritance; this is the recommended pattern:
 *    https://reactjs.org/docs/composition-vs-inheritance.html#specialization
 *
 * @param  {Object}  props  properties
 * @param  {Object}  ref    reference to DIV
 * @return component
 */
const Graph = React.forwardRef(( props, ref ) => {
    
    // Initialization.
    let { width, height } = props;
    
    // Return the component.
    return <div style={{width: width, height: height}} className="parent" ref={ref}>
        <svg width={width} height={height}/>
    </div>;
});

/**
 * Point radius, in pixels.
 */
Graph.pointRadius = 3;
    
/**
 * Returns normalized rectangle.
 *
 * @param   {Rect}  rect   rectangle
 * @return  {Rect}  normalized rectangle
 */
Graph.normalize = ( rect ) => {
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
Graph.isWithin = ( point, rect, tol ) => {
    let nRect = Graph.normalize( rect );
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
 * Returns initial and current domains.
 *
 * @param  {Array}    xDomain0    initial X domain
 * @param  {Array}    yDomain0    initial Y domain
 * @param  {Array}    xDomain     current X domain
 * @param  {Array}    yDomain     current Y domain
 * @param  {boolean}  isXOrdinal  true iff X scale is ordinal
 * @param  {boolean}  isYOrdinal  true iff Y scale is ordinal
 * @return {Domains}  initial and current domains
 */
Graph.getDomains = ( xDomain0, yDomain0, xDomain, yDomain, isXOrdinal, isYOrdinal ) => {
    let domains = {};
    if( isXOrdinal ) {
        domains.xMin0 = 0;
        domains.xMax0 = xDomain0.length - 1;
        domains.xMin = xDomain0.indexOf( xDomain[ 0 ]);
        domains.xMax = xDomain0.indexOf( xDomain[ xDomain.length - 1 ]);
        domains.xD = 1;
    } else {
        domains.xMin0 = xDomain0[ 0 ];
        domains.xMax0 = xDomain0[ 1 ];
        domains.xMin = xDomain[ 0 ];
        domains.xMax = xDomain[ 1 ];
        domains.xD = 0;
    }
    if( isYOrdinal ) {
        domains.yMin0 = 0;
        domains.yMax0 = yDomain0.length - 1;
        domains.yMin = yDomain0.indexOf( yDomain[ 0 ]);
        domains.yMax = yDomain0.indexOf( yDomain[ yDomain.length - 1 ]);
        domains.yD = 1;
    } else {
        domains.yMin0 = yDomain0[ 0 ];
        domains.yMax0 = yDomain0[ 1 ];
        domains.yMin = yDomain[ 0 ];
        domains.yMax = yDomain[ 1 ];
        domains.yD = 0;
    }
    return domains;
}

/**
 * Draws the graph.
 *
 * @param  {Element} selection      d3 selection
 * @param  {string}  label          label, or none if undefined
 * @param  {number}  x              X coordinate, in pixels
 * @param  {number}  y              Y coordinate, in pixels
 * @param  {number}  width          width, in pixels
 * @param  {number}  height         height, in pixels
 * @param  {Scale}   yScale         scale of Y axis, or undefined if none
 * @param  {boolean} isHorz         true iff graph is horizontal, otherwise vertical
 */
Graph.draw = ( selection, label, x, y, width, height, yScale, isHorz ) => {
    
    // Initialization.
    selection.selectAll( "*" ).remove();
    
    // Draw the label, if any.
    if( label ) {
        selection
            .append( "text" )
            .attr( "x", 5 )
            .attr( "y", 16 )
            .classed( "label", "true" )
            .text( label );
    }
             
    // Draw the axis, if any.
    if( yScale ) {
        selection
            .append( "line" )
            .classed( 'grid', true )
            .attr( isHorz ? "y1" : "x1", width * Graph.margin / 1.2 )
            .attr( isHorz ? "x1" : "y1", yScale( 0 ))
            .attr( isHorz ? "y2" : "x2", width * ( 1 - Graph.margin / 1.2 ))
            .attr( isHorz ? "x2" : "y2", yScale( 0 ))
    }
};

// Margin, a percentage between 0 and 1.
Graph.margin = 0.1;

export default Graph;
