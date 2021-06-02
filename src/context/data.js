import React, { useState, createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import db from '../db';
import { count } from 'd3-array';
import enron from '../data/enron.json';
import enronSample from '../data/enronSample.json';

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

    useEffect(() => {
        function onLoad() {
            async function storeSamples(){
                if(await db.data.where('selected').equals(1).first().key !== 'enron.csv'){
                    data = enron;
                    data = data.map( ( item ) => ( {
                        ...item,
                        date: new Date( item.date )
                    } ) );
                    db.data.put( { key: 'enron.csv', data: data, filename: 'enron.csv', selected: 0 } );
                }
    
                if( await db.data.where('selected').equals(1).first().key !== 'enronSample.csv' ){
                    data = enronSample;
                    data = data.map( ( item ) => ( {
                        ...item,
                        date: new Date( item.date )
                    } ) );
                    db.data.put( { key: 'enronSample.csv', data: data, filename: 'enronSample.csv', selected: 0 } );
                }
            }
            
            storeSamples();
            if (db.data.where('selected').equals(1).count() <= 0) {
                return;
            }
            db.data.where('selected').equals(1).first().then((data) => {
                if (!data)
                    return;

                setData(data.data);
                setFileName(data.filename);
            });
        }

        window.addEventListener('load', onLoad);

        return () => window.removeEventListener('load', onLoad);
    });


    return <DataContext.Provider value={[data, setData, fileName, setFileName]}>{props.children}</DataContext.Provider>;
}

DataProvider.propTypes = {
    children: PropTypes.node
};
