import { act, render, screen } from '@testing-library/react';
import ReactDOM from 'react-dom';
import App from './App';

let container;

beforeEach(() => {
    container = document.createElement( "div" );
    document.body.appendChild( container );
    HTMLCanvasElement.prototype.getContext = () => {};  // fixes Jest problem
});

afterEach(() => {
    document.body.removeChild( container );
    container = null;
});

// In brush.js, svg.width.baseVal is undefined.
it( "renders App with childnodes", () => {
    
    // Test first render and componentDidMount.
    act(() => {
        ReactDOM.render(<App />, container );
    });

    // Test structure.
    const div = container.querySelector( "div" );
    expect( div.className ).toBe( "Column" );
    expect( div.childNodes.length ).toBe( 14 );
    expect( div.childNodes[ 0 ].className ).toBe( "Description" );
    expect( div.childNodes[ 1 ].className ).toBe( "Description" );
    expect( div.childNodes[ 2 ].className ).toBe( "GridControls" );
});
