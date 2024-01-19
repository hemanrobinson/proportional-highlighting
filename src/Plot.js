import Data from './Data';

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
 * Cached bitmap, or none iff undefined.
 *
 * @constant {ImageData|undefined}
 */
Plot.imageData = undefined;
    
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
 * Draws the plot.
 *
 * @param  {Element}              selection     d3 selection
 * @param  {Element}              canvas        CANVAS element
 * @param  {number}               x             X coordinate, in pixels
 * @param  {number}               y             Y coordinate, in pixels
 * @param  {number}               width         width, in pixels
 * @param  {number}               height        height, in pixels
 * @param  {number}               i             X column index
 * @param  {number}               j             Y column index
 * @param  {number[][]}           scaled        scaled coordinates
 * @param  {Element}              canvas        CANVAS element
 * @param  {number}               opacity       alpha
 * @param  {number[]}             selectedRows  indices of selected rows
 * @param  {ImageData|undefined}  imageData     bitmap of deselected points, or undefined if none
 * @return {ImageData}            bitmap of deselected points
 */
Plot.draw = ( selection, canvas, x, y, width, height, i, j, scaled, opacity, selectedRows, imageData ) => {
    
    // Initialization.
    const g = canvas.getContext( "2d" ),
        padding = Plot.padding,
        scaledi = scaled[ i ],
        scaledj = scaled[ j ],
        nRows = scaledi.length,
        data = Data.getValues( nRows ),
        nBytes = width * height * 4;
    let deselectedImageData = imageData;
        
    // Create the deselected bitmap if necessary.
    // For alpha blending, see e.g. https://en.wikipedia.org/wiki/Alpha_compositing#Alpha_blending.
    if( deselectedImageData === undefined ) {
        deselectedImageData = g.createImageData( width, height );                           // black and transparent
        const d = deselectedImageData.data;
        data.forEach(( datum, row ) => {
            let xScaled = scaledi[ row ],
                yScaled = height - scaledj[ row ],
                k = ( yScaled * width + xScaled ) * 4;
            if(( 0 <= k ) && ( k + 3 < nBytes )) {
                d[ k     ] = Math.round(             0 + d[ k     ] * ( 1 - opacity ));     // r
                d[ k + 1 ] = Math.round(             0 + d[ k + 1 ] * ( 1 - opacity ));     // g
                d[ k + 2 ] = Math.round(             0 + d[ k + 2 ] * ( 1 - opacity ));     // b
                d[ k + 3 ] = Math.round( 255 * opacity + d[ k + 3 ] * ( 1 - opacity ));     // alpha
            }
        });
    }
    
    // Copy the deselected bitmap.  Caching minimizes use of createImageData().
    if( !Plot.imageData || ( Plot.imageData.data.length !== nBytes )) {
        Plot.imageData = g.createImageData( width, height );                                // black and transparent
    } else {
        Plot.imageData.data.fill( 0, 0, nBytes );                                           // black and transparent
    }
    const myImageData = Plot.imageData;
    const d = myImageData.data;
    d.set( deselectedImageData.data );
    
    // Add the selected rows as specified.
    // Selected rows use opacity, but not alpha blending, in order to keep them bright.  TODO:  Explore alternatives to this.
    for( let m = 0; ( m < selectedRows.length ); m++ ) {
        let row = selectedRows[ m ],
            xScaled = scaledi[ row ],
            yScaled = height - scaledj[ row ],
            k = ( yScaled * width + xScaled ) * 4;
        if(( 0 <= k ) && ( k + 3 < nBytes )) {
            d[ k ] = Math.round( 255 + d[ k ] * ( 1 - opacity ));                           // r
        }
    }
    
    // Draw and return the bitmap.
    g.putImageData( myImageData, x, y, padding, padding, width - 2 * padding, height - 2 * padding );
    return deselectedImageData;
};

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

export default Plot;
