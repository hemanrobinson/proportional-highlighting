import * as d3 from 'd3';
import Graph from './Graph';
import Bar from './Bar';

it( "creates a Bar element", () => {
    expect( Bar()).toBe( undefined );
});

it( "draws the bar chart", () => {
    Bar.draw( d3.selection(), "", 0, 0, 400, 400, [ 0, 1 ], [ 0, 1 ], false );
});
