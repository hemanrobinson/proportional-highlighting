import * as d3 from 'd3';
import Graph from './Graph';
import Plot from './Plot';

it( "creates a Plot element", () => {
    expect( Plot()).toBe( undefined );
});

it( "draws a plot", () => {
    Plot.draw( d3.selection(), 0, 0, 200, 200, [[]], [[]]);
});
