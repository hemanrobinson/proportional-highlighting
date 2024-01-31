import Data from './Data';

it( "invokes the Data function", () => {
    expect( Data()).toEqual( undefined );
});

it( "initializes the Data function", () => {
    expect( Data.selectedRows ).toEqual([]);
});

it( "deselects all rows", () => {
    Data.selectedRows = [ 1 ];
    Data.deselectAll();
    expect( Data.selectedRows ).toEqual([]);
});

it( "selects a random percentage of the rows", () => {
    const nRows = Data.getValues().length,
        tolerance = 0.05;
    expect( Data.selectedRows.length ).toEqual( 0 );
    Data.selectPercentage( 0 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0 )).toBeLessThan( tolerance );
    Data.selectPercentage( 0.1 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0.1 )).toBeLessThan( tolerance );
    Data.selectPercentage( 0.2 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0.2 )).toBeLessThan( tolerance );
    Data.selectPercentage( 0.3 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0.3 )).toBeLessThan( tolerance );
    Data.selectPercentage( 0.4 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0.4 )).toBeLessThan( tolerance );
    Data.selectPercentage( 0.5 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0.5 )).toBeLessThan( tolerance );
    Data.selectPercentage( 0.6 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0.6 )).toBeLessThan( tolerance );
    Data.selectPercentage( 0.7 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0.7 )).toBeLessThan( tolerance );
    Data.selectPercentage( 0.8 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0.8 )).toBeLessThan( tolerance );
    Data.selectPercentage( 0.9 );
    expect( Math.abs( Data.selectedRows.length / nRows - 0.9 )).toBeLessThan( tolerance );
    Data.selectPercentage( 1 );
    expect( Math.abs( Data.selectedRows.length / nRows - 1 )).toBeLessThan( tolerance );
});

it( "returns column names", () => {
    expect( Data.getColumnNames( "Business" )).toEqual([ "Industry", "Sales ($M)", "Employees" ]);
});

it( "returns domains", () => {
    expect( Data.getDomain( 0 )).toEqual([ "Pharma", "Aerospace", "Oil", "Soap" ]);
    expect( Data.getDomain( 1 )).toEqual([ 576.9, 86656 ]);
    expect( Data.getDomain( 2 )).toEqual([ 560, 201400 ]);
});

it( "returns values", () => {
    expect( Data.getValues().length ).toBe( 67 );
});

