import React, { useState, createContext, useEffect } from 'react';
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

    useEffect( () => {
        function onLoad() {
            db.data.get( 'data' ).then( ( data ) => {
                if( !data )
                    return;

                setData( data.data );
                setFileName( data.filename );
            } );
        }

        window.addEventListener( 'load', onLoad );

        return () => window.removeEventListener( 'load', onLoad );
    } );


    return <DataContext.Provider value={[ data, setData, fileName, setFileName ]}>{props.children}</DataContext.Provider>;
}

DataProvider.propTypes = {
    children: PropTypes.node
};
