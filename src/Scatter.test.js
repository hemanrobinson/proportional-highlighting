import * as d3 from 'd3';
import Graph from './Graph';
import Scatter from './Scatter';

it( "creates a Scatter element", () => {
    expect( Scatter()).toBe( undefined );
});

it( "draws a scatter plot", () => {
    Scatter.draw( d3.selection(), 0, 0, 200, 200, [[]], [[]]);
});
