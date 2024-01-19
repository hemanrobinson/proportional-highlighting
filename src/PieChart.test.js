import React from 'react';
import ReactDOM from 'react-dom';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import PieChart from './PieChart';

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

it( "draws a pie chart", () => {
    act(() => {
        render( <canvas width="200" height="200" />, container );
    });
    let canvas = container.firstChild;
    PieChart.draw( undefined, canvas, 0, 0, 200, 200, 1, 0 );
});
