import * as d3 from 'd3';
import Graph from './Graph';
import Line from './Line';

it( "creates a Line element", () => {
    expect( Line()).toBe( undefined );
});

it( "draws a line", () => {
    Line.draw( d3.selection(), "", 0, 0, 200, 200, [[]], [[]], false );
});
