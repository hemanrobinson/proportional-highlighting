import React from 'react';
import * as d3 from 'd3';
import './Graph.css';

/**
 * @typedef  Box  distances around an object
 *
 * @type  {object}
 * @property  {number}  top     top distance, in pixels
 * @property  {number}  right   right distance, in pixels
 * @property  {number}  bottom  bottom distance, in pixels
 * @property  {number}  left    left distance, in pixels
 */
 
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
 * @typedef  EventLocation  event location
 *
 * @type  {object}
 * @property  {number}   x        X coordinate, in pixels
 * @property  {number}   y        Y coordinate, in pixels
 * @property  {Array}    xDomain  current X domain
 * @property  {Array}    yDomain  current Y domain
 * @property  {boolean}  isX      true iff on X scrollbar
 * @property  {boolean}  isY      true iff on Y scrollbar
 * @property  {boolean}  isMin    true iff on minimum
 * @property  {boolean}  isMax    true iff on maximum
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
    let { width, height, margin, padding } = props,
        top    = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left;
    
    // Return the component.
    // Using "value" instead of "defaultValue" below suppresses a warning.
    return <div style={{width: width, height: height}} className="parent" ref={ref}>
        <svg width={width} height={height}/>
    </div>;
});

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

export default Graph;
