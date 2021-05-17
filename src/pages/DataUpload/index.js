import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import {
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Layout,
    message,
    Popover,
    Row,
    Table,
    Typography,
    Upload
} from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../context/data';
import './DataUpload.css';
import parse, { readFile } from '../../utils/parser';

const { Title, Text } = Typography;
// functionality for buttons, checkbox to be added

export default function DataUpload() {

    let [ data, setData, fileName, setFileName ] = React.useContext( DataContext );

    const upload = async ( { onProgress, onError, onSuccess, file } ) => {
        try {
            setFileName( file.name );
            let content = await readFile( file, ( percent ) => {
                console.log( 'progress read', percent );
                onProgress( { percent: percent / 2 } );
            } );

            let data = await parse( content, ( percent ) => {
                console.log( 'progress parse', percent );
                onProgress( { percent: percent / 2 + 50 } );
            } );

            setData( data );

            onSuccess( `Successfully parsed ${data.length} rows.` );
        } catch ( e ) {
            console.error( e );

            setData( null );

            onError( e );
        }
    };

    /*
     *  date: Date,
     *  fromId: number,
     *  fromEmail: string,
     *  fromJobtitle: string,
     *  toId: number
     *  toEmail: string,
     *  toJobtitle: string,
     *  messageType: 'TO'|'CC',
     *  sentiment: number
     */
    const columns = [
        {
            title: 'Column Name',
            dataIndex: 'name',
            key: 'name',
            width: '20px'
        },
        {
            title: 'Data Type',
            dataIndex: 'type',
            key: 'type',
            width: 1
        }
    ];

    const dataCSV = [
        { key: 'date', name: 'date', type: 'Date' },
        { key: 'fromID', name: 'fromID', type: 'number' },
        { key: 'fromEmail', name: 'fromEmail', type: 'string' },
        { key: 'fromJobtitle', name: 'fromJobtitle', type: 'string' },
        { key: 'toId', name: 'toId', type: 'number' },
        { key: 'toEmail', name: 'toEmail', type: 'string' },
        { key: 'toJobtitle', name: 'toJobtitle', type: 'string' },
        { key: 'messageType', name: 'messageType', type: 'TO | CC' },
        { key: 'sentiment', name: 'sentiment', type: 'number' }
    ];

    const info = (
        <div>
            <p>
                The CSV file should consist of <br />
                the following columns and types:
            </p>
            <Table dataSource={dataCSV} columns={columns} pagination={false} size='small' />
        </div>
    );

    return (
        <Layout style={{ textAlign: 'center' }} className={'container'}>
            <Title style={{ padding: '20px', width: '100%', textAlign: 'center' }}>Upload Dataset</Title>
            <Card className='card' style={{ width: '80%' }}>
                <Text>
                    <p>Please upload dataset in CSV format:
                        <Popover content={info} placement='bottom'>
                            <Badge count={<InfoCircleOutlined style={{ color: '#067f5b', lineHeight: '22px', marginLeft: '5px' }} />} />
                        </Popover>
                    </p>

                    <Upload
                        customRequest={upload}
                        accept='.csv'
                        onRemove={() => { setData( null ); setFileName( null ); }}
                        maxCount={1}
                        progress={{ strokeWidth: 5, showInfo: true }}
                        className={'data-upload'}
                        onChange={( info ) => {
                            if ( info.file.status !== 'uploading' ) {
                                console.log( info.file, info.fileList );
                            }
                            if ( info.file.status === 'done' ) {
                                message.success(
                                    `${info.file.name} file uploaded successfully.`
                                );
                            } else if ( info.file.status === 'error' ) {
                                message.error(
                                    `${info.file.name} file upload failed. Check the file structure and try again.`,
                                    5
                                );
                            }
                        }}
                    >
                        <Button type='primary' size='large'>
                            <UploadOutlined /> Upload File
                        </Button>
                    </Upload>
                    <Divider style={{ marginTop: '50px' }} />
                    <Row justify='center'>
                        <Col span={12} style={{ textAlign: 'end', padding: '0 20px' }}>
                            <Button type='ghost'>
                                <Link to='/vis'>Go to Visualize</Link>
                            </Button>
                        </Col>
                        {/* Doesn't work!! */}
                        <Col span={12} style={{ textAlign: 'start', padding: '0 20px' }}>
                            <Button type='ghost'>
                                <Link
                                    to='/vis'
                                // target='_blank'
                                >
                                Open Visualization in New Tab
                                </Link>
                            </Button>
                        </Col>
                    </Row>
                </Text>
            </Card>
            <Card className='card' title='About the Data Upload Tool' style={{ width: '80%' }}>
                <Text>
                    <p>
                    On this page you can upload your own dataset and use our visualization tools to explore the data.
                    The file must be in <code>.csv</code>, which stands for{' '}
                        <a href='https://en.wikipedia.org/wiki/Comma-separated_values'>comma-sepperated values</a> and is a
                    common file type amongst data handling software.
                    </p>
                </Text>
            </Card>
        </Layout>
    );
}
