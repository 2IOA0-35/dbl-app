import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
import { DataContext } from '../../../context/data';

const VIS_ID = 'Disjoint Force-Directed';
const CONTEXT_ID = 'Global';

export default function FDVisualization() {

    // #region ------------------ SETUP -------------------

    const [getOptions] = useContext(GlobalContext);

    const globalOptions = getOptions(CONTEXT_ID);

    let [visualisation, setVisualisation] = useState({
        /**
         * @type {( nodes, links, maxDegree, options ) => void}
         */
        update: null
    });

    // Variables used for infobox display
    var currentNode;
    var checked = false;
    var recentID;

    // Variables used for Legend
    var showLegend = false;

    let [dataset] = React.useContext(DataContext);

    let [formattedData, setFormattedData] = useState(
        /**
         * Formatted dataset that can be used by the force-directed graph
         * @type {{
         *     nodes: Map<string,{ id: string, job: string }>,
         *     links: { source: string, target: string, date: moment.Moment }[]
         * }}
         */
        null
    );

    let [filteredData, setFilteredData] = useState(
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

    const options = getOptions(VIS_ID);

    // Reference to the visualisation element
    const visBox = useRef();

    // #endregion

    // #region ----------------- D3 SETUP -----------------

    // Set-up the SVG drawing
    useEffect(() => {

        // Initialize all SVG elements
        let svg = d3
            .select(visBox.current)
            .append('svg')
            .style('height', '100%')
            .style('width', '100%');

        let link = svg
            .append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6);

        let node = svg
            .append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5);

        // infobox for onclick
        var infobox = d3.select(visBox.current)
            .append('div')
            .style('top', '5.34px')
            .style('left', '20.15px')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border-radius', '10px')
            .style('padding', '10px');

        var legend = d3.select(visBox.current)
            .append('div')
            .style('bottom', '20.34px')
            .style('left', '20.15px')
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border-radius', '10px')
            .style('padding', '10px')
            .style('width', '200px')
        
        var legendHeader = legend
            .append('div')
            .style('display', 'flex')
            .style('justify-content', 'space-between')
            .style('align-items', 'center')
            .html('<h2>Legend</h2>');

        var legendButton = legendHeader
            .append('a')
            .style('background',  'none')
            .style('color', 'blue')
            .style('border', 'none')
            .style('text-decoration', 'none')
            .style('font-size', '1rem')
            .html('Show')
            .on('mouseover', () => {
                legendButton.style('text-decoration', 'underline');
            })
            .on('mouseout', () => {
                legendButton.style('text-decoration', 'none');
            })
        
        var legendContent = legend.append('div').style('display', 'none');

        legendButton
            .on('click', () => {
                if(showLegend){
                    legendContent.style('display', 'none');
                    legendButton.html(' Show');
                } else {
                    legendContent.style('display', 'block');
                    legendButton.html(' Hide');
                }
                showLegend = !showLegend;
            });
        // Initialize forces & simulation
        let manyBodyForce = d3.forceManyBody();
        let linkForce = d3.forceLink([]).id((d) => d.id);

        let simulation = d3
            .forceSimulation([])
            .force('x', d3.forceX())
            .force('y', d3.forceY())
            .force('link', linkForce)
            .force('charge', manyBodyForce);

        // Simulation tick handler, that sets the correct positions of all nodes.
        simulation.on('tick', () => {
            link.selectAll('line').attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);

            node.selectAll('circle').attr('cx', (d) => d.x).attr('cy', (d) => d.y);
        });

        // Dragging Handlers
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0).alphaDecay(1 - 0.001 ^ (1 / 300));
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // Job color scale that is used to color nodes based on jobs
        let jobColors = d3.scaleOrdinal(d3.schemeCategory10);

        // Resize handler that is called when the window size changes
        let resize = () => {
            let width = visBox.current.offsetWidth;
            let height = visBox.current.offsetHeight;

            svg.attr('viewBox', [-width / 2, -height / 2, width, height]);
        };

        window.addEventListener('resize', resize);

        // Fixes a bug where the initial size is not correct
        setTimeout(resize, 10);

        // Update handler for all things that depend on the nodes and links
        let update = (nodes, links, maxDegree, options) => {

            // Make a shallow copy to protect against mutation, while
            // recycling old nodes to preserve position and velocity.
            const old = new Map(node.selectAll('circle').data().map(d => [d.id, d]));

            nodes = nodes.map(d => ({ ...(old.get(d.id) || {}), ...d }));
            links = links.map(d => ({ ...d }));

            // if dynamic nodes is set then make the lines be dynamic
            if (options.dynamicEdges) {
                manyBodyForce.strength(links.length * -0.01 * options.edgeScaleFactor - options.edgeSize);
            } else {
                // otherwise keep it the same
                manyBodyForce.strength(-options.edgeSize);
            }

            // Apply nodes & links to the simulation
            simulation.nodes(nodes);
            linkForce.links(links);

            // Apply nodes & links in the SVG
            link.selectAll('line').data(links).join('line');
            node.selectAll('circle').data(nodes).join('circle');

            // Remove all title elements such that they can be recreated with correct info
            // (This is a kind of inefficient way of doing things, but this will probably get replaced by a pop-up when a node is clicked or something)
            node.selectAll('circle').selectAll('title').remove();

            // On click show infobox for node
            node.selectAll('circle').on('click', function (d, i) {
                if (!checked) {
                    checked = true;
                    recentID = i.id;
                    currentNode = d3.select(this);
                    d3.select(this).style('stroke', 'red');
                    infobox
                        .html('Node ID: ' + i.id + '<br>Emails Sent: ' + i.outDegree
                            + '<br>Email Received: ' + i.inDegree + '<br>Position: ' + i.job)
                        .transition().duration(500)
                        .style('opacity', 1);
                } else if (checked) {
                    if (recentID === i.id) {
                        d3.select(this).style('stroke', 'white');
                        recentID = '';
                        infobox
                            .transition()
                            .duration(500)
                            .style('opacity', 0);
                    } else {
                        node.selectAll('circle').style('stroke', (d) => {
                            return 'white';
                        });
                        recentID = i.id;
                        currentNode = d3.select(this);
                        currentNode.style('stroke', 'red');
                        infobox
                            .html('Node ID: ' + i.id + '<br>Emails Sent: ' + i.outDegree
                                + '<br>Email Received: ' + i.inDegree + '<br>Position: ' + i.job)
                            .transition()
                            .duration(500)
                            .style('opacity', 1);
                    }
                }
            });

            // Apply attributes to all nodes
            var currentNodePresent = false; // this is to check if prev. selected node is present in current drawing.
            let legendContentText = '';
            let jobs = new Map();

            // Apply attributes to all nodes
            node.selectAll('circle')
                .attr('fill', (d) => {
                    console.log(d.job);
                    let color = '#067f5b';
                    if (options.colorBy) {
                        color = jobColors(d.job);
                        if (!jobs.has(d.job)) {
                            jobs.set(d.job, color);
                            //legendContent += `<p><span style='color: ${color};'>&#11044</span> ${d.job}</p>`;
                        }
                    }

                    return color;
                })
                .style('stroke', (d) => {
                    if (recentID != d.id) {
                        if (!currentNodePresent) {
                            infobox.style('opacity', 0);
                        }

                        return 'white';
                    }
                    currentNodePresent = true;
                    infobox
                        .style('opacity', 1)
                        .html('Node ID: ' + d.id + '<br>Emails Sent: ' + d.outDegree
                            + '<br>Email Received: ' + d.inDegree + '<br>Position: ' + d.job);

                    return 'red';
                })
                .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
                .append('title')
                .text((d) => `Email: ${d.id} + \nDegree: ${d.degree} \ninDegree: ${d.inDegree} \noutDegree: ${d.outDegree} \nJob: ${d.job}`);

            let jobsSorted = new Map([...jobs.entries()].sort());
            for (let [key, value] of jobsSorted) {
                legendContentText += `<p><span style='color: ${value};'>&#11044</span> ${key}</p>`
            }
            legendContent.html(legendContentText);

            // if dynamicNodes set then make size dynamic
            if (options.dynamicNodes) {
                node.selectAll('circle').attr('r', (d) => (1 + d.degree * options.nodeScaleFactor / maxDegree) * options.nodeSize);
            } else {
                // otherwise keep default
                node.selectAll('circle').attr('r', options.nodeSize);
            }

            // Restart the simulation by 'reheating' it with a higher alpha.
            simulation.alpha(0.3).alphaTarget(0).alphaDecay(1 - 0.001 ^ (1 / 1000)).restart();
        };

        // Initialize nodes and links with an empty list.
        update([], [], 0, options);

        // Provide the update and resize functions in the state such that other hooks can use it.
        setVisualisation({
            update: update
        });

        // When the component unmounts, we will remove the SVG and resize listener
        return () => {
            d3.select(visBox.current).selectAll('*').remove();
            window.removeEventListener('resize', resize);
        };
    }, []);

    // #endregion

    // #region --------------- DATA HANDLING --------------

    /**
     * Data Handling is built up of 3 stages, that all have their own useEffect hook.
     *
     * 1. Prepare & format: The raw dataset is transformed into links and nodes.
     *    This step is only executed when the dataset changes for performance.
     * 2. Filter: filter the dataset based on the date range specified.
     *    This step takes all e-mails (links) and filters them based on the date range and adds the correct nodes.
     * 3. Update: use the filtered data and update the D3 visualisation
     */

    // Prepare & format the provided dataset
    useEffect(() => {

        let formatted = { links: [], nodes: new Map() };

        dataset.forEach((data) => {
            const { fromEmail, toEmail, date, fromJobtitle, toJobtitle } = data;

            let emailDate = moment(date);

            // Add nodes for the from and to addresses if they do not already exist with job as metadata
            if (!formatted.nodes.has(fromEmail))
                formatted.nodes.set(fromEmail, { id: fromEmail, job: fromJobtitle });
            if (!formatted.nodes.has(toEmail))
                formatted.nodes.set(toEmail, { id: toEmail, job: toJobtitle });

            // Add a link between to employees for each email (does not filter out duplicate links because they might have different dates)
            formatted.links.push({ source: fromEmail, target: toEmail, date: emailDate });

        });

        setFormattedData(formatted);

    }, [dataset]);

    // Data filterer that will execute if a user changes options
    useEffect(() => {
        // If there is no data available, ignore update
        if (!formattedData)
            return;

        const startDate = new Date(moment(globalOptions.timeline).subtract(globalOptions.previousDays, 'days'));
        const endDate = new Date(globalOptions.timeline);

        let filtered = { nodes: [], links: [], maxDegree: 0 };

        // Links & nodes maps to eliminate duplicates
        let links = new Map();
        let nodes = new Map();

        // Loop through all links in the dataset.
        // For each one that falls within the date range, we add it (if it does not already exist) and add the source and target.
        formattedData.links.forEach((link) => {
            if (link.date < startDate || link.date > endDate)
                return;

            if (!nodes.has(link.source)) {
                let node = formattedData.nodes.get(link.source);

                // Set all degrees to zero. These will be computed in the next loop
                node.degree = 0;
                node.outDegree = 0;
                node.inDegree = 0;

                filtered.nodes.push(node);

                nodes.set(link.source, true);
            }

            if (!nodes.has(link.target)) {
                let node = formattedData.nodes.get(link.target);

                // Set all degrees to zero. These will be computed in the next loop
                node.degree = 0;
                node.outDegree = 0;
                node.inDegree = 0;

                filtered.nodes.push(node);

                nodes.set(link.target, true);
            }

            if (!links.has(`${link.source}${link.target}`) && !links.has(`${link.target}${link.source}`)) {
                filtered.links.push(link);
                links.set(`${link.source}${link.target}`, true);
            }

        });

        // We compute the degree of each node and link
        filtered.links.forEach((link) => {
            filtered.nodes.forEach((node) => {

                // update degree of the source
                if (link.source === node.id) {
                    node.degree = node.degree + 1;
                    node.outDegree = node.outDegree + 1;
                }
                // update degree of the target
                if (link.target === node.id) {
                    node.degree = node.degree + 1;
                    node.inDegree = node.inDegree + 1;
                }
                // if email sent to one's self then subtract one degree didn't implement anythings bout in/out regarding this
                if (link.source === link.target && link.source.id === node.id) {
                    node.degree = node.degree - 1;
                }
                filtered.maxDegree = node.degree > filtered.maxDegree ? node.degree : filtered.maxDegree;
            });
        });

        setFilteredData(filtered);

    }, [formattedData, globalOptions, options]);

    // Update when filtered data changes
    useEffect(() => {
        if (!filteredData || !visualisation.update)
            return;

        visualisation.update(filteredData.nodes, filteredData.links, filteredData.maxDegree, options);

    }, [filteredData]);

    // #endregion

    return (
        <div>
            <h1 style={{ margin: '10px 20px' }}>{VIS_ID}</h1>
            <div ref={visBox} style={{ position: 'absolute', top: 50, width: '100%', height: 'calc(100% - 50px)' }} />
        </div>
    );
}
