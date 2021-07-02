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
    Upload,
    Modal
} from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../context/data';
import { FileExclamationOutlined } from '@ant-design/icons';
import './DataUpload.css';
import parse, { readFile } from '../../utils/parser';
import db from '../../db';
import DataList from '../../data/list';

const { Title, Text } = Typography;
// functionality for buttons, checkbox to be added

export default function DataUpload() {

    //eslint-disable-next-line
    let [ data, setData, fileName, setFileName ] = React.useContext( DataContext );

    const upload = async ( { onProgress, onError, onSuccess, file } ) => {
        try {

            let filename = file.name;

            if( !filename.endsWith( '.csv' ) )
                filename += '.csv';

            if( await db.data.get( filename ) !== undefined ) {

                let overwrite = await new Promise( ( resolve ) => Modal.confirm( {
                    title: 'Overwrite File',
                    icon: <FileExclamationOutlined />,
                    content: 'A file with the same name was already uploaded previously. Do you want to overwrite it?',
                    okText: 'Overwrite',
                    onOk() {
                        resolve( true );
                    },
                    onCancel() {
                        resolve( false );
                    },
                } ) );

                if( overwrite ) {
                    await db.data.where( 'filename' ).equals( filename ).delete();

                    //Check if thi was the current active dataset, if so, set to null
                    if( fileName == filename ) {
                        setFileName( null );
                        setData( null );
                    }
                } else {
                    onError();
                    return;
                }
            }

            let content = await readFile( file, ( percent ) => {
                console.log( 'progress read', percent );
                onProgress( { percent: percent / 2 } );
            } );

            let data = await parse( content, ( percent ) => {
                console.log( 'progress parse', percent );
                onProgress( { percent: percent / 2 + 49 } );
            } );

            db.data.put( { key: filename, data: data, filename: filename } );

            onProgress( { percent: 100 } );

            setFileName( filename );
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
                                    `${info.file.name} file upload failed.`,
                                    5
                                );
                            }
                        }}
                    >
                        <Button type='primary' size='large'>
                            <UploadOutlined /> Upload File
                        </Button>
                    </Upload>
                    <p style={{ margin: '20px 0 0 10px' }}>All data will only be stored locally and not uploaded to the internet.</p>
                    <Divider />
                    <p>Available datasets:</p>
                    <DataList key={fileName} />
                    <Divider style={{ marginTop: '-1px' }} />
                    <Row justify='center' gutter={[ 48, 0 ]}>
                        <Col span={12} style={{ textAlign: 'end' }}>
                            <Button type='ghost'>
                                <Link to='/vis'>Go to Visualize</Link>
                            </Button>
                        </Col>
                        <Col span={12} style={{ textAlign: 'start' }}>
                            <Button type='ghost'>
                                <Link
                                    to='/vis'
                                    target='_blank'
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
                        <a href='https://en.wikipedia.org/wiki/Comma-separated_values'>comma-separated values</a> and is a
                    common file type amongst data handling software.
                    </p>
                </Text>
            </Card>
        </Layout>
    );
}
