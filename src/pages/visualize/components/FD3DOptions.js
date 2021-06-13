import React, { useContext } from 'react';
import { Slider, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';

export default function FD3DOptions() {
    const visID = '3D Force-Directed Graph';

    const [ getOptions, setOptions ] = useContext( GlobalContext );

    const { edgeSize, nodeSize, dynamicNodes, colorBy, nodeScaleFactor, linkParticles, linkArrows } =
        getOptions( visID );

    return (
        <div>
            <CustomMenuItem defaultValue={colorBy} title='Color nodes based on job:' height='2'>
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={colorBy}
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), colorBy: event } );
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem defaultValue={colorBy} title='Show link particles:' info='The particles represent the emails sent and flow over the links from the sender to the recipient' height='2'>
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={linkParticles}
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), linkParticles: event } );
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem defaultValue={colorBy} title='Show directional arrows:' info='The arrows point to the recipients' height='2'>
                <br />
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={linkArrows}
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), linkArrows: event } );
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Default node size:' info='Increases the size of the spheres' height='2'>
                <Slider
                    min={1}
                    max={20}
                    defaultValue={nodeSize}
                    onAfterChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), nodeSize: event } );
                    }}
                />
            </CustomMenuItem>
            <CustomMenuItem title='Default edge size:' height='2'>
                <Slider
                    max={200}
                    defaultValue={edgeSize}
                    onAfterChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), edgeSize: event } );
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
                    onChange={( event ) => {
                        setOptions( visID, { ...getOptions( visID ), dynamicNodes: event } );
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
                        onAfterChange={( event ) => {
                            setOptions( visID, { ...getOptions( visID ), nodeScaleFactor: event } );
                        }}
                    />
                </CustomMenuItem>
            )}
        </div>
    );
}
