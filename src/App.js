import React, { useState } from 'react';
import { Slider } from '@mui/material';
import Matrix from './Matrix';
import './App.css';
import github from './github.svg';
import few from './few.jpg';

// Application:  Proportional Highlighting
const App = () => {
    
    // Create state.
    const nDataDefault = 14;
    const transparencyDefault = 0.5;
    const [ nData, setNData ] = useState( App.getPower( nDataDefault ));
    const [ opacity, setOpacity ] = useState( 1 - transparencyDefault );
    
    // Return the component.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Proportional Highlighting&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://github.com/hemanrobinson/proportional/"><img className="icon" title="Code Shared on GitHub" alt="Code Shared on GitHub" src={github}/></a></h1>
                <p>
                Proportional highlighting is a technique of exploratory data analysis, an implementation of brushing and linking for aggregate graphs. Proportional highlighting is described in detal by <a href="https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf">Stephen Few</a>.
                </p>
                <p className="center">
                    <a href="http://www.perceptualedge.com/"><img title="Stephen Few" alt="Stephen Few" src={few}/></a>
                </p>
                <p>
                Drag the brush to select some data.  Drag the edges to resize the brush.  Drag a rectangle in any graph to create a new brush.
                </p>
                <p>
                Use the sliders to adjust the number of data rows and their transparency.
                </p>
                <Matrix nData={nData} opacity={opacity} />
                <br />
            </div>
            <div className="GridControls">
                <label>Data Rows:</label>
                <Slider defaultValue={ nDataDefault } step={ 1 } min={ 9 } max={ 18 }
                    valueLabelDisplay="auto" marks valueLabelFormat={( value ) => { let s = App.getPower( value ); if( s >= 1000000 ) { s = s / 1000000 + "M"; } else if( s >= 1000 ) { s = s / 1000 + "K" }; return s }}
                    onChange={( event, value ) => { Matrix.clear(); setNData( App.getPower( value )); }} />
                <span/>
                <label>Transparency:</label>
                <Slider defaultValue={ transparencyDefault } step={ 0.01 } min={ 0 } max={ 0.99 }
                    valueLabelDisplay="auto"
                    onChange={( event, value ) => { Matrix.clear(); setOpacity( 1 - value ); }} />
            </div>
            <div className="Description">
                <h2>Design Notes</h2>
                <p>
                This implementation reuses some code from the <a href="https://observablehq.com/collection/@d3/d3-brush">d3-brush collection</a>, and from <a href="https://hemanrobinson.github.io/brush/">this Optimized Brushing example</a>
                </p>
                <h2>Further Reading</h2>
                <ul>
                    <li>Few, S. (2010). "Coordinated Highlighting in Context". Perceptual Edge. <a href=" https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf">https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf</a></li><br/>
                </ul>
            </div>
        </div>
    );
}

/**
 * Returns "nice" power of ten:  rounded to 1, 2, 5, 10, 20, 50, etc.
 *
 * @param  {number}  exp  exponent
 * @return {number}  "nice" power of ten:  rounded to 1, 2, 5, 10, 20, 50, etc.
 */
App.getPower = ( exp ) => {
    let m = (( exp % 3 ) === 0 ) ? 1 : (( exp % 3 ) === 1 ) ? 2 : 5;
    return m * ( 10 ** Math.floor( exp / 3 ));
}

export default App;
