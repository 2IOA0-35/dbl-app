import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Slider, Select, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

const { Option } = Select;

export default function DFDOptions({ colList }) {
    const visID = 'Disjoint Force-Directed';

    const [ getOptions, setOptions ] = useContext(GlobalContext);

    const { edgeSize, nodeSize, dynamicEdges, dynamicNodes, colorBy } = getOptions(visID);

    const columnOptions = [];
    for (let i = 0; i < colList.length; i++) {
        columnOptions.push(<Option key={colList[i]}>{colList[i]}</Option>);
    }

    return (
        <Fragment>
            <CustomMenuItem defaultValue={colorBy} title='Color nodes based on column:' height='2'>
                <Select
                    style={{ width: '100%' }}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), colorBy: event });
                    }}
                >
                    {columnOptions}
                </Select>
            </CustomMenuItem>
            <CustomMenuItem title='Default node size:' height='2'>
                <Slider
                    defaultValue={nodeSize}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), nodeSize: event });
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Default edge size:' height='2'>
                <Slider
                    defaultValue={edgeSize}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), edgeSize: event });
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Make nodes larger based on degree:' height='2'>
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
            <CustomMenuItem title='Make edges larger based on frequency:' height='2'>
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
        </Fragment>
    );
}

DFDOptions.propTypes = {
    colList: PropTypes.array.isRequired
};
