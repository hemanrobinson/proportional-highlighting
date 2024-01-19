import React from 'react';
import Matrix from './Matrix';
import './App.css';
import github from './github.svg';
import few from './few.jpg';

// Application:  Proportional Highlighting
const App = () => {
    
    // Create state.
    
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
                <Matrix/>
                <br />
            </div>
            <div className="GridControls">
            </div>
            <div className="Description">
                <h2>Design Notes</h2>
                <p>
                This implementation reuses some code from the <a href="https://observablehq.com/collection/@d3/d3-brush">d3-brush collection</a>.
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
