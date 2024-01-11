import { act, render, screen } from '@testing-library/react';
import ReactDOM from 'react-dom';
import App from './App';

let container;

beforeEach(() => {
    container = document.createElement( "div" );
    document.body.appendChild( container );
});

afterEach(() => {
    document.body.removeChild( container );
    container = null;
});

// In brush.js, svg.width.baseVal is undefined.
//it( "renders App with childnodes", () => {
//    
//    // Test first render and componentDidMount.
//    act(() => {
//        ReactDOM.render(<App />, container );
//    });
//
//    // Test structure.
//    const div = container.querySelector( "div" );
//    expect( div.className ).toBe( "Column" );
//    expect( div.childNodes.length ).toBe( 4 );
//    expect( div.childNodes[ 0 ].className ).toBe( "Description" );
//    expect( div.childNodes[ 1 ].className ).toBe( "GridControls" );
//    expect( div.childNodes[ 2 ].className ).toBe( "Description" );
//    expect( div.childNodes[ 3 ].className ).toBe( "" );
//    let controls = div.childNodes[ 2 ];
//    expect( controls.childNodes[ 0 ].nodeName ).toBe( "LABEL" );
//    expect( controls.childNodes[ 1 ].nodeName ).toBe( "SPAN" );
//    expect( controls.childNodes[ 2 ].nodeName ).toBe( "LABEL" );
//    expect( controls.childNodes[ 3 ].nodeName ).toBe( "SPAN" );
//});

it( "returns 'nice' power of ten", () => {
    expect( App.getPower(  0 )).toBe(    1 );
    expect( App.getPower(  1 )).toBe(    2 );
    expect( App.getPower(  2 )).toBe(    5 );
    expect( App.getPower(  5 )).toBe(   50 );
    expect( App.getPower( 10 )).toBe( 2000 );
});
