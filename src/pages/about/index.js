import { Typography, Card } from 'antd';
import './index.css';

const { Title, Text } = Typography;

export default function About() {
    return (
        <div className='container'>
            <Title style={{ padding: '20px', width: '100%', textAlign: 'center', color: 'white' }}>About</Title>
            <Card className='left' title='Hierarchical Edge Bundling' extra={ <a href='https://observablehq.com/@d3/hierarchical-edge-bundling' target='_blank' rel='noreferrer'>Source</a>}>
                <Text>
                    This visualisation shows all nodes around a circle with their incoming and outgoing connections. 
                    These connections are colored when the user hovers over a node.
                    Nodes can also be grouped together by displaying them next to eachother<br/>
                    This visualisation is well suited for this project, because it can easily show incoming and outgoing e-mails for the employees.
                    The way of displaying the nodes and groups of nodes is very clear and can be used to explore the dataset in different ways.
                </Text>
            </Card>

            <Card className='right' title='Disjoint Force-Directed Graph' extra={ <a href='https://observablehq.com/@d3/disjoint-force-directed-graph' target='_blank' rel='noreferrer'>Source</a> }>
                <Text>
                    This visualisation shows the nodes and their connections by drawing lines between them.
                    It uses forces to keep the nodes from becoming cluttered and to enable grouping of certain nodes.
                    The nodes can be different colors, which is also well suited for grouping nodes.
                    It is disjoint because not all nodes have to be connected to eachother.<br/>
                    This visualisation is a good choice for this project because it can show the emails between employees by displaying connections between nodes.
                    The physical grouping of nodes and the coloring of nodes can be used to analyse certain groups of nodes and their email behaviour.
                </Text>
            </Card>

            <Card title='The D3 library' className='left' extra={ <a href='https://d3js.org' target='_blank' rel='noreferrer'>Source</a> }>
                <Text>
                    This library is a data visualisation library which enables easy data visualisation.
                    It allows data to generate a Document Object Model (DOM) and change parts of the page based on the data.
                    This means it is well suited for interactive visualisations.
                    The library also has some examples of the visualisations used in this project, which allows for easy implementation into this webapp.
                </Text>
            </Card>
        </div>
    );
}
