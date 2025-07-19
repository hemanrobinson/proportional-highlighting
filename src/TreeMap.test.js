import * as d3 from 'd3';
import Graph from './Graph';
import TreeMap from './TreeMap';

it( "creates a TreeMap element", () => {
    expect( TreeMap()).toBe( undefined );
});

it( "draws the treemap", () => {
    TreeMap.draw( d3.selection(), "", 0, 0, 400, 400, [], []);
});
