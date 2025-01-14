import * as d3 from 'd3';
import Graph from './Graph';
import Area from './Area';

it( "creates an Area element", () => {
    expect( Area()).toBe( undefined );
});

it( "draws an area plot", () => {
    Area.draw( d3.selection(), "", 0, 0, 200, 200, [[]], [[]]);
});
