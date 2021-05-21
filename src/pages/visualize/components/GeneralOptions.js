import React, { useContext, useState } from 'react';
import { Select, Space, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function GeneralOptions( { colList } ) {
    const [ getOptions, setOptions ] = useContext( GlobalContext );

    const contextID = 'Global';

    const [ type, setType ] = useState( 'Date' );

    const { graph1, graph2, timeframe } = getOptions( contextID );

    const dataGraphs = [
        'None',
        'Hierarchical Edge Bundling',
        'Disjoint Force-Directed',
        //'Force-Directed Graph',
        //'Arc Diagram',
        //'3D force directed graph'
    ];
    const graphOptions = [];

    for ( let i = 0; i < dataGraphs.length; i++ ) {
        graphOptions.push( <Option key={dataGraphs[i]}>{dataGraphs[i]}</Option> );
    }

    // could be retrieved from 'columnList' in global context, but for consistency I used a 'colList' prop
    const columnOptions = [];

    for ( let i = 0; i < colList.length; i++ ) {
        columnOptions.push( <Option key={colList[i]}>{colList[i]}</Option> );
    }

    return (
        <div>
            {/*<CustomMenuItem title='Which two columns from the data are used?' height='3'>
                <Select
                    disabled
                    defaultValue={column1}
                    style={{ width: '100%' }}
                    onChange={( event ) => {
                        setOptions( contextID, { ...getOptions( contextID ), column1: event } );
                    }}
                >
                    {columnOptions}
                </Select>
                <Select
                    disabled
                    defaultValue={column2}
                    style={{ width: '100%' }}
                    onChange={( event ) => {
                        setOptions( contextID, { ...getOptions( contextID ), column2: event } );
                    }}
                >
                    {columnOptions}
                </Select> 
            </div></CustomMenuItem>*/}
            <CustomMenuItem title='Which graph(s) do you want to display?' height='3'>
                <Select
                    defaultValue={graph1}
                    style={{ width: '100%' }}
                    onChange={( event ) => {
                        setOptions( contextID, { ...getOptions( contextID ), graph1: event } );
                    }}
                >
                    {graphOptions.slice( 1 )}
                </Select>
                <Select
                    defaultValue={graph2}
                    style={{ width: '100%' }}
                    onChange={( event ) => {
                        setOptions( contextID, { ...getOptions( contextID ), graph2: event } );
                    }}
                >
                    {graphOptions}
                </Select>
            </CustomMenuItem>
            <CustomMenuItem title='Select a specific timeframe:' height='2'>
                <Space>
                    <Select value={type} onChange={setType}>
                        <Option value='date'>Date</Option>
                        <Option value='week'>Week</Option>
                        <Option value='month'>Month</Option>
                        <Option value='quarter'>Quarter</Option>
                        <Option value='year'>Year</Option>
                    </Select>
                    <RangePicker
                        picker={type}
                        onChange={( event ) => {
                            setOptions( contextID, {
                                ...getOptions( contextID ),
                                timeframe: [ event[0], event[1] ]
                            } );
                        }}
                        value={timeframe}
                    />
                </Space>
            </CustomMenuItem>
        </div>
    );
}

GeneralOptions.propTypes = {
    colList: PropTypes.array.isRequired
};
