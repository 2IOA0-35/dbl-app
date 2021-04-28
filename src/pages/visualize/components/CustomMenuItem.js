import React from 'react';
import PropTypes from 'prop-types';
import './CustomMenuItem.css';

export default function CustomMenuItem({ title, children, height }) {
    height *= 40;

    return (
        <li className='custom-menu-item' style={{ height: { height } }}>
            {title}
            {children}
        </li>
    );
}

CustomMenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    height: PropTypes.string.isRequired
};
