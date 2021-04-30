import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import DataUpload from './pages/DataUpload';

function App() {

    return (
        <Router>
            <div>
                {/* Using the Link component, you can create 'buttons' 
                to different pagesthat the router can handle.
                */}
                <nav>
                    <ul>
                        <li>
                            <Link to='/'>Home</Link>
                        </li>
                        <li>
                            <Link to='/about'>About</Link>
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
                    <Route path='/'>
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;