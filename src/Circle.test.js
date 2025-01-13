import * as d3 from 'd3';
import Graph from './Graph';
import Circle from './Circle';

it( "creates a Circle element", () => {
    expect( Circle()).toBe( undefined );
});

it( "draws a circle", () => {
    Circle.draw( d3.selection(), 0, 0, 200, 200, [], []);
});
