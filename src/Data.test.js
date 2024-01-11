import Data from './Data';

it( "invokes the Data function", () => {
    expect( Data()).toEqual( undefined );
});

it( "initializes the Data function", () => {
    expect( Data.selectedRows ).toEqual([]);
});

it( "returns column names", () => {
    expect( Data.getColumnNames()).toEqual([ "A", "B", "A * B", "sin( A / B )" ]);
});

it( "returns domains", () => {
    expect( Data.getDomain( 100, 0 )).toEqual([ -1.5, 1.5 ]);
});

it( "returns values", () => {
    expect( Data.getValues( 100 ).length ).toBe( 100 );
});

