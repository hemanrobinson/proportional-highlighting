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
    const [ percentSelectedRectangular, setPercentSelectedRectangular ] = useState( percentSelectedDefault );
    const [ percentSelectedCircular,    setPercentSelectedCircular    ] = useState( percentSelectedDefault );
    const [ percentSelectedComplex,     setPercentSelectedComplex     ] = useState( percentSelectedDefault );
    const [ percentSelectedLinear,      setPercentSelectedLinear      ] = useState( percentSelectedDefault );
    const [ percentSelectedSmall,       setPercentSelectedSmall       ] = useState( percentSelectedDefault );
    const [ percentSelectedMixed,       setPercentSelectedMixed       ] = useState( percentSelectedDefault );
    
    // Format percentage values.
    const percentFormat = ( value ) => ( Math.round( value * 100 ) + "%" );
    
    // Return the component.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Proportional Highlighting&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://github.com/hemanrobinson/proportional-highlighting/"><img className="icon" title="Code Shared on GitHub" alt="Code Shared on GitHub" src={github}/></a></h1>
                <p>
                Proportional highlighting displays linked data in aggregate graphs. Use the sliders to adjust the percentage of data rows selected.
                </p>
                <br />
            </div>
            
            <div className="Description">
                <h2>Rectangular Glyphs</h2>
                <p>
                Proportional highlighting displays linked data in aggregate graphs. Use the sliders to adjust the percentage of data rows selected.
                </p>
                <Matrix type="rectangular" percentSelected={percentSelectedRectangular} />
                <br />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedRectangular( value ); }} />
            </div>
            
            <div className="Description">
                <h2>Circular Glyphs</h2>
                <p>
                Proportional highlighting displays linked data in aggregate graphs. Use the sliders to adjust the percentage of data rows selected.
                </p>
                <Matrix type="circular" percentSelected={percentSelectedCircular} />
                <br />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedCircular( value ); }} />
            </div>
            
            <div className="Description">
                <h2>Complex Glyphs</h2>
                <p>
                Proportional highlighting displays linked data in aggregate graphs. Use the sliders to adjust the percentage of data rows selected.
                </p>
                <Matrix type="complex" percentSelected={percentSelectedComplex} />
                <br />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedComplex( value ); }} />
            </div>
            
            <div className="Description">
                <h2>Linear Glyphs</h2>
                <p>
                Proportional highlighting displays linked data in aggregate graphs. Use the sliders to adjust the percentage of data rows selected.
                </p>
                <Matrix type="linear" percentSelected={percentSelectedLinear} />
                <br />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedLinear( value ); }} />
            </div>
            
            <div className="Description">
                <h2>Small Glyphs</h2>
                <p>
                Proportional highlighting displays linked data in aggregate graphs. Use the sliders to adjust the percentage of data rows selected.
                </p>
                <Matrix type="small" percentSelected={percentSelectedSmall} />
                <br />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedSmall( value ); }} />
            </div>
            
            <div className="Description">
                <h2>Mixed Glyphs</h2>
                <p>
                Proportional highlighting displays linked data in aggregate graphs. Use the sliders to adjust the percentage of data rows selected.
                </p>
                <Matrix type="mixed" percentSelected={percentSelectedMixed} />
                <br />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedMixed( value ); }} />
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
