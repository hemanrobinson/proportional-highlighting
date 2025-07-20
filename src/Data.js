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
    
        // Vary the percentage.
        let variedPercentage = percentage;
        const k1 = 0.15,
            k2 = k1 * 2;
        if(( k2 < percentage ) && ( percentage < 1 - k2 )) {
            variedPercentage = percentage * (( i % 2 > 0 ) ? 1 - k2 : 1 + k2 );
        } else if(( k1 < percentage ) && ( percentage < 1 - k1 )) {
            variedPercentage = percentage * (( i % 2 > 0 ) ? 1 - k1 : 1 + k1 );
        }
        variedPercentage = Math.max( 0, Math.min( 1, variedPercentage ));
        
        // Select the row indices.
        for( let j = 0; ( j < Math.floor( variedPercentage * ( firstIndices[ i + 1 ] - firstIndices[ i ]))); j++ ) {
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
    return [ "Industry", "Count" ];
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
        [ "Aerospace", 1 ],
        [ "Aerospace", 1 ],
        [ "Aerospace", 1 ],
        [ "Aerospace", 1 ],
        [ "Aerospace", 1 ],
        [ "Aerospace", 1 ],
        [ "Aerospace", 1 ],
        [ "Aerospace", 1 ],
        [ "Aerospace", 1 ],
        [ "Aerospace", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Auto", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Computer", 1 ],
        [ "Food", -1 ],
        [ "Food", -1 ],
        [ "Food", -1 ],
        [ "Food", -1 ],
        [ "Food", -1 ],
        [ "Food", -1 ],
        [ "Food", -1 ],
        [ "Food", -1 ],
        [ "Food", -1 ],
        [ "Food", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Oil", -1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Pharma", 1 ],
        [ "Soap", 1 ],
        [ "Soap", 1 ],
        [ "Soap", 1 ],
        [ "Soap", 1 ],
        [ "Soap", 1 ],
        [ "Soap", 1 ],
        [ "Soap", 1 ],
        [ "Soap", 1 ],
        [ "Soap", 1 ],
        [ "Soap", 1 ],
   ];
};

export default Data;
