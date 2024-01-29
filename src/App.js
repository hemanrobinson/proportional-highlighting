import React, { useState } from 'react';
import { Slider } from '@mui/material';
import Matrix from './Matrix';
import './App.css';
import github from './github.svg';
import few from './few.jpg';

// Application:  Proportional Highlighting
const App = () => {
    
    // Create state.
    const percentSelectedDefault = 0.5;
    const [ percentSelected, setPercentSelected ] = useState( percentSelectedDefault );
    
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
                Use the slider to adjust the percentage of data rows selected.
                </p>
                <Matrix percentSelected={percentSelected} />
                <br />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={( value ) => ( Math.round( value * 100 ) + "%" )}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelected( value ); }} />
            </div>
            <div className="Description">
                <h2>Design Notes</h2>
                <p>
                </p>
                <h2>Further Reading</h2>
                <ul>
                    <li>Few, S. (2010). "Coordinated Highlighting in Context". Perceptual Edge. <a href=" https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf">https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf</a></li><br/>
                </ul>
            </div>
        </div>
    );
}

export default App;
