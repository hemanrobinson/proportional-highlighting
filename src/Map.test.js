import * as d3 from 'd3';
import Graph from './Graph';
import Map from './Map';

it( "creates a Map element", () => {
    expect( Map()).toBe( undefined );
});

it( "draws the map", () => {
    Map.draw( d3.selection(), "", 0, 0, 400, 400, [ 0, 1 ], [ 0, 1 ]);
});
