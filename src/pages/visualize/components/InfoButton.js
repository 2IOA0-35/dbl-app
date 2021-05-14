import { Button, Popover, Table } from 'antd';
import React, { useContext } from 'react';
import { GlobalContext } from './GlobalContext';
import { InfoCircleOutlined } from '@ant-design/icons';
import './InfoButton.css';

export default function InfoButton() {
    const contextID = 'Global';

    const [ getOptions ] = useContext( GlobalContext );

    const values = getOptions( contextID );

    const dataGlobal = [];
    const dataGraph1 = [];
    const dataGraph2 = [];

    const parseValue = ( value ) => {
        if ( Array.isArray( value ) ) {
            return `${value.join( ', ' )}`;
        }
        
        return `${value}`;
    };

    for ( const [ key, value ] of Object.entries( values ) ) {
        dataGlobal.push( { key: key, variable: key, value: parseValue( value ) } );
    }
    for ( const [ key, value ] of Object.entries( getOptions( values.graph1 ) ) ) {
        dataGraph1.push( { key: key, variable: key, value: parseValue( value ) } );
    }

    for ( const [ key, value ] of Object.entries( getOptions( values.graph2 ) ) ) {
        dataGraph2.push( { key: key, variable: key, value: parseValue( value ) } );
    }

    const columns = [
        {
            title: 'Variable',
            dataIndex: 'variable',
            key: 'variable'
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: 180
        }
    ];

    const content = (
        <div>
            <h2>Global variables</h2>
            <Table dataSource={dataGlobal} columns={columns} pagination={false} size='small' />
            <br />
            <h2>Graph 1 variables</h2>
            <Table dataSource={dataGraph1} columns={columns} pagination={false} size='small' />
            <br />
            <h2>Graph 2 variables</h2>
            <Table dataSource={dataGraph2} columns={columns} pagination={false} size='small' />
        </div>
    );

    return (
        <Popover content={content} title='Summary' placement='leftTop'>
            <Button type='primary' className='info-button' icon={<InfoCircleOutlined />} />
        </Popover>
    );
}
