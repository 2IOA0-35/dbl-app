import React, { useContext } from 'react';
import { Slider, Select, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

/**
 * Renders all HEB graph sidebar options
 */
export default function HEBOptions() {
    const visID = 'Hierarchical Edge Bundling';

    const [ getOptions, setOptions ] = useContext( GlobalContext );

    const { edgeThickness, convertEmail, colorEdgeBy, colorNodeBy, bundlingFactor, colorRange, colorFactor, removeDuplicates } =
        getOptions( visID );

    const edgeOptions = [ 'None', 'Sentiment', "Sender's Jobtitle", "Receiver's Jobtitle" ];
    const nodeOptions = [ 'None', 'Average Sentiment', 'Minimum Sentiment', 'Maximum Sentiment', "Sender's Jobtitle" ];
    const colorOptions = [ 'Viridis', 'Turbo', 'Inferno', 'Plasma', 'Warm', 'Cool' ];

    return (
        <div>
            <CustomMenuItem title='Color edges based on:' height='2'>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={colorEdgeBy}
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), colorEdgeBy: event } );
                    }}
                    options={edgeOptions.map( ( option ) => ( { label: option, value: option } ) )}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Color nodes based on:' info='This will change the color of the text of the nodes' height='2'>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={colorNodeBy}
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), colorNodeBy: event } );
                    }}
                    options={nodeOptions.map( ( option ) => ( { label: option, value: option } ) ) }
                />
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
                            options={colorOptions.map( ( option ) => ( { label: option, value: option } ) )}
                        />
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

            <CustomMenuItem
                title='Remove Duplicate Edges:'
                info='Remove duplicate edges when two or more e-mails were sent between the same employees. This might cause some detail to be lost, but will increase performance.'
                height='2'
            >
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={removeDuplicates}
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), removeDuplicates: event } );
                    }}
                />
            </CustomMenuItem>
        </div>
    );
}
