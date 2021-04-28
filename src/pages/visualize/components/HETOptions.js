import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Slider, Select, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CustomMenuItem from './CustomMenuItem';
import { HETContext } from './HETContext';

export default function HETOptions({ colList }) {
    const [
        edgeSize,
        setEdgeSize,
        nodeSize,
        setNodeSize,
        dynamicEdges,
        setDynamicEdges,
        dynamicNodes,
        setDynamicNodes,
        groupBy,
        setGroupBy,
        colorBy,
        setColorBy
    ] = useContext(HETContext);

    return (
        <Fragment>
            <CustomMenuItem title='Group items based on column:' height='2'>
                <Select defaultValue={groupBy} style={{ width: '100%' }} onChange={(event) => setGroupBy(event)}>
                    {colList}
                </Select>
            </CustomMenuItem>
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
                    defaultChecked={dynamicEdges}
                    onChange={(event) => setDynamicEdges(event)}
                />
            </CustomMenuItem>
        </Fragment>
    );
}

HETOptions.propTypes = {
    colList: PropTypes.array.isRequired
};
