import React from 'react';
import { Layout } from 'antd';
import { GlobalProvider } from './components/GlobalContext';
import './index.css';
import OptionsSidebar from './components/OptionsSidebar';
import VisContainer from './components/VisContainer';
import Timeline from './components/Timeline';

const { Content } = Layout;

export default function Visualize() {
    // main render function
    return (
        <GlobalProvider>
            <Layout className='vis-container'>
                <OptionsSidebar />
                <Content>
                    {/* This row contains the visualizations */}
                    <VisContainer />
                    {/* This row contains the timeline and timeline controls */}
                    <Timeline />
                </Content>
            </Layout>
        </GlobalProvider>
    );
}
