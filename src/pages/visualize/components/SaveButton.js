import { Button, Popconfirm, message } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import domtoimage from 'dom-to-image';
import { SaveFilled, QuestionCircleOutlined } from '@ant-design/icons';
import './SaveButton.css';

export default function SaveButton( { id } ) {
    const filter = ( node ) => {
        return node.tagName !== 'BUTTON';
    };

    const save = () => {
        domtoimage.toPng( document.getElementById( id ), { filter: filter } ).then( function( dataUrl ) {
            var link = document.createElement( 'a' );

            link.download = 'vis.png';
            link.href = dataUrl;
            link.click();
        } );
        message.success( 'Image downloaded' );
    };

    const cancel = () => {
        message.error( 'Canceled download' );
    };

    return (
        <Popconfirm
            onConfirm={save}
            onCancel={cancel}
            okText='Yes'
            cancelText='No'
            title='Do you want to save a .png of the graph?'
            placement='topRight'
            icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
        >
            <Button type='primary' className='save-button' icon={<SaveFilled />} />
        </Popconfirm>
    );
}

SaveButton.propTypes = {
    id: PropTypes.string.isRequired
};
