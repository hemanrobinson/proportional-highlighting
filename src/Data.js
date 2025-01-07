import * as d3 from 'd3';

/**
 * Data sets.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const Data = ( props ) => {
};
 
/**
 * Array of indices of selected rows.
 *
 * @type {number[]}
 */
Data.selectedRowIndices = [];

/**
 * Deselects all rows.
 */
Data.deselectAll = () => {
    Data.selectedRowIndices = [];
};

/**
 * Selects an approximate percentage of the rows in each group.
 *
 * @param percentage percentage between 0 and 1
 */
Data.selectPercentage = ( percentage ) => {
    
    // Get the first index of each group.
    let firstIndices = [],
        rows = Data.getRows(),
        sums = Array.from( d3.rollup( rows, v => d3.sum( v, d => d[ 1 ]), d => d[ 0 ]));
    for( let i = 0; ( i < sums.length ); i++ ) {
        firstIndices.push( rows.findIndex( element => ( element[ 0 ] === sums[ i ][ 0 ])));
    }
    firstIndices.push( rows.length );
    
    // Select the approximate percentage of rows in each group.
    Data.selectedRowIndices = [];
    for( let i = 0; ( i < firstIndices.length ); i++ ) {
        let n = firstIndices[ i + 1 ] - firstIndices[ i ];
        for( let j = 0; ( j < Math.floor( n * percentage )); j++ ) {
            Data.selectedRowIndices.push( firstIndices[ i ] + j );
        }
    }
};

/**
 * Returns column names.
 *
 * @return {string[]}  column names
 */
Data.getColumnNames = () => {
    return [ "Industry", "Sales ($M)", "Employees" ];
};

/**
 * Returns domain of specified column.
 *
 * @param  {number}    index  column index
 * @return {number[]}  domain of specified column
 */
Data.getDomain = ( index ) => {
    let domain = [],
        rows = Data.getRows();
    if( index === 0 ) {
        domain = Array.from( d3.rollup( rows, v => d3.sum( v, d => 1 ), d => d[ 0 ])).map( d => d[ 0 ]);
    } else {
        domain = [ d3.min( rows, d => d[ index ]), d3.max( rows, d => d[ index ])];
    }
    return domain;
};

/**
 * Returns data rows.
 *
 * @return {Array[]}  data values by row
 */
Data.getRows = () => {
    return [
        [ "Pharma", 9844, 83100 ],
        [ "Pharma", 9422, 54100 ],
        [ "Pharma", 6747, 50816 ],
        [ "Pharma", 6698.4, 34400 ],
        [ "Pharma", 5903.7, 42100 ],
        [ "Pharma", 5453.5, 40929 ],
        [ "Pharma", 4272, 33000 ],
        [ "Pharma", 4175.6, 28200 ],
        [ "Pharma", 3243, 21300 ],
        [ "Pharma", 2916.3, 20100 ],
        [ "Pharma", 1198.3, 8527 ],
        [ "Pharma", 969.2, 3418 ],
        [ "Aerospace", 20276, 159200 ],
        [ "Aerospace", 19765.5, 201400 ],
        [ "Aerospace", 14995, 127926 ],
        [ "Aerospace", 12633.1, 108715 ],
        [ "Aerospace", 12021, 107100 ],
        [ "Aerospace", 10053.2, 102200 ],
        [ "Aerospace", 9932, 82500 ],
        [ "Aerospace", 7440.1, 58000 ],
        [ "Aerospace", 5814.3, 65500 ],
        [ "Aerospace", 5200, 41100 ],
        [ "Aerospace", 3558.8, 28900 ],
        [ "Aerospace", 2072.8, 17700 ],
        [ "Aerospace", 2001, 15100 ],
        [ "Aerospace", 1693, 11400 ],
        [ "Aerospace", 1666.1, 13700 ],
        [ "Aerospace", 1455.6, 10737 ],
        [ "Aerospace", 1047.7, 12000 ],
        [ "Aerospace", 801.8, 6424 ],
        [ "Oil", 86656, -104000 ],
        [ "Oil", 50976, -67900 ],
        [ "Oil", 32416, -37067 ],
        [ "Oil", 29443, -54826 ],
        [ "Oil", 24214, -53648 ],
        [ "Oil", 21703, -31338 ],
        [ "Oil", 17755, -53610 ],
        [ "Oil", 15905, -26600 ],
        [ "Oil", 12492, -21800 ],
        [ "Oil", 10417, -17286 ],
        [ "Oil", 9927, -21600 ],
        [ "Oil", 8685.6, -13232 ],
        [ "Oil", 8016.6, -37800 ],
        [ "Oil", 5589, -8740 ],
        [ "Oil", 4941.2, -3300 ],
        [ "Oil", 3122, -7942 ],
        [ "Oil", 3057.6, -3347 ],
        [ "Oil", 2750, -10700 ],
        [ "Oil", 2090.9, -4800 ],
        [ "Oil", 2018.7, -5994 ],
        [ "Oil", 1683.7, -4538 ],
        [ "Oil", 1440.5, -1680 ],
        [ "Oil", 1402.8, -5745 ],
        [ "Oil", 941.3, -1816 ],
        [ "Oil", 819.3, -5628 ],
        [ "Oil", 773.3, -1800 ],
        [ "Oil", 663.2, -560 ],
        [ "Soap", 21689, 79300 ],
        [ "Soap", 8113.8, 30567 ],
        [ "Soap", 5110.2, 24100 ],
        [ "Soap", 3395.9, 28400 ],
        [ "Soap", 1471.2, 5300 ],
        [ "Soap", 869.5, 4217 ],
        [ "Soap", 717.4, 5600 ],
        [ "Soap", 629.2, 2900 ],
        [ "Soap", 594.4, 5721 ],
        [ "Soap", 576.9, 4000 ]
   ];
};

export default Data;
