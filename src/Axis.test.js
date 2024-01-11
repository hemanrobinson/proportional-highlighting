import React from 'react';
import ReactDOM from 'react-dom';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Axis from './Axis';

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

it( "draws an axis", () => {
    act(() => {
        render( <canvas width="200" height="200" />, container );
    });
    let canvas = container.firstChild;
    Axis.draw( 0, 0, 200, 200, canvas, 1, 0 );
});
