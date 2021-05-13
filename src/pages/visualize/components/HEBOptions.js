import React, { useContext } from 'react';
import { Slider, Select, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

const { Option } = Select;

export default function HEBOptions() {
    const visID = 'Hierarchical Edge Bundling';

    const [ getOptions, setOptions ] = useContext( GlobalContext );

    const { edgeThickness, convertEmail, colorEdgeBy, colorNodeBy, bundlingFactor, colorRange, colorFactor } =
        getOptions( visID );

    const edgeOptions = [ 'None', 'Sentiment', "Sender's Jobtitle", "Receiver's Jobtitle" ];
    const nodeOptions = [ 'None', 'Average Sentiment', 'Minimum Sentiment', 'Maximum Sentiment', "Sender's Jobtitle" ];
    const colorOptions = [ 'Viridis', 'Inferno', 'Plasma', 'Warm', 'Cool' ];

    const getOptionList = ( array ) => {
        let columnOptions = [];

        for ( let i = 0; i < array.length; i++ ) {
            columnOptions.push( <Option key={array[i]}>{array[i]}</Option> );
        }

        return columnOptions;
    };

    return (
        <div>
            <CustomMenuItem title='Color edges based on:' height='2'>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={colorEdgeBy}
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), colorEdgeBy: event } );
                    }}
                >
                    {getOptionList( edgeOptions )}
                </Select>
            </CustomMenuItem>
            <CustomMenuItem title='Color nodes based on:' height='2'>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={colorNodeBy}
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), colorNodeBy: event } );
                    }}
                >
                    {getOptionList( nodeOptions )}
                </Select>
            </CustomMenuItem>
            {( colorEdgeBy.includes( 'Sentiment' ) || colorNodeBy.includes( 'Sentiment' ) ) && (
                <>
                    <CustomMenuItem title='Color range:' info='Determines which color range is used to color sentiment. In general, darker means lower sentiment.' height='2'>
                        <Select
                            style={{ width: '100%' }}
                            defaultValue={colorRange}
                            onChange={( event ) => {
                                setOptions( visID, { ...getOptions( visID ), colorRange: event } );
                            }}
                        >
                            {getOptionList( colorOptions )}
                        </Select>
                    </CustomMenuItem>
                    <CustomMenuItem
                        title='Color sensitivity factor:'
                        info='How sensitive the color is to changes in sentiment. Higher values cause loss of detail in extreme sentiment values.'
                        height='2'
                    >
                        <Slider
                            min={1}
                            max={50}
                            defaultValue={colorFactor}
                            onAfterChange={( event ) => {
                                setOptions( visID, { ...getOptions( visID ), colorFactor: event } );
                            }}
                        />
                    </CustomMenuItem>
                </>
            )}
            <CustomMenuItem title='Default edge thickness:' height='2'>
                <Slider
                    min={1}
                    max={10}
                    defaultValue={edgeThickness}
                    onAfterChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), edgeThickness: event } );
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem
                title='Edge bundling factor:'
                info='Determines how strongly the edges are bundled together.'
                height='2'
            >
                <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={bundlingFactor}
                    onAfterChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), bundlingFactor: event } );
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem
                title='Convert E-Mail to name:'
                info="Will try to extract a person's name from their E-Mail address."
                height='2'
            >
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={convertEmail}
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), convertEmail: event } );
                    }}
                />
            </CustomMenuItem>
        </div>
    );
}
