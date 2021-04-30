import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const GlobalContext = createContext();

export function GlobalProvider(props) {
    const [ globalOptions, setGlobalOptions ] = useState({
        column1: 'fromEmail',
        column2: 'toEmail',
        graph1: 'Hierarchical Edge Bundling',
        graph2: 'None',
        timeframe: [ 20, 50 ],
        previousDays: 10,
        timeline: 0,
        columnList: [
            'None',
            'date',
            'fromId',
            'fromEmail',
            'fromJobtitle',
            'toId',
            'toEmail',
            'toJobtitle',
            'messageType',
            'sentiment'
        ],
        playbackSpeed: 1,
        playing: false
    });

    const [ HEBOptions, setHEBOptions ] = useState({
        edgeSize: 1,
        nodeSize: 5,
        dynamicEdges: false,
        dynamicNodes: false,
        groupBy: null,
        colorBy: null
    });

    const [ DFDOptions, setDFDOptions ] = useState({
        edgeSize: 1,
        nodeSize: 5,
        dynamicEdges: false,
        dynamicNodes: false,
        colorBy: null
    });

    const getOptions = (visID) => {
        switch (visID) {
            case 'Global':
                return globalOptions;
            case 'Hierarchical Edge Bundling':
                return HEBOptions;
            case 'Disjoint Force-Directed':
                return DFDOptions;
            case 'Force-Directed Graph':
                return;
            case 'Arc Diagram':
                return;
            case '3D force directed graph':
                return;

            default:
                return {};
        }
    };

    const setOptions = (visID, options) => {
        switch (visID) {
            case 'Global':
                setGlobalOptions(options);
                break;
            case 'Hierarchical Edge Bundling':
                setHEBOptions(options);
                break;
            case 'Disjoint Force-Directed':
                setDFDOptions(options);
                break;
            case 'Force-Directed Graph':
                break;
            case 'Arc Diagram':
                break;
            case '3D force directed graph':
                break;

            default:
                break;
        }
    };

    return <GlobalContext.Provider value={[ getOptions, setOptions ]}>{props.children}</GlobalContext.Provider>;
}

GlobalProvider.propTypes = {
    children: PropTypes.node
};
