import React, { useContext } from 'react';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';
import GeneralOptions from './GeneralOptions';
import HEBOptions from './HEBOptions';
import DFDOptions from './DFDOptions';
import { Link } from 'react-router-dom';
import { SettingOutlined, SlidersOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Menu, Layout, Button } from 'antd';

const { SubMenu } = Menu;
const { Sider } = Layout;
const fileName = 'enron.csv';

export default function OptionsSidebar() {
    const [ getOptions ] = useContext(GlobalContext);

    const contextID = 'Global';

    const { graph1, graph2, columnList } = getOptions(contextID);

    // Will render the appropriate option panel depending on the selected graph
    const renderOptions = (graph) => {
        switch (graph) {
            case 'Hierarchical Edge Bundling':
                return <HEBOptions colList={columnList} />;
            case 'Disjoint Force-Directed':
                return <DFDOptions colList={columnList} />;
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

    return (
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
                    <GeneralOptions />
                </SubMenu>

                {/* These are the options specifically for Graph1 */}
                <SubMenu key='sub2' icon={<SlidersOutlined />} title='Options For Graph #1'>
                    {renderOptions(graph1)}
                </SubMenu>

                {/* Disabled by default, active when two graphs are shown simultaniously */}
                <SubMenu key='sub3' icon={<SlidersOutlined />} title='Options For Graph #2'>
                    {renderOptions(graph2)}
                </SubMenu>
            </Menu>
        </Sider>
    );
}
