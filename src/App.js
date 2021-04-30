import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import DataUpload from './pages/DataUpload';
import Visualize from './pages/visualize';
import { DataProvider } from './context/data';

function App() {
    return (
        <DataProvider>
            <Router>
                {/* Using the Link component, you can create 'buttons' 
                to different pagesthat the router can handle.
                */}
                {/* Temp max height to simulate ant design navbar that is 64px in height, can be removed */}
                <nav style={{ maxHeight: '64px' }}>
                    <ul>
                        <li>
                            <Link to='/'>Home</Link>
                        </li>
                        <li>
                            <Link to='/about'>About</Link>
                        </li>
                        <li>
                            <Link to='/vis'>Visualize</Link>
                        </li>
                        <li>
                            <Link to='/dataUpload'>Data Upload</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                <Switch>
                    <Route path='/about'>
                        <About />
                    </Route>
                    <Route path='/dataUpload'>
                        <DataUpload />
                    </Route>
                    <Route path='/vis'>
                        <Visualize />
                    </Route>
                    <Route path='/'>
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </DataProvider>  
    );
}

export default App;
