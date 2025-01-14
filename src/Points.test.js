import * as d3 from 'd3';
import Graph from './Graph';
import Points from './Points';

it( "creates a Points element", () => {
    expect( Points()).toBe( undefined );
});

it( "draws points", () => {
    Points.draw( d3.selection(), "", 0, 0, 200, 200, [[]], [[]], false );
});
