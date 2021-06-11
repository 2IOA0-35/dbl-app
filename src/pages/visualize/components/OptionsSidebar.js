import React, { useContext, useState } from 'react';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';
import GeneralOptions from './GeneralOptions';
import HEBOptions from './HEBOptions';
import DFDOptions from './DFDOptions';
import FDOptions from './FDOptions';
import FD3DOptions from './FD3DOptions';
import { SettingOutlined, SlidersOutlined, FileSearchOutlined, ReadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Menu, Layout, Button, Modal, Table, Tooltip, Spin } from 'antd';
import { DataContext } from '../../../context/data';
import './OptionsSidebar.css';
import UserManual from './UserManual';
import SelectedNode from './SelectedNode';
import DataList from '../../../data/list';
import { Link } from 'react-router-dom';


const { SubMenu } = Menu;
const { Sider } = Layout;
const { Column } = Table;

/**
 * Renders the sidebar with the correct sections based on the graphs that are selected.
 */
export default function OptionsSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    //eslint-disable-next-line
    let [data, setData, fileName, setFileName, loading] = React.useContext(DataContext);

    const [getOptions] = useContext(GlobalContext);

    const contextID = 'Global';

    const { graph1, graph2, columnList, selectedNode, position, emailsSent, emailsReceived } = getOptions(contextID);

    let [ showDataModal, setDataModal ] = React.useState( false );


    // Will render the appropriate option panel depending on the selected graph
    const renderOptions = (graph) => {

        switch (graph) {
            case 'Hierarchical Edge Bundling':
                return <HEBOptions />;
            case 'Disjoint Force-Directed':
                return <DFDOptions />;
            case 'Force-Directed Graph':
                return <FDOptions />;
            //case 'Arc Diagram':
            //return <CustomMenuItem title='Not yet implemented!' height='1' />;
            case '3D Force-Directed Graph':
                return <FD3DOptions />;
            case 'Manual':
                return <UserManual />;

            case 'SelectedNode':
                return <SelectedNode Email={selectedNode} inDegree={emailsReceived} outDegree={emailsSent} Job={position} />;

            default:
                return <CustomMenuItem title='Set a graph type in &#39;General Options&#39;' height='1' />;
        }
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={() => {
                setCollapsed(!collapsed);
            }}
            breakpoint='lg'
            width={400}
            className='sidebar'
        >
            <Spin spinning={loading}>
                <Menu
                    mode='inline'
                    defaultOpenKeys={['sub1', 'sub5']}
                    style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
                    selectable={0}
                >
                    {/* This shows the current file and a button that will take you to the 'upload file' window */}
                    <Menu.Item
                        icon={<FileSearchOutlined />}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px'
                        }}
                    >
                        <Tooltip title='Select a dataset'>
                            <Button type={!fileName ? 'primary' : null } onClick={() => setDataModal( true )}>{fileName || 'Choose Dataset'}</Button>
                        </Tooltip>
                    </Menu.Item>


                    <Modal
                        title={'Choose a Dataset'}
                        visible={showDataModal}
                        onCancel={() => setDataModal( false )}
                        bodyStyle={{ padding: 0 }}
                        destroyOnClose={true}
                        footer={[
                            <Tooltip title='Go to the upload page' key='upload'>
                                <Link to='dataUpload'>
                                    <Button style={{ marginRight: 'auto', display: 'block', textAlign: 'left' }}>
                                        Upload
                                    </Button>
                                </Link>
                            </Tooltip>
                        ]}
                    >
                        <DataList onSwitch={() => setDataModal( false )}/>
                    </Modal>
                    {/* These are general options that should be applicable to any graph */}
                    <SubMenu key='sub1' icon={<SettingOutlined />} title='General Options' className='color-5'>
                        <GeneralOptions colList={columnList} />
                    </SubMenu>

                    {/* These are the options specifically for Graph1 */}
                    <SubMenu key='sub2' icon={<SlidersOutlined />} title='Options For Graph #1'>
                        {renderOptions(graph1)}
                    </SubMenu>

                    {/* Disabled by default, active when two graphs are shown simultaneously */}
                    {graph2 != 'None' && (
                        <SubMenu key='sub3' icon={<SlidersOutlined />} title='Options For Graph #2'>
                            {renderOptions(graph2)}
                        </SubMenu>
                    )}

                    {/* Might change to button (Menu.Item) that opens a Modal */}
                    <SubMenu key='sub4' icon={<ReadOutlined />} title='User Manual'>
                        {renderOptions('Manual')}
                    </SubMenu>

                    {/*This is where the selected node is displayed */}
                    <SubMenu key='sub5' icon={<InfoCircleOutlined />} title='Selected Node'>
                        {renderOptions('SelectedNode')}

                    </SubMenu>
                </Menu>
            </Spin>
        </Sider>
    );
}
