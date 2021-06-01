import React from 'react';
import CustomMenuItem from './CustomMenuItem';
import { Typography, Card } from 'antd';
import PropTypes from 'prop-types';
const { Title, Paragraph, Text } = Typography;
import { Collapse } from 'antd';

const { Panel } = Collapse;


/**
 * Renders the selected node in the sidebar
 */
export default function SelectedNode( { Email, outDegree, inDegree, Job } ) {
    if ( Email == null ) {
        return (
            <CustomMenuItem>
                <Title level={4} style={{ marginTop: '0%' }}>No Node Selected</Title>
            </CustomMenuItem>
        );
    }
    return (
        <li className='custom-menu-item' style={{ padding: '16px' }}>
            <Collapse defaultActiveKey='selected'>
                <Panel key='selected' header={Email}>
                    <Paragraph style={{ lineHeight: '120%' }}>
                        <Text strong>
                            Emails Sent:
                        </Text>
                        {' ' + outDegree}
                    </Paragraph>
                    <Paragraph style={{ lineHeight: '120%' }}>
                        <Text strong>
                            Emails Received:
                        </Text>{' ' + inDegree}
                    </Paragraph>
                    <Paragraph style={{ lineHeight: '120%' }}>
                        <Text strong>
                            Job Title:
                        </Text>
                        {' ' + Job}
                    </Paragraph>
                </Panel>
            </Collapse>
        </li>

    );
}
SelectedNode.propTypes = {
    Email: PropTypes.string,
    outDegree: PropTypes.number,
    inDegree: PropTypes.number,
    Job: PropTypes.string
};