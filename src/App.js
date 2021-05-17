import React from 'react';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import DataUpload from './pages/DataUpload';
import Visualize from './pages/visualize';
import { Menu } from 'antd';
import { DataProvider } from './context/data';

function App() {
    let selectedKeys = [];

    if ( useRouteMatch( { path: '/', exact: true } ) )
        selectedKeys.push( 'home' );
    if ( useRouteMatch( '/about' ) )
        selectedKeys.push( 'about' );
    if ( useRouteMatch( '/vis' ) )
        selectedKeys.push( 'visualize' );
    if ( useRouteMatch( '/dataUpload' ) )
        selectedKeys.push( 'dataUpload' );
    return (
        <DataProvider>
            {/* Using the Link component, you can create 'buttons'
            to different pages that the router can handle.
            */}
            <Menu mode='horizontal' selectedKeys={selectedKeys}>
                <Menu.Item key='home'>
                    <Link to='/'>Home</Link>
                </Menu.Item>
                <Menu.Item key='about'>
                    <Link to='/about'>About</Link>
                </Menu.Item>
                <Menu.Item key='visualize'>
                    <Link to='/vis'>Visualize</Link>
                </Menu.Item>
                <Menu.Item key='dataUpload'>
                    <Link to='/dataUpload'>Data Upload</Link>
                </Menu.Item>
            </Menu>

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
        </DataProvider>
    );
}

export default App;
