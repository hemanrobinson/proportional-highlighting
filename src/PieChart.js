import Data from './Data';

/**
 * Pie chart in an SVG element.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const PieChart = ( props ) => {
};

/**
 * Draws the pie chart.
 *
 * @param  {number}  x        X coordinate, in pixels
 * @param  {number}  y        Y coordinate, in pixels
 * @param  {number}  width    width, in pixels
 * @param  {number}  height   height, in pixels
 * @param  {Element} canvas   CANVAS element
 * @param  {number}  nData    number of data values
 * @param  {number}  index    column index
 */
PieChart.draw = ( x, y, width, height, canvas, nData, index ) => {
    
    // Initialization.
    const s = "Pie Chart";
    if( !canvas || !canvas.getContext ) return;
    let g = canvas.getContext( "2d" );
        
    // Draw the column label.
    g.fillStyle = "#000000";
    g.font = "14px Verdana";
    g.fillText( s, x + width / 2 - g.measureText( s ).width / 2, y + height - height / 2 + 4 );
};

export default PieChart;
