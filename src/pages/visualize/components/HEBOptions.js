import React, { useContext } from 'react';
import { Slider, Select, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

const { Option } = Select;

export default function HEBOptions() {
    const visID = 'Hierarchical Edge Bundling';

    const [ getOptions, setOptions ] = useContext(GlobalContext);

    const { edgeThickness, convertEmail, colorEdgeBy, colorNodeBy, bundlingFactor } = getOptions(visID);

    const colList = [
        'None',
        'Sentiment',
        "Sender's Jobtitle",
        "Receiver's Jobtitle"
    ];

    const columnOptions = [];
    for (let i = 0; i < colList.length; i++) {
        columnOptions.push(<Option key={colList[i]}>{colList[i]}</Option>);
    }

    return (
        <div>
            <CustomMenuItem defaultValue={colorEdgeBy} title='Color edges based on:' height='2'>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={colorEdgeBy}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), colorEdgeBy: event });
                    }}
                >
                    {columnOptions}
                </Select>
            </CustomMenuItem>
            <CustomMenuItem defaultValue={colorNodeBy} title='Color nodes based on:' height='2'>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={colorNodeBy}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), colorNodeBy: event });
                    }}
                >
                    {columnOptions.slice(0, -1)}
                </Select>
            </CustomMenuItem>
            <CustomMenuItem title='Default edge thickness:' height='2'>
                <Slider
                    min={1}
                    max={10}
                    defaultValue={edgeThickness}
                    onAfterChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), edgeThickness: event });
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Edge bundling factor:' info='Determines how strongly the edges are bundled together.'height='2'>
                <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={bundlingFactor}
                    onAfterChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), bundlingFactor: event });
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Convert E-Mail to name:' info="Will try to extract a person's name from their E-Mail address." height='2'>
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={convertEmail}
                    onChange={(event) => {
                        setOptions(visID, { ...getOptions(visID), convertEmail: event });
                    }}
                />
            </CustomMenuItem>
        </div>
    );
}
