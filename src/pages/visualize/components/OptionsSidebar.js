import React, { useContext, useState } from 'react';
import { Tooltip } from 'antd';
import CustomMenuItem from './CustomMenuItem';
import { GlobalContext } from './GlobalContext';
import GeneralOptions from './GeneralOptions';
import HEBOptions from './HEBOptions';
import DFDOptions from './DFDOptions';
import FDOptions from './FDOptions';
import { Link } from 'react-router-dom';
import { SettingOutlined, SlidersOutlined, FileSearchOutlined, ReadOutlined } from '@ant-design/icons';
import { Menu, Layout, Button } from 'antd';
import { DataContext } from '../../../context/data';
import './OptionsSidebar.css';
import UserManual from './UserManual';

const { SubMenu } = Menu;
const { Sider } = Layout;

export default function OptionsSidebar() {
    const [ collapsed, setCollapsed ] = useState( false );
    
    let [ data, setData, fileName, setFileName ] = React.useContext( DataContext );
    
    const [ getOptions ] = useContext( GlobalContext );

    const contextID = 'Global';

    const { graph1, graph2, columnList } = getOptions( contextID );

    // Will render the appropriate option panel depending on the selected graph
    const renderOptions = ( graph ) => {
        switch ( graph ) {
            case 'Hierarchical Edge Bundling':
                return <HEBOptions />;
            case 'Disjoint Force-Directed':
                return <DFDOptions />;
            case 'Force-Directed Graph':
                return <FDOptions />;
            //case 'Arc Diagram':
               // return <CustomMenuItem title='Not yet implemented!' height='1' />;
            //case '3D force directed graph':
                //return <CustomMenuItem title='Not yet implemented!' height='1' />;
            case 'Manual':
                return <UserManual/>;

            default:
                return <CustomMenuItem title='Set a graph type in &#39;General Options&#39;' height='1' />;
        }
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={() => {
                setCollapsed( !collapsed );
            }}
            breakpoint='lg'
            width={400}
        >
            <Menu
                mode='inline'
                defaultOpenKeys={[ 'sub1' ]}
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
                    <span style={{ marginRight: '10px' }}>{fileName}</span>
                    <Tooltip placement='top' title={'Goes to home page to change the dataset.'}>
                        <Button type='primary'>
                            <Link to='/Home'>Edit Dataset</Link>
                        </Button>
                    </Tooltip>
                </Menu.Item>

                {/* These are general options that should be applicable to any graph */}
                <SubMenu key='sub1' icon={<SettingOutlined />} title='General Options' className='color-5'>
                    <GeneralOptions colList={columnList} />
                </SubMenu>

                {/* These are the options specifically for Graph1 */}
                <SubMenu key='sub2' icon={<SlidersOutlined />} title='Options For Graph #1'>
                    {renderOptions( graph1 )}
                </SubMenu>

                {/* Disabled by default, active when two graphs are shown simultaneously */}
                {graph2 != 'None' && (
                    <SubMenu key='sub3' icon={<SlidersOutlined />} title='Options For Graph #2'>
                        {renderOptions( graph2 )}
                    </SubMenu>
                )}

                {/* Might change to button (Menu.Item) that opens a Modal */}
                <SubMenu key='sub4' icon={<ReadOutlined />} title='User Manual'>
                    {renderOptions( 'Manual' )}
                </SubMenu>
            </Menu>
        </Sider>
    );
}
