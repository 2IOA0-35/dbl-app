import React, { useState, createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import presets from '../data/presets';
import db from './../db';

/**
 * @type {React.Context<[ {
 *  date: Date,
 *  fromId: number,
 *  fromEmail: string,
 *  fromJobtitle: string,
 *  toId: number
 *  toEmail: string,
 *  toJobtitle: string,
 *  messageType: 'TO'|'CC',
 *  sentiment: number
 * }[], ( data ) => void ]>}
 */
export const DataContext = createContext();

export function DataProvider(props) {

    let [data, setData] = useState(
        /**
         * Dataset
         * @type {{
         *  date: Date,
         *  fromId: number,
         *  fromEmail: string,
         *  fromJobtitle: string,
         *  toId: number
         *  toEmail: string,
         *  toJobtitle: string,
         *  messageType: 'TO'|'CC',
         *  sentiment: number
         * }[]}
         */
        undefined
    );

    let [fileName, setFileName] = useState('');

    let [loading, setLoading] = useState( true );

    useEffect( async () => {

        let selectedDataset = localStorage.getItem( 'DATASET_SELECTED' );

        let datasets = [];

        presets.forEach( ( preset ) => {
            datasets.push( {
                ...preset,
                builtin: true,
            } );
        } );

        await db.data.each( ( item ) => {
            datasets.push( {
                ...item,
                get: () => item.data,
                length: item.data.length,
            } );
        } );

        let dataset = datasets.find( ( dataset ) => dataset.filename == selectedDataset );

        if( dataset == null ) {
            setLoading( false );
            return;
        }

        setData( await dataset.get() );
        setFileName( selectedDataset );

        setLoading( false );

    }, [] );

    let saveFileName = ( name ) => {

        localStorage.setItem( 'DATASET_SELECTED', name );

        setFileName( name );

    };


    return <DataContext.Provider value={[ data, setData, fileName, saveFileName, loading]}>{props.children}</DataContext.Provider>;
}

DataProvider.propTypes = {
    children: PropTypes.node
};
