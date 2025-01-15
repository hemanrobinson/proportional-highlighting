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
                <h1>Proportional Highlighting&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://github.com/hemanrobinson/proportional-highlighting/"><img className="icon" title="Code Shared on GitHub" alt="Code Shared on GitHub" src={github}/></a></h1>
                <p>
                Proportional highlighting displays linked data in aggregate graphs. Use the slider to adjust the percentage of data rows selected.
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
                <p>
                <strong><em>Aggregate graphs</em></strong> display data that is aggregated using simple functions such as count, sum, and average. For simplicity, the graphs above display the count of rows in each category.
                </p>
                <p>
                In aggregate graphs, each element displays multiple rows, so <strong><em>proportional highlighting</em></strong> displays the proportion of selected rows. <a href="http://www.perceptualedge.com/">Stephen Few</a> has written one of the best explanations of proportional highlighting <a href="https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf">("Highlighting Methods", p. 12-23)</a>.
                </p>
                <p className="center">
                    <a href="http://www.perceptualedge.com/"><img title="Stephen Few" alt="Stephen Few" src={few}/></a>
                </p>
                <p>
                Few describes several <a href="https://www.perceptualedge.com/blog/?p=2258">outstanding problems</a> with proportional highlighting, which this study attempts to address.
                </p>
                <h2>User Interface</h2>
                <p>
                </p>
                <h2>Implementation</h2>
                <p>
                This project uses <a href="https://react.dev">React</a>, <a href="https://github.com/mui-org/material-ui">Material-UI</a>, and <a href="https://github.com/d3/d3">d3</a>.
                </p>
                <h2>Further Reading</h2>
                <ul>
                    <li>Few, S. (2010). "Coordinated Highlighting in Context". Perceptual Edge, 12-23. <a href=" https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf">https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf</a>.</li><br/>
                    <li>Few, S. (2016), “Information Visualization Research Projects That Would Benefit Practitioners”. <a href=" https://www.perceptualedge.com/blog/?p=2258">https://www.perceptualedge.com/blog/?p=2258</a>.</li><br/>
                </ul>
            </div>
        </div>
    );
}

export default App;
