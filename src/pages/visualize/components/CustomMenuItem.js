import React from 'react';
import PropTypes from 'prop-types';
import './CustomMenuItem.css';
import { Badge, Popover, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export default function CustomMenuItem({ title, children, height, info }) {
    height *= 40;

    return (
        <li className='custom-menu-item' style={{ height: { height } }}>
            <Space>
                {title}
                {info && (
                    <Popover content={info} title='Info' placement='right'>
                        <Badge count={<InfoCircleOutlined style={{ color: '#1890FF' }} />} />
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
