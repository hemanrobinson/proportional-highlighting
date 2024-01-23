import Data from './Data';

it( "invokes the Data function", () => {
    expect( Data()).toEqual( undefined );
});

it( "initializes the Data function", () => {
    expect( Data.selectedRows ).toEqual([]);
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

