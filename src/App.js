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
    const [ percentSelectedBar,     setPercentSelectedBar       ] = useState( percentSelectedDefault );
    const [ percentSelectedStacked, setPercentSelectedStacked   ] = useState( percentSelectedDefault );
    const [ percentSelectedTreemap, setPercentSelectedTreemap   ] = useState( percentSelectedDefault );
    const [ percentSelectedPie,     setPercentSelectedPie       ] = useState( percentSelectedDefault );
    const [ percentSelectedBubble,  setPercentSelectedBubble    ] = useState( percentSelectedDefault );
    const [ percentSelectedArea,    setPercentSelectedArea      ] = useState( percentSelectedDefault );
    const [ percentSelectedMap,     setPercentSelectedMap       ] = useState( percentSelectedDefault );
    const [ percentSelectedLinear,  setPercentSelectedLinear    ] = useState( percentSelectedDefault );
    const [ percentSelectedSmall,   setPercentSelectedSmall     ] = useState( percentSelectedDefault );
    const [ percentSelectedMixed,   setPercentSelectedMixed     ] = useState( percentSelectedDefault );
    
    // Format percentage values.
    const percentFormat = ( value ) => ( Math.round( value * 100 ) + "%" );
    
    // Return the component.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Proportional Highlighting&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://github.com/hemanrobinson/proportional-highlighting/"><img className="icon" title="Code Shared on GitHub" alt="Code Shared on GitHub" src={github}/></a></h1>
                <p>
                The technique of highlighting linked views was originally developed in scatter plots in which each point displays one row of data (Newton, 1978; McDonald, 1982; Becker and Cleveland, 1987; Stuetzle, 1987). <strong><em>Proportional highlighting</em></strong> extends this technique to <strong><em>aggregate graphs</em></strong>, in which each glyph represents multiple rows, such as bar charts and histograms.
                </p>
                <p className="center">
                    <a href="http://www.perceptualedge.com/"><img title="Stephen Few" alt="Stephen Few" src={few}/></a>
                </p>
                <p>
                <a href="http://www.perceptualedge.com/">Stephen Few</a> wrote one of the best <a href="https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf">explanations</a> of proportional highlighting, suggested design patterns, and argued strongly for the technique: “It’s hard to imagine a situation when proportional highlighting isn’t significantly superior” (Few, 2010).
                </p>
                <p>
                This study proposes design patterns for proportional highlighting in all commonly used business graphs. This includes the line plot and box plot described by Few (2016) as <a href="https://www.perceptualedge.com/blog/?p=2258">outstanding problems</a>.
                </p>
            </div>
            
            <div className="Description">
                <h2>User Interface</h2>
                <h3>Design Goals and Principles</h3>
                <h4>A. Highlight All Graphs</h4>
                <p>
                Many products support proportional highlighting in some graphs but not all. A consistent user interface facilitates learning. When all graphs support highlighting, users can learn the technique in one graph and reuse their knowledge in other graphs.
                </p>
                <h4>B. Highlight All Glyphs</h4>
                <p>
                Graphs with small glyphs may not have sufficient area to highlight proportionally. These glyphs can be highlighted <strong><em>if any rows they represent are selected</em></strong>. This principle displays useful information — much better than doing nothing — and supports highlighting in all graphs.</p>
                <h4>C. Provide Multiple Highlighting Modes</h4>
                <p>
                There are many ways to highlight graphs. Darkening color can highlight large glyphs. Increasing size can highlight small glyphs. Changing position can be effective if the graph is not too complex. It’s best to provide multiple highlighting modes and give the user their choice.</p>
                <h4>D. Display both Proportions and Statistics</h4>
                <p>
                Business graphs commonly display statistics such as frequency, sum, mean, maximum, and quantiles. Examples include employees per department, average sales per region, or total profits per product.
                </p>
                <p>
                When the statistic is a simple frequency count, the highlighted proportion represents the value of that statistic for the selected rows. In general, however, the highlighted proportion does not represent the statistic.
                </p>
                <p>
                For these reasons, this design consistently highlights the proportion of selected rows, and displays statistics for both selected rows and all rows in hover tips. This combination of highlighting and hover tips enables users to estimate proportions quickly and view precise statistics when needed.
                </p>
                <h3>Detailed Design</h3>
                <p>
                Design patterns for proportional highlighting in graphs can be classified by the shapes of their glyphs. In the examples for each glyph shape, use the sliders to adjust the percentage of data rows selected.
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Glyph Shapes</th><th>Graphs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Rectangular Glyphs</td><td>Bar Charts, Histograms, Heatmaps, Treemaps</td>
                        </tr>
                        <tr>
                            <td>Circular Glyphs</td><td>Pie Charts, Doughnut Charts, Bubble Plots</td>
                        </tr>
                        <tr>
                            <td>Complex Glyphs</td><td>Area Plots, Maps, Radar Charts</td>
                        </tr>
                        <tr>
                            <td>Linear Glyphs</td><td>Line Plots, Graphs with Overlaid Lines</td>
                        </tr>
                        <tr>
                            <td>Small Glyphs</td><td>Scatter Plots, Graphs with Overlaid Points</td>
                        </tr>
                        <tr>
                            <td>Mixed Glyphs</td><td>Box Plots</td>
                        </tr>
                    </tbody>
                </table>
                <h4>A. Rectangular Glyphs</h4>
                <p>
                Rectangular glyphs are familiar in bar charts and histograms. Traditionally, the origin of the highlighted portion is at zero is on the response axis. The <strong><em>response axis</em></strong> displays the statistic calculated on the dependent variable: frequency, sum, mean, etc. The response axis may be vertical or horizontal.
                </p>
                <Matrix type="bar" percentSelected={percentSelectedBar} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedBar( value ); }} />
            </div>
            <div className="Description">
                <p>
                For stacked bars, the origin of the highlighted portion of the first bar is at zero. The origin for all other bars is at the termination of the previous bar, the bars being ordered starting at zero on the response axis. This meets users' expectations of the bars growing away from zero, in either a positive or negative direction.
                </p>
                <Matrix type="stacked" percentSelected={percentSelectedStacked} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedStacked( value ); }} />
            </div>
            <div className="Description">
                <p>
                Rectangular glyphs also appear in graphs with no response axis, such as heatmaps and treemaps. In such cases, the origin of the highlighted portion is at the bottom of the glyph. This meets the expectations of users, who are familiar with a glass of water and other containers that fill from the bottom.
                </p>
                <Matrix type="treemap" percentSelected={percentSelectedTreemap} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedTreemap( value ); }} />
            </div>
            <div className="Description">
                <p>
                This pattern can be used in any graph with rectangular glyphs, including bar charts, histograms, heatmaps, and treemaps.
                </p>
                <h4>B. Circular Glyphs</h4>
                <p>
                Because rectangular glyphs have constant width, comparing their areas reduces to simply comparing lengths. So, in theory, rectangular glyphs should outperform circular glyphs. For this reason and others, authorities argue that “pie charts should never be used” (Tufte, 1983).</p>
                <p>
                Yet pie charts continue to be used, as do doughnut charts and bubble plots. For this reason, this section offers suggestions for proportionally highlighting circular glyphs.
                </p>
                <p>
                It’s reasonable to expect comparing areas to be easier when the areas have similar shapes. Circular glyphs afford two ways to achieve this: highlighting outward, from an origin at the minimum radius; or sweeping around the circle, from an origin at an angle. The example below compares bubbles using both highlighting modes.
                </p>
                <Matrix type="bubble" percentSelected={percentSelectedBubble} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedBubble( value ); }} />
            </div>
            <div className="Description">
                <p>
                For bubbles, an origin at an angle may perform better, because it only requires estimating a single angle, rather than comparing two areas. An origin at the top, bottom, left, or right facilitates estimation <a href="https://www.perceptualedge.com/articles/visual_business_intelligence/save_the_pies_for_dessert.pdf">(Few, 2007)</a>.
                </p>
                <p>
                For pie and doughnut charts, the best highlighting mode may depend on the size of the slices. In thin slices, the radius is greater than the arc length, so highlighting from the center may facilitate judging proportions. In thick slices, the reverse is true, so highlighting from an angle may perform better. The example below shows pie and doughnut charts using both highlighting modes.
                </p>
                <Matrix type="pie" percentSelected={percentSelectedPie} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedPie( value ); }} />
            </div>
            <div className="Description">
                <p>
                These patterns can be used in any graph with circular glyphs, including pie charts, doughnut charts, and bubble plots.
                </p>
                <h4>C. Complex Glyphs</h4>
                <p>
                We can reasonably expect users to estimate proportions by comparing areas of rectangles, circles, and other simple geometric shapes. In more complex shapes, comparing areas is more difficult; comparing positions is a simpler task.
                </p>
                <p>
                In area plots, comparing positions also supports a consistent user experience. As in bar charts, the highlighting origin is at zero is on the response axis or at the termination of the previous area.  The example below shows consistent highlighting by position in area plots, bar charts, and other graphs.
                </p>
                <Matrix type="area" percentSelected={percentSelectedArea} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedArea( value ); }} />
            </div>
            <div className="Description">
                <p>
                Maps can be more complex than area plots, particularly when the shapes are not contiguous. Maps can similarly highlight by position, using linear interpolation between the minimum and maximum latitude, with origin at the minimum. The example below shows highlighting by position in a map.
                </p>
                <Matrix type="map" percentSelected={percentSelectedMap} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedMap( value ); }} />
            </div>
            <div className="Description">
                <p>
                This pattern can be used in any graph with complex glyphs, including area plots, maps, and radar charts.
                </p>
                <h4>D. Linear Glyphs</h4>
                <p>
                <a href=" https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf">Few (2010)</a> suggested highlighting linear glyphs by changing their position, because humans easily perceive motion. As Few noted, this works well for few lines, but does not scale to many lines.
                </p>
                <p>
                An alternative is to highlight a proportion of the line, using vertices as origins, and either vertices or midpoints as terminations. The example below shows lines using both highlighting modes.
                </p>
                <Matrix type="linear" percentSelected={percentSelectedLinear} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedLinear( value ); }} />
            </div>
            <div className="Description">
                <p>
                Lines are often overlaid on other glyphs, for example in area plots. In such cases, highlighting modes must be coordinated, so highlighting by position may be preferred. In complex graphs with many lines, highlighting from vertices may perform better.</p>
                <p>
                These patterns can be used in any graph with linear glyphs, such as line plots; or in any graph with overlaid lines.
                </p>
                <h4>E. Small Glyphs</h4>
                <p>
                For a consistent user experience, it’s important to highlight even the smallest glyphs. With points, as with lines, <a href="https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf">Few (2010)</a> noted that highlighting by changing position works well for a few glyphs, but does not scale to many.
                </p>
                <p>
                An alternative is to highlight points <strong><em>if any rows they represent are selected</em></strong>. This is useful information, and as much as we can show in a small area. The example below shows points using both highlighting modes.
                </p>
                <Matrix type="small" percentSelected={percentSelectedSmall} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedSmall( value ); }} />
            </div>
            <div className="Description">
                <p>
                These patterns can be used in any graph with small glyphs, including scatter plots that aggregate rows and points overlaid on lines or other glyphs. In the latter case, highlighting modes must be coordinated, so it is useful to support both modes.
                </p>
                <p>
                Also, any graph that represents quantities by glyph size may occasionally include glyphs without sufficient area to show proportions. Such glyphs can be treated as small glyphs and highlighted if any rows they represent are selected.
                </p>
                <h4>F. Mixed Glyphs</h4>
                <p>
                Box plots mix together glyphs of different shapes. Box plots have many variations; this study uses Tukey’s original design of boxes, whiskers, and outliers (Tukey, 1977).
                </p>
                <p>
                By definition, the boxes and whiskers display data — specifically, all the data that are not outliers. Therefore, a proportion of this data can be highlighted.
                </p>
                <p>
                Naively, one could treat the boxes and whiskers as a single glyph, highlighting a proportion between the minimum and maximum extent of the whiskers. But we can do better. The boxes and whiskers are separate glyphs, so users will expect them to be highlighted separately.  This also gives the user more information.
                </p>
                <p>
                The median can serve as the origin for boxes, the first and third quartiles for whiskers. With this design, the highlighted portions increase away from the median, as shown in the example below.
                </p>
                <Matrix type="mixed" percentSelected={percentSelectedMixed} />
            </div>
            <div className="GridControls">
                <label>Selected Rows:</label>
                <Slider defaultValue={ percentSelectedDefault } step={ 0.01 } min={ 0 } max={ 1 }
                    valueLabelDisplay="auto" valueLabelFormat={percentFormat}
                    onChange={( event, value ) => { Matrix.clear(); setPercentSelectedMixed( value ); }} />
            </div>
            <div className="Description">
                <p>
                Ties at the quartiles, if any, can be resolved by placing half the tied rows in each quartile. The highlighted proportions will be generally accurate within the user’s ability to judge.
                </p>
                <p>
                This pattern can be used for variations on box plots, such as quantile plots that display more quantiles along the whiskers. Consistent with this design, the quantiles can be highlighted as individual glyphs.
                </p>
                <h2>Usability Tests</h2>
                <p>
                Usability tests measured response time and accuracy to verify that users learned these designs for area plots, maps, bar charts, box plots, histograms, heatmaps, and treemaps.  Results are available upon request.
                <p>
                <h2>Implementation</h2>
                <p>
                This project uses <a href="https://react.dev">React</a>, <a href="https://github.com/mui-org/material-ui">Material-UI</a>, and <a href="https://github.com/d3/d3">d3</a>.
                </p>
                <h2>Conclusion</h2>
                </p>
                Proportional highlighting provides more information, supporting more data exploration. In all our graphs, wherever possible, we should support proportional highlighting.
                </p>
                <h2>Further Reading</h2>
                <ul>
                    <li>Becker, R. and Cleveland, W. (1987), “Brushing Scatterplots”, Technometrics, 29, 2, 127-142.</li><br/>
                    <li>Few, S. (2007), “Save the Pies for Dessert”. Perceptual Edge. <a href="https://www.perceptualedge.com/articles/visual_business_intelligence/save_the_pies_for_dessert.pdf">https://www.perceptualedge.com/articles/visual_business_intelligence/save_the_pies_for_dessert.pdf</a>.</li><br/>
                    <li>Few, S. (2010). "Coordinated Highlighting in Context". Perceptual Edge. <a href=" https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf">https://www.perceptualedge.com/articles/visual_business_intelligence/coordinated_highlighting_in_context.pdf</a>.</li><br/>
                    <li>Few, S. (2016), “Information Visualization Research Projects That Would Benefit Practitioners”. Perceptual Edge. <a href=" https://www.perceptualedge.com/blog/?p=2258">https://www.perceptualedge.com/blog/?p=2258</a>.</li><br/>
                    <li>McDonald, J. (1982), Interactive Graphics for Data Analysis. PhD thesis, Stanford University.</li><br/>
                    <li>Newton, C. (1978), “Graphics: from alpha to omega in data analysis”, in P. C. C. Wand (Ed.), Graphical Representation of Multivariate Data, New York, NY: Academic Press, 59–92.</li><br/>
                    <li>Stuetzle, W. (1987), “Plot windows”, Journal of the American Statistical Association, 82, 466-475.</li><br/>
                    <li>Tukey, J. (1977), Exploratory Data Analysis, Reading, MA: Addison-Wesley, 39-42.</li><br/>
                    <li>Tufte, E. (1983), The Visual Display of Quantitative Information, Cheshire, CN: Graphics Press, 178.</li><br/>
                </ul>
            </div>
        </div>
    );
}

export default App;
