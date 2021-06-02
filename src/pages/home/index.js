import React from 'react';
import { Layout, Card, Typography, Button, Select, message, Row, Col, Image, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { DataContext } from '../../context/data';
import db from '../../db';

const { Option } = Select;
const { Title, Text } = Typography;

export default function home() {
    
    //eslint-disable-next-line
    let [ data, setData, fileName, setFileName ] = React.useContext( DataContext );

    let history = useHistory();

    async function onChange( value ) {
        message.loading( { content: 'Loading dataset...', key: 'Dataset-Load' } );

        let data = null;

        let fileName = null;

        try {
            switch ( value ) {
                case 'Enron': {
                    setFileName( 'enron.csv' );
                    fileName = 'enron.csv';
                    data = ( await import( '../../data/enron.json' ) ).default;
                    break;
                }
                case 'EnronSample': {
                    setFileName( 'enronSample.csv' );
                    fileName = 'enronSample.csv';
                    data = ( await import( '../../data/enronSample.json' ) ).default;
                    break;
                }
            }

            data = data.map( ( item ) => ( {
                ...item,
                date: new Date( item.date )
            } ) );
        } catch ( e ) {
            message.error( 'An error occurred while loading the dataset.' );
            console.error( 'Error while loading dataset: ', e );

            return;
        }
        message.destroy( 'Dataset-Load' );
        
        db.data.put( { key: fileName, data: data, filename: fileName, selected: 1 } );
        
        setData( data );
        message.success( 'Successfully loaded the dataset.' );
        history.push( '/vis' );
    }

    return (
        <Layout style={{ textAlign: 'center' }} className={'container'}>
            <Title style={{ padding: '20px', width: '100%', textAlign: 'center', margin: '20px 0' }}>
                <Image
                    style={{ width: '500px', maxWidth: '100%' }}
                    src='/res/envision_banner.png'
                    preview={false}
                    alt='Envision Logo'
                />
            </Title>

            <Card title='How to Use Our Data Analysis Tool ' className='card' style={{ width: '80%' }}>
                <Text>
                    <Row gutter={[ 48, 0 ]}>
                        <Col 
                            xs={{ span: 24, offset: 0 }} 
                            lg={{ span: 15, offset: 0 }} 
                            xxl={{ span: 12, offset: 3 }}
                            style={{ textAlign: 'justify' }}
                        >
                            <p>
                            Welcome to our Data Analysis and Visualization tool! The first step is quite easy. You can
                            choose to either pick one of our predefined datasets, or you can upload your own. When
                            uploading your own dataset, please make sure that it satisfies the requirements. For more
                            information about the dataset requirements, 
                            please go to the <Link to='/dataUpload'>Data Upload</Link> page.
                            </p>
                            <p>
                            Once you&apos;ve selected a dataset, or uploaded your own, you can go to the
                                <Link to='/vis'> Visualize</Link> page to explore the data. 
                            We provide tools to easily view the relations between people in email networks. 
                            This webapp can, for instance, 
                            be used to determine which jobs in a company tend to communicate with each other.
                            </p>
                            <p>
                            If you&apos;re stuck and don&apos;t know how to use the Visualize page, you can view the
                            &apos;User Manual&apos; at the bottom of the sidebar. Additionally, some options have a
                            little
                                <Popover content='More info about an option...' title='Info' placement='top'>
                                    <InfoCircleOutlined style={{ color: '#067f5b', margin: '0 5px' }} />
                                </Popover>
                            next to them. When you hover over this icon, you will be presented with additional
                            information regarding this specific option.
                            </p>
                        </Col>
                        <Col xs={24} lg={9} xxl={6}>
                            <p>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder='Choose from a Sample Dataset'
                                    size='large'
                                    onChange={onChange}
                                >
                                    <Option value='Enron'>Enron (31.041 e-mails)</Option>
                                    <Option value='EnronSample'>Enron Sample (17 e-mails)</Option>
                                </Select>
                            </p>
                            <p>or</p>
                            <p>
                                <Link to='/dataUpload'>
                                    <Button style={{ width: '100%' }} type='primary' size={'large'}>
                                    Upload a Dataset
                                    </Button>
                                </Link>
                            </p>
                        </Col>
                    </Row>
                </Text>
            </Card>

            <Card title='General Information' className='card' style={{ width: '80%' }}>
                <Text>
                    <Row gutter={[ 48, 0 ]}>
                        <Col 
                            xs={{ span: 24, offset: 0 }} 
                            lg={{ span: 6, offset: 0 }}
                            xxl={{ span: 4, offset: 3 }}
                            // style={{ textAlign: 'justify' }}
                        >
                            <Image
                                width={200}
                                style={{ filter: 'grayscale(100%)' }}
                                src='/res/tue_logo.png'
                                preview={false}
                                alt='TU/e Logo'
                            />
                        </Col>
                        <Col 
                            xs={24} 
                            lg={18}
                            xxl={14}
                            style={{ textAlign: 'justify' }}
                        >
                            <p>
                            This webapp was designed to visualize and display the emails sent between 
                            the employees of <a href='https://en.wikipedia.org/wiki/Enron'>Enron. </a> 
                            It should, however, be possible to use any dataset that follows the same structure.
                            If you want to use a custom dataset, 
                            you can do so using the <Link to='/vis'>Data Upload</Link> page,
                            or by clicking the button above.
                            </p>
                            
                            <p>
                            This website has been commissioned by 
                                <a href='https://www.tue.nl/en/'> Eindhoven University of Technology </a> 
                            for the course <code>DBL HTI + Webtech</code>. 
                            The purpose of this course is to work together as a team to make a data visualization tool.
                            The website was constructed over a period of roughly 3 months by a team of 6 members.
                            </p>
                            <p>
                            If you want to know more about the individual visualizations and team members, 
                            please check out the About page.
                            </p>
                        </Col>
                        
                    </Row>
                    <p>
                        <Link to='/about'>
                            <Button type='primary' size={'large'}>
                                About
                            </Button>
                        </Link>
                    </p>
                </Text>
            </Card>

            {/* <Layout>
                <Content style={{ background: 'white', width: '100%', height: '100%' }}>
                    <Divider orientation='left'>About the WebApp</Divider>
                    <p>
                        This webapp can visualize and display the emails that were sent to and from an employee of
                        Enron.
                    </p>
                    <Divider> </Divider>

                    <p>
                        <Select style={{ width: 500 }} placeholder='Choose from a Sample DataSet' onChange={onChange}>
                            <Option value='Enron'>Enron (31.041 e-mails)</Option>
                            <Option value='EnronSample'>Enron Sample (17 e-mails)</Option>
                        </Select>
                    </p>

                    <p>
                        <Link to='/dataUpload'>
                            <Button size={'large'}>Upload a DataSet</Button>
                        </Link>{' '}
                    </p>
                    <p>
                        <Link to='/about'>
                            <Button size={'large'}>About</Button>
                        </Link>{' '}
                    </p>
                </Content>
            </Layout>*/}
        </Layout>
    );
}
