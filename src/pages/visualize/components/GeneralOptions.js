import React, { Fragment, useContext } from 'react';
import { Slider, Select } from 'antd';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

const { Option } = Select;

export default function GeneralOptions() {
    const [ getOptions, setOptions ] = useContext(GlobalContext);

    const contextID = 'Global';

    const { column1, column2, graph1, graph2, timeframe, previousDays, columnList, playbackSpeed } = getOptions(
        contextID
    );

    const dataGraphs = [
        'None',
        'Hierarchical Edge Bundling',
        'Disjoint Force-Directed',
        'Force-Directed Graph',
        'Arc Diagram',
        '3D force directed graph'
    ];
    const graphOptions = [];
    for (let i = 0; i < dataGraphs.length; i++) {
        graphOptions.push(<Option key={dataGraphs[i]}>{dataGraphs[i]}</Option>);
    }

    return (
        <Fragment>
            <CustomMenuItem title='Which two columns from the data are used?' height='3'>
                <Select
                    defaultValue={column1}
                    style={{ width: '100%' }}
                    onChange={(event) => {
                        setOptions(contextID, { ...getOptions(contextID), column1: event });
                    }}
                >
                    {columnList}
                </Select>
                <Select
                    defaultValue={column2}
                    style={{ width: '100%' }}
                    onChange={(event) => {
                        setOptions(contextID, { ...getOptions(contextID), column2: event });
                    }}
                >
                    {columnList}
                </Select>
            </CustomMenuItem>
            <CustomMenuItem title='Which graph(s) do you want to display' height='3'>
                <Select
                    defaultValue={graph1}
                    style={{ width: '100%' }}
                    onChange={(event) => {
                        setOptions(contextID, { ...getOptions(contextID), graph1: event });
                    }}
                >
                    {graphOptions.slice(1)}
                </Select>
                <Select
                    defaultValue={graph2}
                    style={{ width: '100%' }}
                    onChange={(event) => {
                        setOptions(contextID, { ...getOptions(contextID), graph2: event });
                    }}
                >
                    {graphOptions}
                </Select>
            </CustomMenuItem>
            <CustomMenuItem title='Select a specific timeframe:' height='2'>
                <Slider
                    range={{ draggableTrack: true }}
                    defaultValue={timeframe}
                    onChange={(event) => {
                        setOptions(contextID, { ...getOptions(contextID), timeframe: event });
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='How many previous days are shown?' height='2'>
                <Slider
                    defaultValue={previousDays}
                    reverse
                    onChange={(event) => {
                        setOptions(contextID, { ...getOptions(contextID), previousDays: event });
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Set a custom playback speed:' height='2'>
                <Slider
                    defaultValue={playbackSpeed}
                    onChange={(event) => {
                        setOptions(contextID, { ...getOptions(contextID), playbackSpeed: event });
                    }}
                />
            </CustomMenuItem>
        </Fragment>
    );
}
