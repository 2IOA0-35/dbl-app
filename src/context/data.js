import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';
import db from '../db';

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

export function DataProvider( props ) {

    let [ data, setData ] = useState(
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

    let [ fileName, setFileName ] = useState( '' );

    window.addEventListener( 'load', () => {
        db.data.get( 'data' ).then( ( data ) => {
            setData( data.data );
            setFileName( data.filename );
        } );
    } );

    return <DataContext.Provider value={[ data, setData, fileName, setFileName ]}>{props.children}</DataContext.Provider>;
}

DataProvider.propTypes = {
    children: PropTypes.node
};
