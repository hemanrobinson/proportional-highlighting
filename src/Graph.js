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
    let { width, height, margin, padding, onPointerDown, onPointerUp, onPointerOver, onPointerOut, xAggregate, yAggregate, onXAggregate, onYAggregate } = props,
        top    = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left;

    // Check for invalid values (only seen from unit tests).
    if( Number.isNaN( xAggregate )) {
        xAggregate = 0;
    }
    if( Number.isNaN( yAggregate )) {
        yAggregate = 0;
    }
        
    // Offset position of MUI slider.  Differs on iPad.
    let sliderOffset = 12;
    if(( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 )) {
        sliderOffset = 20;
    }
    
    // Return the component.
    // Using "value" instead of "defaultValue" below suppresses a warning.
    return <div style={{width: width, height: height}} className="parent" ref={ref}>
        <svg width={width} height={height} onPointerDown={onPointerDown} onPointerMove={onPointerUp} onPointerUp={onPointerUp} onPointerOver={onPointerOver} onPointerOut={onPointerOut}/>
    </div>;
});
 
/**
 * Down event location.
 *
 * @type {EventLocation}
 */
Graph.downLocation = { x: 0, y: 0, xDomain: [], yDomain: [], isX: false, isY: false, isMin: false, isMax: false };

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
 * Initiates zoom in one dimension.
 *
 * This method modifies Graph.downLocation.
 *
 * @param  {Event}    event         event
 * @param  {number}   width         width, in pixels
 * @param  {number}   height        height, in pixels
 * @param  {Box}      margin        margin
 * @param  {Box}      padding       padding
 * @param  {boolean}  isDragging    true iff dragging is supported in both X and Y dimensions
 * @param  {number}   xScrollSize   scroll size in the X dimension, or <0 if not supported, or 0 for default
 * @param  {number}   yScrollSize   scroll size in the Y dimension, or <0 if not supported, or 0 for default
 * @param  {D3Scale}  xScale        X scale
 * @param  {D3Scale}  yScale        Y scale
 * @param  {Array}    xDomain0      Initial X domain
 * @param  {Array}    yDomain0      Initial Y domain
 */
Graph.onPointerDown = ( event, width, height, margin, padding, isDragging, xScrollSize, yScrollSize, xScale, yScale, xDomain0, yDomain0 ) => {
    
    // Initialization.
    const scrollSize = (( event.pointerType === "touch" ) ? 2 : 1 ) * Graph.scrollSize,
        endCapSize = 0.8 * scrollSize;
    let top    = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left,
        xDomain = xScale.domain(),
        yDomain = yScale.domain(),
        { xMin0, xMax0, yMin0, yMax0, xMin, xMax, yMin, yMax, xD, yD } = Graph.getDomains( xDomain0, yDomain0, xDomain, yDomain, !!xScale.bandwidth, !!yScale.bandwidth );
    let sourceEvent = event.nativeEvent;
    let xDown, yDown;
    if( sourceEvent.touches ) {
        const touch = sourceEvent.touches[ 0 ];
        xDown = touch.clientX - sourceEvent.currentTarget.getBoundingClientRect().x;
        yDown = touch.clientY - sourceEvent.currentTarget.getBoundingClientRect().y;
    } else {
        xDown = sourceEvent.offsetX;
        yDown = sourceEvent.offsetY;
    }
        
    // Reset the mousedown coordinates.
    Graph.downLocation.x = xDown;
    Graph.downLocation.y = yDown;
    Graph.downLocation.xDomain = [];
    Graph.downLocation.yDomain = [];
    Graph.downLocation.isX = false;
    Graph.downLocation.isY = false;
    Graph.downLocation.isMin = false;
    Graph.downLocation.isMax = false;
  
    // Stop propagation to document.
    event.stopPropagation();
    
    // Handle event on X scrollbar...
    if(( left <= xDown ) && ( xDown <= width - right ) && ( height - ( xScrollSize ? xScrollSize : scrollSize ) <= yDown ) && ( yDown <= height )) {
        let w = width - right - left + 1,
            x0 = left + w * ( xMin - xMin0      ) / ( xMax0 - xMin0 + xD ),
            x1 = left + w * ( xMax - xMin0 + xD ) / ( xMax0 - xMin0 + xD );
        if( event.preventDefault ) {
            event.preventDefault();
        }
        Graph.downLocation.xDomain = xScale.domain();
        Graph.downLocation.isX = true;
        if(( x0 <= xDown ) && ( xDown <= x0 + endCapSize )) {
            Graph.downLocation.isMin = true;
        } else if(( x1 - endCapSize <= xDown ) && ( xDown <= x1 )) {
            Graph.downLocation.isMax = true;
        }
    }
    
    // ...or handle event on Y scrollbar...
    else if(( 0 <= xDown ) && ( xDown <= scrollSize ) && ( top <= yDown ) && ( yDown <= height - bottom )) {
        let h = height - bottom - top + 1,
            y0 = top + h * ( 1 - ( yMin - yMin0      ) / ( yMax0 - yMin0 + yD )),
            y1 = top + h * ( 1 - ( yMax - yMin0 + yD ) / ( yMax0 - yMin0 + yD ));
        if( event.preventDefault ) {
            event.preventDefault();
        }
        Graph.downLocation.yDomain = yScale.domain();
        Graph.downLocation.isY = true;
        if(( y1 <= yDown ) && ( yDown <= y1 + endCapSize )) {
            Graph.downLocation.isMax = true;
        } else if(( y0 - endCapSize <= yDown ) && ( yDown <= y0 )) {
            Graph.downLocation.isMin = true;
        }
    }
};

/**
 * Completes zoom in one dimension.
 *
 * This method modifies Graph.downLocation.
 *
 * @param  {Event}    event     event
 * @param  {number}   width     width, in pixels
 * @param  {number}   height    height, in pixels
 * @param  {Box}      margin    margin
 * @param  {Box}      padding   padding
 * @param  {D3Scale}  xScale    X scale (returned)
 * @param  {D3Scale}  yScale    Y scale (returned)
 * @param  {Array}    xDomain0  Initial X domain
 * @param  {Array}    yDomain0  Initial Y domain
 */
Graph.onPointerUp = ( event, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0 ) => {

    // Initialization.
    const d = 8;
    let top    = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left,
        xDomain = Graph.downLocation.xDomain,
        yDomain = Graph.downLocation.yDomain,
        { xMin0, xMax0, yMin0, yMax0, xMin, xMax, yMin, yMax, xD, yD } = Graph.getDomains( xDomain0, yDomain0, xDomain, yDomain, !!xScale.bandwidth, !!yScale.bandwidth );
    let sourceEvent = event.nativeEvent;
    let xUp, yUp;
    if( sourceEvent.touches ) {
        const touch = sourceEvent.touches[ 0 ];
        xUp = touch.clientX - sourceEvent.currentTarget.getBoundingClientRect().x;
        yUp = touch.clientY - sourceEvent.currentTarget.getBoundingClientRect().y;
    } else {
        xUp = sourceEvent.offsetX;
        yUp = sourceEvent.offsetY;
    }
    
    // Handle event on X scrollbar...
    if( Graph.downLocation.isX ) {
        
        // Prevent default event handling.
        if( event.preventDefault ) {
            event.preventDefault();
        }
    
        // Calculate the difference.
        const f = ( xMax0 - xMin0 + xD ) / d;
        let w = width - right - left + 1,
            dif = ( xMax0 - xMin0 + xD ) * ( xUp - Graph.downLocation.x ) / w;
        if( xScale.bandwidth ) {
            dif = Math.round( dif );
        }
        
        // Handle drag on minimum handle...
        if( Graph.downLocation.isMin ) {
            dif = Math.max( dif, xMin0 - xMin );
            if( dif <= xMax - xMin + xD - f ) {
                if( xScale.bandwidth ) {
                    xScale.domain( xDomain0.slice( xMin + dif, xMax + xD ));
                } else {
                    xScale.domain([ xMin + dif, xMax ]);
                }
            }
        }
        
        // ...or handle drag on maximum handle...
        else if( Graph.downLocation.isMax ) {
            dif = Math.min( dif, xMax0 - xMax );
            if( dif >= f - ( xMax - xMin + xD )) {
                if( xScale.bandwidth ) {
                    xScale.domain( xDomain0.slice( xMin, xMax + dif + xD ));
                } else {
                    xScale.domain([ xMin, xMax + dif ]);
                }
            }
        }
        
        // ...or handle drag on thumb or click on track.
        else {
        
            // Adjust for click on track.
            if( dif === 0 ) {
                let x0 = left + w * ( xMin - xMin0      ) / ( xMax0 - xMin0 + xD ),
                    x1 = left + w * ( xMax - xMin0 + xD ) / ( xMax0 - xMin0 + xD );
                if( xUp < x0 ) {
                    dif = ( xMax0 - xMin0 + xD ) * ( xUp - x0 ) / w - ( xMax - xMin + xD ) / 2;
                } else if( x1 < xUp ) {
                    dif = ( xMax0 - xMin0 + xD ) * ( xUp - x1 ) / w + ( xMax - xMin + xD ) / 2;
                }
            }
            
            // Handle drag or click.
            dif = Math.max( dif, xMin0 - xMin );
            dif = Math.min( dif, xMax0 - xMax );
            if( xScale.bandwidth ) {
                xScale.domain( xDomain0.slice( xMin + dif, xMax + dif + xD ));
            } else {
                xScale.domain([ xMin + dif, xMax + dif ]);
            }
        }
    }
    
    // ...or handle event on Y scrollbar.
    else if( Graph.downLocation.isY ) {
        
        // Prevent default event handling.
        if( event.preventDefault ) {
            event.preventDefault();
        }
    
        // Calculate the difference.
        const f = ( yMax0 - yMin0 + yD ) / d;
        let h = height - bottom - top + 1,
            dif = ( yMax0 - yMin0 + yD ) * ( Graph.downLocation.y - yUp ) / h;
        if( yScale.bandwidth ) {
            dif = Math.round( dif );
        }
            
        // Handle drag on minimum handle...
        if( Graph.downLocation.isMin ) {
            dif = Math.max( dif, yMin0 - yMin );
            if( dif <= yMax - yMin + yD - f ) {
                if( yScale.bandwidth ) {
                    yScale.domain( yDomain0.slice( yMin + dif, yMax + yD ));
                } else {
                    yScale.domain([ yMin + dif, yMax ]);
                }
            }
        }
        
        // ...or handle drag on maximum handle...
        else if( Graph.downLocation.isMax ) {
            dif = Math.min( dif, yMax0 - yMax );
            if( dif >= f - ( yMax - yMin + yD )) {
                if( yScale.bandwidth ) {
                    yScale.domain( yDomain0.slice( yMin, yMax + dif + yD ));
                } else {
                    yScale.domain([ yMin, yMax + dif ]);
                }
            }
        }
        
        // ...or handle drag on thumb or click on track.
        else {
        
            // Adjust for click on track.
            if( dif === 0 ) {
                let y0 = top + h * ( 1 - ( yMin - yMin0      ) / ( yMax0 - yMin0 + yD )),
                    y1 = top + h * ( 1 - ( yMax - yMin0 + yD ) / ( yMax0 - yMin0 + yD ));
                if( yUp < y0 ) {
                    dif = ( yMax0 - yMin0 + yD ) * ( y0 - yUp ) / h - ( yMax - yMin + yD ) / 2;
                } else if( y1 < yUp ) {
                    dif = ( yMax0 - yMin0 + yD ) * ( y1 - yUp ) / h + ( yMax - yMin + yD ) / 2;
                }
            }
            
            // Handle drag or click.
            dif = Math.max( dif, yMin0 - yMin );
            dif = Math.min( dif, yMax0 - yMax );
            if( yScale.bandwidth ) {
                yScale.domain( yDomain0.slice( yMin + dif, yMax + dif + yD ));
            } else {
                yScale.domain([ yMin + dif, yMax + dif ]);
            }
        }
    }
        
    // Reset the mousedown coordinates.
    if(( Graph.downLocation.isX || Graph.downLocation.isY ) && ( event.type === "pointerup" ) && ( event.pointerType !== "touch" )) {
        Graph.downLocation.isX = false;
        Graph.downLocation.isY = false;
        Graph.downLocation.isMin = false;
        Graph.downLocation.isMax = false;
    }
};

export default Graph;
