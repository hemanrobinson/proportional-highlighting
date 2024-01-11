import React from 'react';
import ReactDOM from 'react-dom';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Plot from './Plot';

let container = null;

// Sets up a DOM element as a render target.
beforeEach(() => {
    container = document.createElement( "div" );
    document.body.appendChild( container );
});

// Cleans up on exit.
afterEach(() => {
    unmountComponentAtNode( container );
    container.remove();
    container = null;
});

it( "draws a plot", () => {
    act(() => {
        render( <canvas width="200" height="200" />, container );
    });
    let canvas = container.firstChild;
    let imageData = Plot.draw( 0, 0, 200, 200, 0, 0, [[]], canvas, 1, []);
    expect( imageData.data.length ).toBe( 160000 );
});

it( "normalizes a rectangle", () => {
    expect( Plot.normalize({ x:   0, y:   0, width:    0, height:    0 })).toEqual({ x: 0, y: 0, width:   0, height:   0 });
    expect( Plot.normalize({ x:   0, y:   0, width:  100, height:  100 })).toEqual({ x: 0, y: 0, width: 100, height: 100 });
    expect( Plot.normalize({ x: 100, y: 100, width: -100, height: -100 })).toEqual({ x: 0, y: 0, width: 100, height: 100 });
});

it( "returns whether within a rectangle", () => {
    expect( Plot.isWithin({ x:   0, y:   0 }, { x:   0, y:   0, width:    0, height:    0 })).toBe( false );
    expect( Plot.isWithin({ x:   0, y:   0 }, { x:   0, y:   0, width:  100, height:  100 })).toBe(  true );
    expect( Plot.isWithin({ x:   0, y:   0 }, { x: 100, y: 100, width: -100, height: -100 })).toBe(  true );
});
