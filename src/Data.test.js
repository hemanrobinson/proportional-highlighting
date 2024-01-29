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
    const nRows = Data.getValues().length;
    expect( Data.selectedRows.length ).toEqual( 0 );
    Data.selectPercentage( 0.2 );
    expect( Data.selectedRows.length ).toEqual( Math.round( nRows * 0.2 ));
    Data.selectPercentage( 0.5 );
    expect( Data.selectedRows.length ).toEqual( Math.round( nRows * 0.5 ));
    Data.selectPercentage( 0.8 );
    expect( Data.selectedRows.length ).toEqual( Math.round( nRows * 0.8 ));
});

it( "returns column names", () => {
    expect( Data.getColumnNames( "Business" )).toEqual([ "Industry", "Sales ($M)", "Employees" ]);
});

it( "returns domains", () => {
    expect( Data.getDomain( 0 )).toEqual([ "Aerospace", "Soap" ]);
    expect( Data.getDomain( 1 )).toEqual([ 576.9, 86656 ]);
    expect( Data.getDomain( 2 )).toEqual([ 560, 201400 ]);
});

it( "returns values", () => {
    expect( Data.getValues().length ).toBe( 67 );
});

