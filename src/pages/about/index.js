import React from 'react';
import { Typography, Card } from 'antd';
import './index.css';

const { Title, Text } = Typography;

export default function About() {
    return (
        <div className='container'>
            <Title style={{ padding: '20px', width: '100%', textAlign: 'center' }}>
                About the visualisations
            </Title>
            <Card
                className='left card'
                title='Hierarchical Edge Bundling'
                cover={
                    <img
                        alt='Hierarchical Edge Bundling'
                        style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '5px' }}
                        src={`${process.env.PUBLIC_URL}/res/HEB.png`}
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
                className='right card'
                title='Disjoint Force-Directed Graph'
                cover={
                    <img
                        alt='Hierarchical Edge Bundling'
                        style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '5px' }}
                        src={`${process.env.PUBLIC_URL}/res/DFG.png`}
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
                className='left card'
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

            <Title style={{ padding: '20px', width: '100%', textAlign: 'center' }}>About us</Title>

            <Card title='Christine Jacob' className='right card'>
                <Text> I am a First Year student studying Bachelor of Computer Science. I worked on the Home Page, Interim Report and Navigation. Through this course I have developed an interest to learn about web development and learned how simple and logical it can be!</Text>
            </Card>

            <Card title='Tom van Liempd' className='left card'>
                <Text>
                    Hi, I am Tom. I am a first year student for the Computer Science Bachelor. 
                    For Envision I have mainly focussed on organisational work and setting up the base layer for our app.
                    Since I already have quite extensive experience with web development and especially React (which Envision runs on), I have helped set-up various bits of the application.
                    One of these is making the Enron dataset compatible with the Hierarchical Edge Bundling visualisation drawn by our visualisation library D3.
                </Text>
            </Card>

            <Card title='Aloys Riswick' className='right card'>
                <Text>
                    <p>
                        {`
                        Hey there! 
                        My name is Aloys and I'm a fist year Computer Science students at the TU/e.
                        Personally, I'm quite interested in web development, 
                        so working on this website was a fun experience for me. 
                        For this website I was heavily involved in the initial layout of the 'Visualize' page.
                        I also worked on implementing the visualization together with the others.
                        Apart from that I worked on some minor features and 
                        occasionally I fix margins or styles that are of by a few pixels. 
                        When I notice that something is just slightly off, I can't help but fix it, 
                        sometimes to the annoyance of my team members perhaps.
                        `}
                    </p>
                    <p>
                        {`
                        I really enjoyed this project and 
                        I believe that this is largely due to the amazing team I got to work with. 
                        I hope that I can use the experience gained from this project in my future endeavors and 
                        I wouldn't mind working with this team again!
                        `}
                    </p>
                </Text>
            </Card>

            <Card title='Hugo van Schalm' className='left card'>
                <Text>
                    Hey, my name is Hugo and I&apos;m a first year student at the Computer Science Bachelor.
                    For this project I mostly helped creating some features for the visualisations, like panning, zooming and the legend.
                    I had a lot of fun working on this project. I had to learn React and D3 from scratch, but to me that was a lot of fun.
                </Text>
            </Card>

            <Card title='Kristopher Alex Schlett' className='right card'>
                <Text>
                    Hello! My name is Kris and I&apos;m also a first year student taking the Bachelor of Computer Science and Engineering.
                    When it comes to Envision, I contributed with mostly creating graph features such as variable node size, zooming/panning, and an Infobox.
                    Working on this project was a very good, and interesting, experience as I have not worked on such a large scale product prior to Envision.
                    In addition, learning the selected languages was a fun challenge since I had never used them beforehand.  
                </Text>
            </Card>

            <Card title='Anke Staal' className='left card'>
                <Text>
                    Hi! My name is Anke Staal and I am 20 years old. I am a second year Psychology &amp; Technology student at the TU/e and 
                    I currently live in Eindhoven together with my six roommates. At the beginning I didn&apos;t have a lot of prior knowledge about anything related to
                    HTML, CSS, JavaScript or React, so I believe I have learned a lot from this project. I enjoyed working together and making something that we are proud of 
                    and I hope that people like it.
                </Text>
            </Card>
        </div>
    );
}
