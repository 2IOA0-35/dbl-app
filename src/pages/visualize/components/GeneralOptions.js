import React, { useContext, useState } from 'react';
import { Select, Space, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

const { Option } = Select;
const { RangePicker } = DatePicker;
/**
 * Renders all general options in the sidebar
 */
export default function GeneralOptions() {
    const [ getOptions, setOptions ] = useContext( GlobalContext );

    const contextID = 'Global';

    const [ type, setType ] = useState( 'Date' );

    const { graph1, graph2, timeframe } = getOptions( contextID );

    const dataGraphs = [
        'None',
        'Hierarchical Edge Bundling',
        'Disjoint Force-Directed',
        'Force-Directed Graph',
        //'Arc Diagram',
        '3D Force-Directed Graph'
    ];

    return (
        <div>
            <CustomMenuItem title='Which graph(s) do you want to display?' height='3'>
                <Select
                    defaultValue={graph1}
                    style={{ width: '100%' }}
                    onChange={( event ) => {
                        setOptions( contextID, { ...getOptions( contextID ), graph1: event } );
                    }}
                    options={dataGraphs.slice( 1 ).map( ( option ) => ( { label: option, value: option } ) )}
                />
                <Select
                    defaultValue={graph2}
                    style={{ width: '100%' }}
                    onChange={( event ) => {
                        setOptions( contextID, { ...getOptions( contextID ), graph2: event } );
                    }}
                    options={dataGraphs.map( ( option ) => ( { label: option, value: option } ) )}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Select a specific timeframe:' info='This will change the range of the timeline to fit to your selection' height='2'>
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
