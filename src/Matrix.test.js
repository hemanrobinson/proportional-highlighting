import React from 'react';
import ReactDOM from 'react-dom';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Matrix from './Matrix';

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

it( "initializes a Matrix", () => {
    expect( Matrix.bitmaps ).toBe( undefined );
    expect( Matrix.brushNode ).toBe( undefined );
});

it( "clears data structures", () => {
    Matrix.clear();
    expect( Matrix.brushNode ).toBe( undefined );
});

// In brush.js, svg.width.baseVal is undefined.  SVGElement is not supported in JSDOM.
it( "renders a Matrix", () => {
    act(() => {
        render( <Matrix />, container );
    });
    expect( container.childNodes.length ).toBe( 1 );
});

it( "draws a Matrix", () => {
    act(() => {
        render( <div><canvas width="800" height="800" /><svg width="800" height="800" ><g /></svg></div>, container );
    });
    let div = container.firstChild;
    Matrix.scaled = [[], [], [], []];
    Matrix.draw( 200, 200, { current: div }, 1, 1, true );
});
