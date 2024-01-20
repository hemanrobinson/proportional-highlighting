import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Graph from './Graph';

let container = null;

// Sets up a DOM element as a render target.
beforeEach(() => {
    window.PointerEvent = MouseEvent;   // PointerEvent is not supported in JSDOM
    container = document.createElement( "div" );
    document.body.appendChild( container );
});

// Cleans up on exit.
afterEach(() => {
    unmountComponentAtNode( container );
    container.remove();
    container = null;
});

it( "creates a Graph element", () => {
    
    // Test first render and componentDidMount.
    act(() => {
        ReactDOM.render(<Graph width={ 400 } height={ 400 } margin={{ top: 0, right: 0, bottom: 0, left:0 }} padding={{ top: 0, right: 0, bottom: 0, left:0 }} />, container );
    });
    
    // Test structure.
    const div = container.querySelector( "div" );
    expect( div.childNodes.length ).toBe( 1 );
    expect( div.childNodes[ 0 ].nodeName ).toBe( "svg" );
});

it( "normalizes a rectangle", () => {
    expect( Graph.normalize({ x:   0, y:   0, width:    0, height:    0 })).toEqual({ x: 0, y: 0, width:   0, height:   0 });
    expect( Graph.normalize({ x:   0, y:   0, width:  100, height:  100 })).toEqual({ x: 0, y: 0, width: 100, height: 100 });
    expect( Graph.normalize({ x: 100, y: 100, width: -100, height: -100 })).toEqual({ x: 0, y: 0, width: 100, height: 100 });
});

it( "returns whether within a rectangle", () => {
    expect( Graph.isWithin({ x:   0, y:   0 }, { x:   0, y:   0, width:    0, height:    0 })).toBe( false );
    expect( Graph.isWithin({ x:   0, y:   0 }, { x:   0, y:   0, width:  100, height:  100 })).toBe(  true );
    expect( Graph.isWithin({ x:   0, y:   0 }, { x: 100, y: 100, width: -100, height: -100 })).toBe(  true );
});

it( "returns initial and current domains", () => {
    expect( Graph.getDomains([ 0, 1 ], [ 0, 1 ], [ 0, 1 ], [ 0, 1 ], false, false )).toEqual({
        "xD": 0, "xMax": 1, "xMax0": 1, "xMin": 0, "xMin0": 0, "yD": 0, "yMax": 1, "yMax0": 1, "yMin": 0, "yMin0": 0 });
    expect( Graph.getDomains([ 0, 1 ], [ "A", "B", "C" ], [ 0, 1 ], [ "A", "B", "C" ], false, true )).toEqual({
        "xD": 0, "xMax": 1, "xMax0": 1, "xMin": 0, "xMin0": 0, "yD": 1, "yMax": 2, "yMax0": 2, "yMin": 0, "yMin0": 0 });
    expect( Graph.getDomains([ "A", "B", "C" ], [ 0, 1 ], [ "A", "B", "C" ], [ 0, 1 ], true, false )).toEqual({
        "xD": 1, "xMax": 2, "xMax0": 2, "xMin": 0, "xMin0": 0, "yD": 0, "yMax": 1, "yMax0": 1, "yMin": 0, "yMin0": 0 });
    expect( Graph.getDomains([ "A", "B", "C" ], [ "A", "B", "C" ], [ "A", "B", "C" ], [ "A", "B", "C" ], true, true )).toEqual({
        "xD": 1, "xMax": 2, "xMax0": 2, "xMin": 0, "xMin0": 0, "yD": 1, "yMax": 2, "yMax0": 2, "yMin": 0, "yMin0": 0 });
});
