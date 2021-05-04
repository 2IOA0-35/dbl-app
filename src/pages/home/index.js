import React from 'react';
import { Layout } from 'antd';
import { Typography } from 'antd';
import { Divider } from 'antd';
import { Button } from 'antd';
import { Select } from 'antd';
import { message } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { DataContext } from '../../context/data';

const { Option } = Select;
const { Header, Footer, Content } = Layout;
const { Title } = Typography;

export default function home() {
    //eslint-disable-next-line
    let [ data, setData ] = React.useContext(DataContext);

    let history = useHistory();

    async function onChange(value) {
        message.loading({ content: 'Loading dataset...', key: 'Dataset-Load' });

        let data = null;
        try {
            switch (value) {
                case 'Enron': {
                    data = (await import('../../data/enron.json')).default;
                    break;
                }
                case 'EnronSample': {
                    data = (await import('../../data/enronSample.json')).default;
                    break;
                }
            }
        } catch (e) {
            message.error('An error occured while loading the dataset.');
            console.error('Error while loading dataset: ', e);
            return;
        }
        message.destroy('Dataset-Load');
        setData(data);
        message.success('Succesfully loaded the dataset.');
        history.push('/vis');
    }

    return (
        <Layout style={{ textAlign: 'center' }}>
            <Header style={{ backgroundColor: '#373668', padding: 10 }}>
                <Title level={2}>
                    <font color={'white'}>The Web-App </font>{' '}
                </Title>
            </Header>

            <Layout>
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
                            {/*<Option value="DataSet3">DS3</Option>*/}
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
            </Layout>
        </Layout>
    );
}
