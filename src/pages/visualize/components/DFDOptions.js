import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Slider, Select, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CustomMenuItem from './CustomMenuItem';
import { DFDContext } from './DFDContext';

export default function DFDOptions({ colList }) {
    const [
        edgeSize,
        setEdgeSize,
        nodeSize,
        setNodeSize,
        dynamicLines,
        setDynamicEdges,
        dynamicNodes,
        setDynamicNodes,
        colorBy,
        setColorBy
    ] = useContext(DFDContext);

    return (
        <Fragment>
            <CustomMenuItem defaultValue={colorBy} title='Color nodes based on column:' height='2'>
                <Select style={{ width: '100%' }} onChange={(event) => setColorBy(event)}>
                    {colList}
                </Select>
            </CustomMenuItem>
            <CustomMenuItem title='Default node size:' height='2'>
                <Slider defaultValue={nodeSize} onChange={(event) => setNodeSize(event)} />
            </CustomMenuItem>
            <CustomMenuItem title='Default edge size:' height='2'>
                <Slider defaultValue={edgeSize} onChange={(event) => setEdgeSize(event)} />
            </CustomMenuItem>
            <CustomMenuItem title='Make nodes larger based on degree:' height='2'>
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={dynamicNodes}
                    onChange={(event) => setDynamicNodes(event)}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Make edges larger based on frequency:' height='2'>
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={dynamicLines}
                    onChange={(event) => setDynamicEdges(event)}
                />
            </CustomMenuItem>
        </Fragment>
    );
}

DFDOptions.propTypes = {
    colList: PropTypes.array.isRequired
};
