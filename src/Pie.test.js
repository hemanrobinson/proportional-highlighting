import * as d3 from 'd3';
import Graph from './Graph';
import Pie from './Pie';

it( "creates a Pie element", () => {
    expect( Pie()).toBe( undefined );
});

it( "draws a pie chart", () => {
    Pie.draw( d3.selection(), 0, 0, 200, 200, [], []);
});
