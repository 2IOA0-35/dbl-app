import React from 'react';
import { Layout, Card, Typography, Divider, Button, Select, message } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { DataContext } from '../../context/data';

const { Option } = Select;
const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function home() {
    // eslint-disable-next-line
    let [ data, setData, filename, setFileName ] = React.useContext( DataContext );

    let history = useHistory();

    async function onChange( value ) {
        message.loading( { content: 'Loading dataset...', key: 'Dataset-Load' } );

        let data = null;

        try {
            switch ( value ) {
                case 'Enron': {
                    setFileName( 'enron.csv' );
                    data = ( await import( '../../data/enron.json' ) ).default;
                    break;
                }
                case 'EnronSample': {
                    setFileName( 'enronSample.csv' );
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
        setData( data );
        message.success( 'Successfully loaded the dataset.' );
        history.push( '/vis' );
    }

    return (
        <Layout style={{ textAlign: 'center' }} className={'container'}>
            <Title style={{ padding: '20px', width: '100%', textAlign: 'center' }}>
                The Web-App
            </Title>

            <Card
                /* title='Hierarchical Edge Bundling' */
                className='card'
                style={{ width: '80%' }}
            >
                <Text>
                    <p>
                        <Select style={{ width: 500 }} placeholder='Choose from a Sample DataSet' onChange={onChange}>
                            <Option value='Enron'>Enron (31.041 e-mails)</Option>
                            <Option value='EnronSample'>Enron Sample (17 e-mails)</Option>
                        </Select>
                    </p>

                    <p>
                        <Link to='/dataUpload'>
                            <Button type='primary' size={'large'}>Upload a DataSet</Button>
                        </Link>{' '}
                    </p>
                    <p>
                        <Link to='/about'>
                            <Button type='primary'  size={'large'}>About</Button>
                        </Link>{' '}
                    </p>
                </Text>
            </Card>
            
            <Card
                title='About the WebApp'
                className='card'
                style={{ width: '80%' }}
            >
                <Text>
                    <p>
                        This webapp can visualize and display the emails that were sent between the employees of    <a href='https://en.wikipedia.org/wiki/Enron'> Enron.</a>
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
