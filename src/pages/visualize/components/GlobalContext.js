import React, { useState, createContext, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DataContext } from '../../../context/data';
import * as d3 from 'd3';

export const GlobalContext = createContext();

/**
 * Provides the global context with all variables shared across the visualization page.
 */
export function GlobalProvider( props ) {

    //Default global options controlled by the GeneralOptions component
    const [ globalOptions, setGlobalOptions ] = useState( {
        column1: 'fromEmail',
        column2: 'toEmail',
        graph1: 'Hierarchical Edge Bundling',
        graph2: 'None',
        timeframe: [ moment( '19981112', 'YYYYMMDD' ), moment( '20020620', 'YYYYMMDD' ) ],
        previousDays: 10,
        timeline: moment( '19981112', 'YYYYMMDD' ),
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
        jobColors: d3.scaleOrdinal(d3.schemeCategory10), 
        playbackSpeed: 1,
        playing: false,
        selectedNode: null,
        hoveredNode: null,
        emailsSent: 0,
        emailsReceived: 0,
        position: null
    } );
    
    //Default options for the HEB controlled by the HEBOptions component
    const [ HEBOptions, setHEBOptions ] = useState( {
        edgeThickness: 1,
        convertEmail: true,
        colorEdgeBy: 'None',
        colorNodeBy: 'None',
        bundlingFactor: 0.85,
        colorRange: 'Viridis',
        colorFactor: 25,
        removeDuplicates: false,
    } );
    //Default options for the DFD controlled by the DFDOptions component
    const [ DFDOptions, setDFDOptions ] = useState( {
        edgeSize: 50,
        nodeSize: 5,
        dynamicEdges: true,
        dynamicNodes: true,
        colorBy: true,
        nodeScaleFactor: 3,
        edgeScaleFactor: 5
    } );
    //Default options for the FD controlled by the FDOptions component
    const [ FDOptions, setFDOptions ] = useState( {
        edgeSize: 20,
        nodeSize: 5,
        dynamicEdges: true,
        dynamicNodes: true,
        colorBy: true,
        nodeScaleFactor: 3,
        edgeScaleFactor: 5
    } );

    //Gets the correct state based on the visID
    const getOptions = ( visID ) => {
        switch ( visID ) {
            case 'Global':
                return globalOptions;
            case 'Hierarchical Edge Bundling':
                return HEBOptions;
            case 'Disjoint Force-Directed':
                return DFDOptions;
            case 'Force-Directed Graph':
                return FDOptions;
            case 'Arc Diagram':
                return {};
            case '3D force directed graph':
                return {};

            default:
                return {};
        }
    };
    //Sets the correct state based on ID and options selected
    const setOptions = ( visID, options ) => {
        switch ( visID ) {
            case 'Global':
                setGlobalOptions( options );
                break;
            case 'Hierarchical Edge Bundling':
                setHEBOptions( options );
                break;
            case 'Disjoint Force-Directed':
                setDFDOptions( options );
                break;
            case 'Force-Directed Graph':
                setFDOptions( options );
                break;
            case 'Arc Diagram':
                break;
            case '3D force directed graph':
                break;

            default:
                break;
        }
    };

    
    //Gets the dataset from the DataContext and stores it in the dataset variable
    let [ dataset ] = React.useContext( DataContext );

    useEffect( () => {

        if( dataset == null )
            return;

        //Sort the dataset based on e-mail date
        let sortedDataset = dataset.sort( ( a, b ) => {
            return a.date - b.date;
        } );

        let startDate = moment( sortedDataset[ 0 ].date );
        let endDate   = moment( sortedDataset[ sortedDataset.length - 1 ].date );

        setGlobalOptions( {
            ...globalOptions,
            timeframe: [ startDate, endDate ]
        } );

    }, [ dataset ] );

    return <GlobalContext.Provider value={[ getOptions, setOptions ]}>{props.children}</GlobalContext.Provider>;
}

GlobalProvider.propTypes = {
    children: PropTypes.node
};
