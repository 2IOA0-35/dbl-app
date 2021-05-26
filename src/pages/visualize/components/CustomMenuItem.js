import React from 'react';
import PropTypes from 'prop-types';
import './CustomMenuItem.css';
import { Badge, Popover, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

/**
 * Provides a premade sidebar menu item component
 */
export default function CustomMenuItem( { title, children, height, info } ) {
    height *= 40;

    return (
        <li className='custom-menu-item' style={{ height: { height } }}>
            <Space>
                {title}
                {info && (
                    <Popover content={info} title='Info' placement='right'>
                        <Badge count={<InfoCircleOutlined style={{ color: '#067f5b' }} />} />
                    </Popover>
                )}
            </Space>
            {children}
        </li>
    );
}

CustomMenuItem.propTypes = {
    info: PropTypes.string,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    height: PropTypes.string.isRequired
};
