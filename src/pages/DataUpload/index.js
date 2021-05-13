import React from 'react';
import { Button, Upload, Row, Col, Card, Checkbox, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './DataUpload.css';
import parse, { readFile } from '../../utils/parser';
import { DataContext } from '../../context/data';

// functionality for buttons, checkbox to be added

export default function DataUpload() {

    // eslint-disable-next-line
    let [ data, setData ] = React.useContext( DataContext );

    const upload = async ( { onProgress, onError, onSuccess, file } ) => {
        try {
            let content = await readFile( file, ( percent ) => {
                console.log( 'progress read', percent );
                onProgress( { percent: percent / 2 } );
            } );

            let data = await parse( content, ( percent ) => {
                console.log( 'progress parse', percent );
                onProgress( { percent: percent / 2 + 50 } );
            } );

            setData( data );

            onSuccess( `Succesfully parsed ${data.length} rows.` );
        } catch ( e ) {
            console.error( e );

            setData( null );

            onError( e );
        }
    };

    return (
        <React.Fragment>
            <div className='body'>
                {/* Header of page  */}
                <h1 className='top'>
                    Data Upload Page
                </h1>
                {/* Upload section */}
                <section >
                    <Row justify='center'>
                        <Col span={5}>
                            <p>
                                Please upload dataset in CSV format:
                            </p>
                        </Col>
                        <Col span={3} >
                            <Upload
                                customRequest={upload}
                                accept='.csv'
                                onRemove={() => setData( null )}
                                maxCount={1}
                                progress={{ strokeWidth: 5, showInfo: true }}
                                className={'data-upload'}
                            >
                                <Button type='primary'>
                                    <UploadOutlined /> Upload File
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                    <br /><br />
                    <Row justify='center'>
                        <Col span={22}>
                            <Divider style={{ borderColor: 'white' }} />
                        </Col>
                    </Row>
                    {/* select section */}
                    <Row justify='center'>
                        <p style={{ fontSize: 'x-large' }}>
                            Select Visualization
                        </p>
                    </Row>
                    <br /><br />
                    <Row justify='center'>
                        <Col >
                            <Checkbox>
                                <p>Hierarchical Edge Bundling</p>
                            </Checkbox>
                        </Col>
                        <Col offset={1}>
                            <Checkbox>
                                <p>Disjoint Force-Directed</p>
                            </Checkbox>
                        </Col>
                        <Col offset={1}>
                            <Checkbox>
                                <p>Force-Directed Graph</p>
                            </Checkbox>
                        </Col>
                        <Col offset={1}>
                            <Checkbox>
                                <p>Arc Diagram</p>
                            </Checkbox>
                        </Col>
                        <Col offset={1}>
                            <Checkbox>
                                <p>3D force directed graph</p>
                            </Checkbox>
                        </Col>
                    </Row>
                    <br />
                    <Row justify='center'>
                        <Col span={22}>
                            <Divider style={{ borderColor: 'white' }} />
                        </Col>
                    </Row>

                    {/* 2nd select section */}
                    <br />
                    <Row justify='center'>
                        <Card title='Select how you want to view the visualizations'
                            style={{ width: 500, height: 150, color: 'white' }}>
                            <Row justify='center'>
                                <Col >
                                    <Button type='ghost' size='large'>
                                        Split Page
                                    </Button>
                                </Col>
                                <Col offset={3}>
                                    <Button type='ghost' size='large'>
                                        New Tab
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Row>
                </section>
            </div>
        </React.Fragment>

    );
}