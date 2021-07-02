import { DeleteOutlined } from '@ant-design/icons';
import { Table, Tooltip, message, Popconfirm } from 'antd';
import React from 'react';
import db from '../db';
import { DataContext } from '../context/data';
import presets from './presets';

const { Column } = Table;

//eslint-disable-next-line
export default function DataList( { title, onSwitch }) {

    //eslint-disable-next-line
    let [ data, setData, fileName, setFileName ] = React.useContext( DataContext );

    //Stores the datasets that have been retrieved from the db
    let [ datasets, setDatasets ] = React.useState( null );

    let getDatasets = () => {
        let datasets = [];

        presets.forEach( ( preset ) => {
            datasets.push( {
                ...preset,
                builtin: true,
            } );
        } );

        db.data.each( ( item ) => {
            datasets.push( {
                ...item,
                length: item.data.length,
            } );
        } ).then( () => {
            setDatasets( datasets );
        } );
    };

    React.useEffect( () => {

        getDatasets();

    }, [] );

    return (
        <Table
            dataSource={datasets}
            loading={datasets == null}
            pagination={false}
            className='datasets'
            rowSelection={{
                type: 'radio',
                onChange: async ( keys, records ) => {

                    message.loading( { content: 'Loading dataset...', key: 'Dataset-Change' } );

                    let data = records[ 0 ].data;

                    if( records[ 0 ].builtin )
                        data = await records[ 0 ].get();

                    setData( data );
                    setFileName( records[ 0 ].filename );

                    message.destroy( 'Dataset-Change' );
                    message.success( 'Successfully loaded the dataset.' );

                    if( onSwitch )
                        onSwitch();
                },
                selectedRowKeys: datasets?.filter( ( dataset ) => dataset.filename == fileName ).map( ( dataset ) => dataset.key )
            }}
        >
            <Column title='Name' dataIndex='filename' key='filename' />
            <Column title='Row Count' render={( text, record ) => record?.length?.toString().replace( /\B(?=(\d{3})+(?!\d))/g, '.' )} />
            <Column
                key='action'
                render={( text, record ) =>
                    record.builtin ? 
                        <span style={{ color: '#888' }}>Preset</span>
                        : 
                        <Tooltip title='Delete Dataset' placement='bottom'>
                            <Popconfirm
                                title='Are you sure you want to delete this dataset?'
                                onConfirm={async () => {
                                    await db.data.where( 'key' ).equals( record.key ).delete();

                                    if( fileName == record.filename ) {
                                        setFileName( null );
                                        setData( null );
                                    }

                                    getDatasets();
                                }}
                            >
                                <DeleteOutlined style={{ fontSize: 20, color: '#067f5b', marginTop: 3, cursor: 'pointer' }}/>
                            </Popconfirm>
                        </Tooltip>
                }
            />
        </Table>
    );
}