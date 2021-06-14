import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
import { DataContext } from '../../../context/data';
import { ForceGraph3D } from 'react-force-graph';

const VIS_ID = '3D Force-Directed Graph';
const CONTEXT_ID = 'Global';

export default function FD3DVisualization() {

    // #region ------------------ SETUP -------------------

    const [ getOptions, setOptions ] = useContext( GlobalContext );

    const globalOptions = getOptions( CONTEXT_ID );

    const options = getOptions( VIS_ID );

    const [ dataset ] = React.useContext( DataContext );

    // Reference to the visualization container
    const visBox = useRef();
    // Reference to the visualization element (Needed to call d3Force method from react-force-graph)
    const fgRef = useRef();

    const [ visualization, setVisualization ] = useState();

    const [ updater, setUpdater ] = useState({
        /**
         * @type {( graphData, maxDegree, getOptions, setOptions ) => void}
         */
        update: null
    });

    const [ formattedData, setFormattedData ] = useState(
        /**
         * Formatted dataset that can be used by the force-directed graph
         * @type {{
         *     nodes: Map<string,{ id: string, job: string }>,
         *     links: { source: string, target: string, date: moment.Moment }[]
         * }}
         */
        null
    );

    const [ filteredData, setFilteredData ] = useState(
        /**
         * Filtered dataset within a specific date range
         * @type {{
         *     nodes: { id: string, job: string }[],
         *     links: { source: string, target: string, date: moment.Moment }[],
         *     maxDegree: number,
         * }}
         */
        null
    );

    useEffect(() => {

        // Outside update function so it remembers all jobs
        let { jobColors } = getOptions(CONTEXT_ID);
        // Old values needed to avoid unnecessary updates
        let oldDates = [];
        let oldEdgeSize = options.edgeSize;

        // Update handler for all things that depend on the nodes and links
        let update = (graphData, maxDegree, getOptions, setOptions) => {

            let { hoveredNode, selectedNode, emailsSent, emailsReceived } = getOptions(CONTEXT_ID);
            let options = getOptions(VIS_ID);
            let jobs = new Map();
            let graphDataAttribute = {};

            // Sets proper values for node info panel in sidebar
            let updateSelectedNode = (node) => {            
                if (selectedNode != node.id || emailsSent != node.outDegree || emailsReceived != node.inDegree)
                    setOptions(CONTEXT_ID, {
                        ...getOptions(CONTEXT_ID),
                        selectedNode: node.id,
                        emailsSent: node.outDegree, 
                        emailsReceived: node.inDegree, 
                        position: node.job
                    });
            };

            // Update legend
            graphData.nodes.forEach( (node) => {
                if(jobs.has(node.job))
                    jobs.set(node.job, jobs.get(node.job) + 1);
                else
                    jobs.set(node.job,1);
                
                // Update selectednode because we're already looping over every node
                if (node.id == selectedNode)
                    updateSelectedNode(node);
            });
            updateLegend(jobs);

            // Only update graph data if timeframe changed
            if (graphData.dates[0].toString() != oldDates[0] || graphData.dates[1].toString() != oldDates[1])
                graphDataAttribute = { graphData: graphData };

            // Main Visualization Updater. Try to use functions outside setter to keep this readable
            setVisualization(
                <ForceGraph3D
                    {...graphDataAttribute }
                    backgroundColor='rgba(0,0,0,0)'
                    linkColor={(link) => isSelectedLink(link) ? 'rgba(255,0,0,0.5)' : `rgba(85,85,85,${options.edgeOpacity})`}
                    linkDirectionalArrowLength={options.linkArrows ? 6 : 0}
                    linkDirectionalArrowRelPos={0}
                    linkDirectionalArrowColor={(link) => isSelectedLink(link) ? '#f00' : '#555'}
                    linkDirectionalParticles={options.linkParticles ? 1 : 0}
                    linkDirectionalParticleSpeed={0.005}
                    linkDirectionalParticleWidth={(link) => isSelectedLink(link) ? 4 : 0}
                    linkOpacity={1}
                    linkWidth={(link) => isSelectedLink(link) ? 2 : 1}
                    nodeColor={node => nodeColorer(node)}
                    nodeLabel={node => nodeLabeler(node)}
                    nodeOpacity={1}
                    nodeRelSize={options.nodeSize}
                    nodeVal={node => nodeSizer(node)}
                    ref={fgRef}
                    onNodeHover={node => handleNodeHover(node)}
                    onNodeClick={node => handleNodeClick(node)}
                />);

            // True if link is connected to selected node
            let isSelectedLink = (link) => link.sender == selectedNode || link.receiver == selectedNode;
                
            // Sets node color based on graph options & handles legend update
            let nodeColorer = (node) => {
                let color = '#067f5b';
                
                if (options.colorBy)
                    color = jobColors(node.job);

                if (node.id == hoveredNode)
                    color = '#000';

                if (node.id == selectedNode)
                    color = '#f00';

                return color;
            };

            // Sets the node label based on email address
            let nodeLabeler = (node) => {
                return `<span 
                            style='
                                color: #333;
                                text-transform: capitalize; 
                                background: #fff;
                                padding: 3px 5px;
                                border-radius: 3px;
                                font-weight: bold;
                            '
                        >
                            ${node.id.replace('.', ' ').substr(0, node.id.indexOf('@'))}
                        </span>`;
            };

            // Sets node size based on graph options
            let nodeSizer = (node) => {
                if (!options.dynamicNodes) 
                    return 1;

                return (1 + node.degree * options.nodeScaleFactor * 3 / maxDegree);
            };

            // Sets hoveredNode in global context
            let handleNodeHover = (node) => {
                if (node && (node.id == hoveredNode || node.id == selectedNode) ) 
                    return;

                setOptions(CONTEXT_ID, {
                    ...getOptions(CONTEXT_ID),
                    hoveredNode: node?.id || null
                });
            };

            // Sets selectedNode in global context
            let handleNodeClick = (node) => {
                setOptions(CONTEXT_ID, {
                    ...getOptions(CONTEXT_ID),
                    selectedNode: selectedNode == node.id ? null : node.id,
                    emailsSent: selectedNode == node.id ? 0 : node.outDegree, 
                    emailsReceived: selectedNode == node.id ? 0 : node.inDegree, 
                    position: selectedNode == node.id ? null : node.job
                });
            };

            // Sets edge size (Check if changed, otherwise 'ReheatSimulation' causes chaos)
            if (oldEdgeSize != options.edgeSize) {
                // '?' safety measure in case fgRef not defined
                fgRef.current?.d3Force('link').distance(options.edgeSize); 
                fgRef.current?.d3ReheatSimulation(); 
            }

            oldEdgeSize = options.edgeSize;
            oldDates[0] = graphData.dates[0].toString();
            oldDates[1] = graphData.dates[1].toString();
        };

        setUpdater({
            update: update
        });

        // Don't show legend by default
        let showLegend = false;

        // Add legend div
        const legend = d3.select(visBox.current)
            .append('div')
            .style('position', 'absolute')
            .style('bottom', '20px')
            .style('left', '20px')
            .style('background-color', 'white')
            .style('border-radius', '10px')
            .style('padding', '10px 15px 0 15px')
            .style('width', '200px')
            .style('overflow', 'hidden')
            .style('max-height', '53px')
            .style('transition', 'all 250ms ease-in-out 0s');

        // Add legend header to legend
        const legendHeader = legend
            .append('div')
            .style('display', 'flex')
            .style('justify-content', 'space-between')
            .style('align-items', 'center')
            .style('margin-bottom', '10px')
            .html("<h2 style='margin: 0;'>Legend</h2>");

        // Add content division to legend
        const legendContent = legend.append('div');

        // Add button to legendHeader
        const legendButton = legendHeader
            .append('a')
            .style('text-decoration', 'none')
            .style('font-size', '1rem')
            .html('Show')
            .on('click', () => {
                if (showLegend) {
                    legendButton.html('Show');
                    legend.style('max-height', '53px');
                } else {
                    legendButton.html('Hide');
                    legend.style('max-height', (legendContent.node().offsetHeight + 67) + 'px');
                }
                showLegend = !showLegend;
            })
            .on('mouseover', () => {
                legendButton.style('text-decoration', 'underline');
            })
            .on('mouseout', () => {
                legendButton.style('text-decoration', 'none');
            });

        // Sets the legend content
        const updateLegend = (jobs) => {
            let legendContentText = '';
            let jobsSorted = new Map([...jobs.entries()].sort());
            
            for (let [key, value] of jobsSorted)
                legendContentText += `<p><span style='color: ${jobColors(key)};'>&#11044</span> ${key}<span style="float: right">${value}</span></p>`;
            
            legendContent.html(legendContentText);
            
            if (showLegend)
                legend.style('max-height', (legendContent.node().offsetHeight + 67) + 'px');
        };

        // Resize handler that is called when the window size changes
        let resize = () => {
            let width  = visBox.current.offsetWidth;
            let height = visBox.current.offsetHeight;

            setVisualization(
                <ForceGraph3D
                    height={height}
                    width={width}
                />);
        };
       
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(visBox.current);

        // Fixes a bug where the initial size is not correct
        setTimeout(resize, 10);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Prepare & format the provided dataset
    useEffect( () => {

        let formatted = { links: [], nodes: new Map() };

        dataset.forEach( ( data ) => {
            const { fromEmail, toEmail, date, fromJobtitle, toJobtitle } = data;

            let emailDate = moment( date );

            // Add nodes for the from and to addresses if they do not already exist with job as metadata
            if ( !formatted.nodes.has( fromEmail ) )
                formatted.nodes.set( fromEmail, { id: fromEmail, job: fromJobtitle } );
            if ( !formatted.nodes.has( toEmail ) )
                formatted.nodes.set( toEmail, { id: toEmail, job: toJobtitle } );

            // Add a link between to employees for each email (does not filter out duplicate links because they might have different dates)
            formatted.links.push( { source: fromEmail, target: toEmail, date: emailDate } );

        } );

        setFormattedData( formatted );

    }, [ dataset ] );

    // Data filterer that will execute if a user changes options
    useEffect( () => {
        // If there is no data available, ignore update
        if ( !formattedData )
            return;

        const startDate = new Date( moment( globalOptions.timeline ).subtract( globalOptions.previousDays, 'days' ) );
        const endDate = new Date( globalOptions.timeline );

        let filtered = { nodes: [], links: [], maxDegree: 0, dates: [startDate, endDate] };

        // Links & nodes maps to eliminate duplicates
        let links = new Map();
        let nodes = new Map();

        // Loop through all links in the dataset.
        // For each one that falls within the date range, we add it (if it does not already exist) and add the source and target.
        formattedData.links.forEach( ( link ) => {
            if ( link.date < startDate || link.date > endDate )
                return;

            if ( !nodes.has( link.source ) ) {
                let node = formattedData.nodes.get( link.source );

                // Set all degrees to zero. These will be computed in the next loop
                node.degree    = 0;
                node.outDegree = 0;
                node.inDegree  = 0;
                node.links     = [];
                node.neighbors = [];
                
                filtered.nodes.push( node );
                
                nodes.set( link.source, true );
            }

            if ( !nodes.has( link.target ) ) {
                let node = formattedData.nodes.get( link.target );

                // Set all degrees to zero. These will be computed in the next loop
                node.degree    = 0;
                node.outDegree = 0;
                node.inDegree  = 0;
                node.links     = [];
                node.neighbors = [];
                
                filtered.nodes.push( node );
                
                nodes.set( link.target, true );
            }

            if ( !links.has( `${link.source}${link.target}` ) ) {
                // make shallow copy to avoid breaking 'formattedData'
                filtered.links.push( {...link, sender: link.source, receiver: link.target} );
                links.set( `${link.source}${link.target}`, true );
            }

            let source = formattedData.nodes.get( link.source );
            let target = formattedData.nodes.get( link.target );

            source.outDegree++;
            source.degree++;
            target.inDegree++;
            target.degree++;

        } );

        // We compute the degree of each node and link
        filtered.links.forEach( ( link ) => {
            let a = {};
            let b = {};

            filtered.nodes.forEach( ( node ) => {

                // update degree of the source
                if ( link.source === node.id )
                    a = node;

                // update degree of the target
                if ( link.target === node.id )
                    b = node;
                
                filtered.maxDegree = node.degree > filtered.maxDegree ? node.degree : filtered.maxDegree;
            } );
            
            a.neighbors.push(b);
            b.neighbors.push(a);
  
            a.links.push(link);
            b.links.push(link);
        } );

        setFilteredData( filtered );

    }, [ formattedData, globalOptions, options ] );

    // Update when filtered data changes
    useEffect(() => {
        if (!filteredData || !updater.update)
            return;
    
        updater.update(filteredData, filteredData.maxDegree, getOptions, setOptions);

    }, [ filteredData ]);

    return (
        <div>
            <h1 style={{ margin: '10px 20px' }}>{VIS_ID}</h1>
            <div ref={visBox} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {visualization}
            </div>
        </div>
    );
}
