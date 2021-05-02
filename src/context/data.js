import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const DataContext = createContext();

export function DataProvider( props ) {
    
    let [ data, setData ] = useState();

    return <DataContext.Provider value={[ data, setData ]}>{props.children}</DataContext.Provider>;
}

DataProvider.propTypes = {
    children: PropTypes.node
};
