import React from 'react';
import {  Button, Upload, Row, Col, Card, Checkbox, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './DataUpload.css';

// functionality for buttons, checkbox, and upload to be added
// upload should check if file type is csv

export default function DataUpload() {
    return (
        <React.Fragment>
            <div className='body'>
                {/* Header of page  */}
                <h1 className= 'top'>
                    Data Upload Page
                </h1>
                {/* Upload section */}
                <section >
                    <Row justify='center'>
                        <Col span={5}>
                        <p1>
                            Please upload dataset in CSV format: 
                        </p1>
                        </Col>
                        <Col span={3} >
                        <Upload>
                            <Button type='primary'>
                                <UploadOutlined/> Upload File
                            </Button>
                        </Upload>
                        </Col>
                    </Row>
                    <br /><br />
                    <Row justify='center'>
                        <Col span={22}>
                        <Divider 
                        style={{borderColor:'white'}}/>
                        </Col>
                    </Row>
                    {/* select section */}
                    <Row justify='center'>
                        <p3>
                            Select Visualization 
                        </p3>
                    </Row>
                    <br/><br/>
                    <Row justify='center'>
                        <Col >
                        <Checkbox>
                                <p2>Hierarchical Edge Bundling</p2>
                            </Checkbox>
                        </Col>
                        <Col offset={1}>
                            <Checkbox>
                                <p2>Disjoint Force-Directed</p2>
                            </Checkbox>
                        </Col>
                        <Col offset={1}>
                            <Checkbox>
                                <p2>Force-Directed Graph</p2>
                            </Checkbox>
                        </Col>
                        <Col offset={1}>
                            <Checkbox>
                                <p2>Arc Diagram</p2>
                            </Checkbox>
                        </Col>
                        <Col offset={1}>
                            <Checkbox>
                                <p2>3D force directed graph</p2>
                            </Checkbox>
                        </Col>
                    </Row>
                    <br/>
                    <Row justify='center'>
                        <Col span={22}>
                        <Divider 
                        style={{borderColor:'white'}}/>
                        </Col>
                    </Row>

                    {/* 2nd select section */}
                    <br/>
                    <Row justify='center'>
                        <Card title="Select how you want to view the visualizations" 
                            style={{ width: 500, height: 150, color:'white'}}>
                            <Row justify='center'>
                                <Col >
                                    <Button type='ghost' size='large'>
                                        Split Page
                                    </Button>
                                </Col>
                                <Col offset={3}>
                                    <Button type='ghost' size ='large'>
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