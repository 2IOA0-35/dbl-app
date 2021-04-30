import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Slider, Select, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

const { Option } = Select;

export default function HEBOptions({ colList }) {
    const visID = 'Hierarchical Edge Bundling';

    const [ getOptions, setOptions ] = useContext(GlobalContext);

    const { edgeSize, nodeSize, dynamicEdges, dynamicNodes, groupBy, colorBy } = getOptions(visID);

    const columnOptions = [];
    for (let i = 0; i < colList.length; i++) {
        columnOptions.push(<Option key={colList[i]}>{colList[i]}</Option>);
    }

    return (
        <Fragment>
            <CustomMenuItem title='Group items based on column:' height='2'>
                <Select
                    defaultValue={groupBy}
                    style={{ width: '100%' }}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), groupBy: event });
                    }}
                >
                    {columnOptions}
                </Select>
            </CustomMenuItem>
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
            <CustomMenuItem title='Default edge size:' height='2'>
                <Slider
                    defaultValue={edgeSize}
                    onAfterChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), edgeSize: event });
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

HEBOptions.propTypes = {
    colList: PropTypes.array.isRequired
};
