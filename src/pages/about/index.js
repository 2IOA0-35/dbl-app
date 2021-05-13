import React from 'react';
import { Typography, Card } from 'antd';
import './index.css';

const { Title, Text } = Typography;

export default function About() {
    return (
        <div className='container'>
            <Title style={{ padding: '20px', width: '100%', textAlign: 'center', color: 'white' }}>
                About the visualisations
            </Title>
            <Card
                className='left'
                title='Hierarchical Edge Bundling'
                cover={
                    <img
                        alt='Hierarchical Edge Bundling'
                        style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
                        src='./res/HEB.png'
                    />
                }
                extra={
                    <a href='https://observablehq.com/@d3/hierarchical-edge-bundling' target='_blank' rel='noreferrer'>
                        Source
                    </a>
                }
            >
                <Text>
                    This visualisation shows all nodes around a circle with their incoming and outgoing connections.
                    These connections are colored when the user hovers over a node. Nodes can also be grouped together
                    by displaying them next to eachother
                    <br />
                    This visualisation is well suited for this project, because it can easily show incoming and outgoing
                    e-mails for the employees. The way of displaying the nodes and groups of nodes is very clear and can
                    be used to explore the dataset in different ways.
                </Text>
            </Card>

            <Card
                className='right'
                title='Disjoint Force-Directed Graph'
                cover={
                    <img
                        alt='Hierarchical Edge Bundling'
                        style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
                        src='./res/DFG.png'
                    />
                }
                extra={
                    <a
                        href='https://observablehq.com/@d3/disjoint-force-directed-graph'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Source
                    </a>
                }
            >
                <Text>
                    This visualisation shows the nodes and their connections by drawing lines between them. It uses
                    forces to keep the nodes from becoming cluttered and to enable grouping of certain nodes. The nodes
                    can be different colors, which is also well suited for grouping nodes. It is disjoint because not
                    all nodes have to be connected to eachother.
                    <br />
                    This visualisation is a good choice for this project because it can show the emails between
                    employees by displaying connections between nodes. The physical grouping of nodes and the coloring
                    of nodes can be used to analyse certain groups of nodes and their email behaviour.
                </Text>
            </Card>

            <Card
                title='The D3 library'
                className='left'
                extra={
                    <a href='https://d3js.org' target='_blank' rel='noreferrer'>
                        Source
                    </a>
                }
            >
                <Text>
                    D3 is a javascript library which enables powerful visualisations in javascript apps. It allows data
                    to generate a Document Object Model (DOM) and change parts of the page based on the data. This means
                    it is well suited for interactive visualisations. The library also has some examples of the
                    visualisations used in this project, which allows for easy implementation into this webapp.
                    <br />
                    Since the team was not very experienced with visualizations for a webapp and the visualisations used
                    in the project needed to be interactive D3 was an ideal choice for a visualisation library.
                </Text>
            </Card>

            <hr style={{ width: '80%' }} />

            <Title style={{ padding: '20px', width: '100%', textAlign: 'center', color: 'white' }}>About us</Title>

            <Card title='Christine Jacob' className='right'>
                <Text>Here you can put a bit of text about yourself.</Text>
            </Card>

            <Card title='Tom van Liempd' className='left'>
                <Text>Here you can put a bit of text about yourself.</Text>
            </Card>

            <Card title='Aloys Riswick' className='right'>
                <Text>Here you can put a bit of text about yourself.</Text>
            </Card>

            <Card title='Hugo van Schalm' className='left'>
                <Text>Here you can put a bit of text about yourself.</Text>
            </Card>

            <Card title='Kristopher Schlett' className='right'>
                <Text>Here you can put a bit of text about yourself.</Text>
            </Card>

            <Card title='Anke Staal' className='left'>
                <Text>Here you can put a bit of text about yourself.</Text>
            </Card>
        </div>
    );
}
