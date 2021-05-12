import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Slider, Select, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

const { Option } = Select;

export default function DFDOptions({ colList }) {
    const visID = 'Disjoint Force-Directed';

    const [ getOptions, setOptions ] = useContext(GlobalContext);

    const { edgeSize, nodeSize, dynamicEdges, dynamicNodes, colorBy, nodeScaleFactor, edgeScaleFactor } = getOptions(
        visID
    );

    const columnOptions = [];
    for (let i = 0; i < colList.length; i++) {
        columnOptions.push(<Option key={colList[i]}>{colList[i]}</Option>);
    }

    return (
        <div>
            <CustomMenuItem defaultValue={colorBy} title='Color nodes based on job:' height='2'>
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={colorBy}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), colorBy: event });
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Default node size:' height='2'>
                <Slider
                    min={1}
                    max={20}
                    defaultValue={nodeSize}
                    onAfterChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), nodeSize: event });
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Default edge size:' height='2'>
                <Slider
                    max={200}
                    defaultValue={edgeSize}
                    onAfterChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), edgeSize: event });
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem
                title='Make nodes larger based on degree:'
                info='May be overwhelming with few nodes.'
                height='2'
            >
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={dynamicNodes}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), dynamicNodes: event });
                    }}
                />
            </CustomMenuItem>
            {dynamicNodes && (
                <CustomMenuItem
                    title='Node scale factor:'
                    info='By how much the radius of nodes with a high degree will be multiplied.'
                    height='2'
                >
                    <Slider
                        min={1}
                        max={10}
                        defaultValue={nodeScaleFactor}
                        onAfterChange={(event) => {
                            setOptions(visID, { ...getOptions(visID), nodeScaleFactor: event });
                        }}
                    />
                </CustomMenuItem>
            )}
            <CustomMenuItem
                title='Make edges larger based on frequency:'
                info='More noticable with many links.'
                height='2'
            >
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={dynamicEdges}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), dynamicEdges: event });
                    }}
                />
            </CustomMenuItem>
            {dynamicEdges && (
                <CustomMenuItem
                    title='Edge scale factor:'
                    info='Controls how much the edge size will increase depending on the total amount of links.'
                    height='2'
                >
                    <Slider
                        min={1}
                        max={20}
                        defaultValue={edgeScaleFactor}
                        onAfterChange={(event) => {
                            setOptions(visID, { ...getOptions(visID), edgeScaleFactor: event });
                        }}
                    />
                </CustomMenuItem>
            )}
        </div>
    );
}

DFDOptions.propTypes = {
    colList: PropTypes.array.isRequired
};
