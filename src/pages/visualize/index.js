import React, { useState } from 'react';
import {
    SettingOutlined,
    SlidersOutlined,
    FileSearchOutlined,
    StepBackwardOutlined,
    StepForwardOutlined,
    PauseOutlined,
    CaretRightOutlined
} from '@ant-design/icons';
import { Layout, Menu, Slider, Select, Button, Row, Col, Space } from 'antd';
import CustomMenuItem from './components/CustomMenuItem';
import HETOptions from './components/HETOptions';
import DFDOptions from './components/DFDOptions';
import { HETProvider } from './components/HETContext';
import { DFDProvider } from './components/DFDContext';
import HETVisualization from './components/HETVisualization';
import DFDVisualization from './components/DFDVisualization';
import './index.css';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

// Below is a temp array with all data columns, idealy this will get updated depending on the dataset in use.
const dataColumns = [
    'None',
    'date',
    'fromId',
    'fromEmail',
    'fromJobtitle',
    'toId',
    'toEmail',
    'toJobtitle',
    'messageType',
    'sentiment'
];
const columnOptions = [];
for (let i = 0; i < dataColumns.length; i++) {
    columnOptions.push(<Option key={dataColumns[i]}>{dataColumns[i]}</Option>);
}
const fileName = 'enron.csv';
// this is where the temp stuff ends

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

export default function Visualize() {
    // whether or not the timeline is playing. this state might be (re)moved
    const [ playing, setPlaying ] = useState(false);
    // main graph that is always visible
    const [ graph1, setGraph1 ] = useState('Hierarchical Edge Bundling');
    // optional second graph that will be displayed next to the main graph
    const [ graph2, setGraph2 ] = useState('None');

    // Will render the appropriate option panel depending on the selected graph
    const renderOptions = (graph) => {
        switch (graph) {
            case 'Hierarchical Edge Bundling':
                return <HETOptions colList={columnOptions} />;
            case 'Disjoint Force-Directed':
                return <DFDOptions colList={columnOptions} />;
            case 'Force-Directed Graph':
                return <CustomMenuItem title='Not yet implemented!' height='1' />;
            case 'Arc Diagram':
                return <CustomMenuItem title='Not yet implemented!' height='1' />;
            case '3D force directed graph':
                return <CustomMenuItem title='Not yet implemented!' height='1' />;

            default:
                return <CustomMenuItem title='Set a graph type in &#39;General Options&#39;' height='1' />;
        }
    };

    // Will render the appropriate visualization depending on the selected graph
    const renderVisualizations = (graph) => {
        switch (graph) {
            case 'Hierarchical Edge Bundling':
                return <HETVisualization />;
            case 'Disjoint Force-Directed':
                return <DFDVisualization />;
            case 'Force-Directed Graph':
                return <h1>Not yet implemented!</h1>;
            case 'Arc Diagram':
                return <h1>Not yet implemented!</h1>;
            case '3D force directed graph':
                return <h1>Not yet implemented!</h1>;

            default:
                return <h1>Set a graph type in &#39;General Options&#39;</h1>;
        }
    };

    // main render function
    return (
        <HETProvider>
            <DFDProvider>
                <Layout className='vis-container'>
                    <Sider breakpoint='lg' collapsedWidth='0' width={400}>
                        <Menu
                            mode='inline'
                            defaultOpenKeys={[ 'sub1' ]}
                            style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
                            selectable={0}
                        >
                            {/* This shows the current file and a button that will take you to the 'upload file' window */}
                            <Menu.Item icon={<FileSearchOutlined />}>
                                {fileName}
                                <Button type='primary' style={{ float: 'right' }}>
                                    <Link to='/upload'>Edit</Link>
                                </Button>
                            </Menu.Item>

                            {/* These are general options that should be applicable to any graph. I might move them to a seperate component*/}
                            <SubMenu key='sub1' icon={<SettingOutlined />} title='General Options'>
                                <CustomMenuItem title='Which two columns from the data are used?' height='3'>
                                    <Select defaultValue='fromEmail' style={{ width: '100%' }} onChange={() => {}}>
                                        {columnOptions}
                                    </Select>
                                    <Select defaultValue='toEmail' style={{ width: '100%' }} onChange={() => {}}>
                                        {columnOptions}
                                    </Select>
                                </CustomMenuItem>
                                <CustomMenuItem title='Which Graph(s) do you want to display' height='3'>
                                    <Select
                                        defaultValue='Hierarchical Edge Bundling'
                                        style={{ width: '100%' }}
                                        onChange={(event) => {
                                            setGraph1(event);
                                        }}
                                    >
                                        {graphOptions.slice(1)}
                                    </Select>
                                    <Select
                                        defaultValue='None'
                                        style={{ width: '100%' }}
                                        onChange={(event) => {
                                            setGraph2(event);
                                        }}
                                    >
                                        {graphOptions}
                                    </Select>
                                </CustomMenuItem>
                                <CustomMenuItem title='Select a specific timeframe:' height='2'>
                                    <Slider range={{ draggableTrack: true }} defaultValue={[ 20, 50 ]} />
                                </CustomMenuItem>
                                <CustomMenuItem title='How many previous days are shown?' height='2'>
                                    <Slider defaultValue={10} reverse />
                                </CustomMenuItem>
                            </SubMenu>

                            {/* These are the options specifically for Hierarchical edge bundling, other graphs should have their own unique settings */}
                            <SubMenu key='sub2' icon={<SlidersOutlined />} title='Options for Graph #1'>
                                {renderOptions(graph1)}
                            </SubMenu>

                            {/* Disabled by default, active when two graphs are shown simultaniously */}
                            <SubMenu key='sub3' icon={<SlidersOutlined />} title='Options for Graph #2'>
                                {renderOptions(graph2)}
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Content>
                        {/* This row contains the visualizations */}
                        <Row style={{ flexGrow: '1' }}>
                            <Col span={graph2 !== 'None' ? 12 : 24}>{renderVisualizations(graph1)}</Col>
                            {graph2 !== 'None' && (
                                <Col span={12} style={{ borderLeft: '2px solid gray' }}>
                                    {renderVisualizations(graph2)}
                                </Col>
                            )}
                        </Row>

                        {/* This row contains the timeline and timeline controls */}
                        <Row justify='center' style={{ padding: '20px 50px' }}>
                            <Slider defaultValue={0} style={{ width: '100%' }} />
                            <Space size='middle'>
                                <Button type='primary' icon={<StepBackwardOutlined />} />
                                <Button
                                    type='primary'
                                    onClick={() => setPlaying(!playing)}
                                    icon={playing ? <PauseOutlined /> : <CaretRightOutlined />}
                                />

                                <Button type='primary' icon={<StepForwardOutlined />} />
                            </Space>
                        </Row>
                    </Content>
                </Layout>
            </DFDProvider>
        </HETProvider>
    );
}
