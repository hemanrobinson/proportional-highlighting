import * as d3 from 'd3';
import Graph from './Graph';
import Box from './Box';

it( "creates a Box element", () => {
    expect( Box()).toBe( undefined );
});

it( "draws the box plot", () => {
    Box.draw( d3.selection(), "", 0, 0, 400, 400, [ 0, 1 ], [ 0, 1 ]);
});
