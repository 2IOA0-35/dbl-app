import React, { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
import './HEBVisualization.css';
import moment from 'moment';
import { DataContext } from '../../../context/data';
import { message } from 'antd';

const VIS_ID = 'Hierarchical Edge Bundling';
const CONTEXT_ID = 'Global';

/**
 * Threshold of the maximum amount of e-mails allowed before fastRender is enabled.
 */
const FAST_RENDER_THRESHOLD = 15000;

export default function HEBVisualization() {
    //Place global context into an array
    const [getOptions, setOptions] = useContext(GlobalContext);

    //Fetch the global options from the context
    const globalOptions = getOptions(CONTEXT_ID);

    //Gets the specific graph options from the context
    const options = getOptions(VIS_ID);

    var showLegend = false;

    let [visualisation, setVisualisation] = useState({
        /**
         * @type {( root ) => void}
         */
        update: null
    });

    //Gets the dataset from the DataContext and stores it in the dataset variable
    let [dataset] = React.useContext(DataContext);

    let [formattedData, setFormattedData] = useState(
        /**
         * Formatted data in hierarchical form to be used by the HEB
         * @type {d3.HierarchyNode<{
         *   name: string;
         *   children: any[];
         * }>}
         */
        null
    );

    //Reference to the visualisation component which d3 can use
    const visBox = useRef();

    /**
     * Initializes the d3 visualization and provides an update function for updating it.
     */
    useEffect(() => {
        //Set width and radius of visualization
        const width = 850;
        const radius = width / 2;

        //d3.cluster is a utility function that will give each node an x and y value when tree is called.
        //This is then used to calculate their positions on the circle.
        //https://github.com/d3/d3-hierarchy#cluster
        const tree = d3.cluster().size([2 * Math.PI, radius - 100]);

        //Create an empty hierarchy structure for when the dataset is not available yet.
        const root = d3.hierarchy({ name: '', children: [] });
        root.incoming = [];
        root.outgoing = [];

        // Create an svg and add it to the component. should scale itself to available space.
        const svg = d3
            .select(visBox.current)
            .append('svg')
            .attr('viewBox', [-width / 2, -width / 2, width, width])
            .style('height', '100%')
            .style('width', '100%');

        //Create the nodes container
        const node = svg.append('g').classed('node', true);

        //Create the links container
        const link = svg.append('g').classed('link', true);

        var legend = d3
            .select(visBox.current)
            .append('div')
            .style('bottom', '20px')
            .style('left', '20px')
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border-radius', '10px')
            .style('padding', '10px 15px 0 15px')
            .style('width', '200px')
            .style('overflow', 'hidden')
            .style('max-height', '53px')
            .style('transition', 'all 250ms ease-in-out 0s');

        var legendHeader = legend
            .append('div')
            .style('display', 'flex')
            .style('justify-content', 'space-between')
            .style('align-items', 'center')
            .style('margin-bottom', '10px')
            .html("<h2 style='margin: 0;'>Legend</h2>");

        var legendContent = legend.append('div');

        var legendButton = legendHeader
            .append('a')
            .style('background', 'none')
            // .style( 'color', 'blue' )
            .style('border', 'none')
            .style('text-decoration', 'none')
            .style('font-size', '1rem')
            .html('Show')
            .on('click', () => {
                if (showLegend) {
                    legendButton.html('Show');
                    legend.style('max-height', '53px');
                } else {
                    legendButton.html('Hide');
                    legend.style('max-height', legendContent.node().offsetHeight + 67 + 'px');
                }
                showLegend = !showLegend;
            })
            .on('mouseover', () => {
                legendButton.style('text-decoration', 'underline');
            })
            .on('mouseout', () => {
                legendButton.style('text-decoration', 'none');
            });

        //Mapping of jobs to colors
        let jobColors = d3.scaleOrdinal(d3.schemeCategory10);

        //Stores all path and node elements that are rendered by their id, used in the onHover calls
        let pathElements = [];
        let nodeElements = {};
        let highlightedEmails = [];

        let previousHighlightedNodes = [];

        let oldOptions = {};

        /**
         * Updates all parts of the visualization that are dependent on either the dataset or the user options.
         *
         * @param {*} root                  Filtered and formatterd dataset
         * @param {*} options               User options
         * @param {Function} getOptions     Get options function
         * @param {Function} setOptions
         */
        let update = (root, options, getOptions, setOptions) => {
            //Checks for all things that have changed in options. Used for rendering optimization
            let changed = {
                nodeColor: false,
                edgeColor: false,
                convertEmail: false,
                edgeThickness: false,
                bundlingFactor: false
            };

            if (
                options.colorNodeBy != oldOptions.colorNodeBy ||
                options.colorRange != oldOptions.colorRange ||
                options.colorFactor != oldOptions.colorFactor
            )
                changed.nodeColor = true;

            if (options.convertEmail != oldOptions.convertEmail) changed.convertEmail = true;

            if (
                options.colorEdgeBy != oldOptions.colorEdgeBy ||
                options.colorRange != oldOptions.colorRange ||
                options.colorFactor != oldOptions.colorFactor
            )
                changed.edgeColor = true;

            if (options.edgeThickness != oldOptions.edgeThickness) changed.edgeThickness = true;

            if (options.bundlingFactor != oldOptions.bundlingFactor) changed.bundlingFactor = true;

            oldOptions = options;

            /**
             * Called when the user hovers over a specific e-mailaddress
             *
             * @param {*} event Mouse event details
             * @param {*} d     E-mail address data that was hovered over
             */
            function onMouseOver(event, d) {
                setOptions(CONTEXT_ID, { ...getOptions(CONTEXT_ID), hoveredNode: d.data.name });
            }

            /**
             * Called when the user clicks on a specific e-mailaddress
             *
             * @param {*} event Mouse event details
             * @param {*} d     E-mail address data that was clicked
             */
            function onMouseClick(event, d) {
                let { selectedNode } = getOptions(CONTEXT_ID);
                if (selectedNode == d.data.name)
                    setOptions(CONTEXT_ID, { ...getOptions(CONTEXT_ID), selectedNode: null });
                else
                    setOptions(CONTEXT_ID, {
                        ...getOptions(CONTEXT_ID),
                        selectedNode: d.data.name,
                        emailsSent: d.outgoing?.length,
                        emailsReceived: d.incoming?.length,
                        position: d.data.jobtitle
                    });
            }

            /**
             * Called when user stops hovering over the specific e-mailadress
             * @param {*} event Mouse event details
             * @param {*} d     E-mail address data that was hovered over
             */
            function onMouseOut(event, d) {
                let { hoveredNode } = getOptions(CONTEXT_ID);

                if (hoveredNode != d.data.name) return;

                setOptions(CONTEXT_ID, { ...getOptions(CONTEXT_ID), hoveredNode: null });
            }

            //Calculates an x and y position for each of the nodes in the circle
            root = tree(root);

            //Update bundling factor for the edges
            let line = d3
                .lineRadial()
                .curve(d3.curveBundle.beta(options.bundlingFactor))
                .radius((d) => d.y)
                .angle((d) => d.x);

            /**
             * Returns the sentiment color based on the selected color scheme (options.colorRange).
             *
             * @param {*} sentiment Sentiment value of a particular e-mail message
             * @returns String of RGB value (#RRGGBB) or default 'black'
             */
            let sentimentColors = (sentiment) => {
                // Using sigmoid function for better distribution because most values are around 0.5
                sentiment = 1 / (1 + ((sentiment + 1) / (1 - sentiment)) ** -options.colorFactor);
                switch (options.colorRange) {
                    case 'Viridis':
                        return d3.interpolateViridis(sentiment);
                    case 'Turbo':
                        return d3.interpolateTurbo(sentiment);
                    case 'Inferno':
                        return d3.interpolateInferno(sentiment);
                    case 'Plasma':
                        return d3.interpolatePlasma(sentiment);
                    case 'Warm':
                        return d3.interpolateWarm(sentiment);
                    case 'Cool':
                        return d3.interpolateCool(sentiment);

                    default:
                        return 'black';
                }
            };

            /**
             * Returns the color of the node based on the user settings
             *
             * @param {*} node Node datapoint
             * @returns String of RGB value (#RRGGBB) or default 'black'
             */
            let colorNode = (node) => {
                switch (options.colorNodeBy) {
                    case 'Average Sentiment': {
                        let sentiment = 0;
                        var divider = node.data.children.mails?.length;

                        node.data.children.mails?.forEach((mail) => {
                            sentiment += mail.sentiment;
                        });

                        sentiment /= divider;

                        return sentimentColors(sentiment);
                    }
                    case 'Minimum Sentiment': {
                        let sentiment = 2;

                        node.data.children.mails?.forEach((mail) => {
                            if (mail.sentiment < sentiment) {
                                sentiment = mail.sentiment;
                            }
                        });

                        if (sentiment == 2) return 'black';

                        return sentimentColors(sentiment);
                    }
                    case 'Maximum Sentiment': {
                        let sentiment = -2;

                        node.data.children.mails?.forEach((mail) => {
                            if (mail.sentiment > sentiment) {
                                sentiment = mail.sentiment;
                            }
                        });

                        if (sentiment == -2) return 'black';

                        return sentimentColors(sentiment);
                    }
                    case "Sender's Jobtitle":
                        return jobColors(node.data.jobtitle);
                    default:
                        return 'black';
                }
            };

            /**
             * Returns the edge color based on the user's settings
             *
             * @param {*} edge Array with 2 elements: outgoing node and incoming node
             * @returns Returns coloring or #444 as default
             */
            let colorEdge = (edge) => {
                switch (options.colorEdgeBy) {
                    case 'Sentiment':
                        var sentiment = 0;
                        var divider = 0;

                        edge[0].data.children.mails.forEach((mail) => {
                            if (edge[1].data.name == mail.toEmail) {
                                sentiment += mail.sentiment;
                                divider++;
                            }
                        });

                        sentiment /= divider;

                        return sentimentColors(sentiment);
                    case "Sender's Jobtitle":
                        return jobColors(edge[0].data.jobtitle);
                    case "Receiver's Jobtitle":
                        return jobColors(edge[1].data.jobtitle);
                    default:
                        return '#444';
                }
            };

            let nodes = node.selectAll('g').data(root.leaves(), (d) => d.data.name);

            nodes
                .enter()
                .append('g')

                //Use the x and y position calculated by the tree function to place it onto the circle
                .attr('transform', (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`)
                .append('text')
                .attr('dy', '0.31em')

                //Rotate the text based on the circle half it is in
                .attr('x', (d) => (d.x < Math.PI ? 6 : -6))
                .attr('text-anchor', (d) => (d.x < Math.PI ? 'start' : 'end'))
                .attr('transform', (d) => (d.x >= Math.PI ? 'rotate(180)' : null))

                //Format text
                .text((d) => {
                    if (options.convertEmail) return d.data.name.replace('.', ' ').substr(0, d.data.name.indexOf('@'));

                    return d.data.name;
                })
                .attr('fill', (d) => colorNode(d))
                .each(function (d) {
                    nodeElements[d.data.name] = this;
                })
                .call((text) => text.append('title'));

            nodes
                .exit()
                .each(function (d) {
                    delete nodeElements[d.data.name];
                })
                .remove();

            let legendContentText = '';
            let jobs = new Map();

            node.selectAll('g')
                .on('mouseover', onMouseOver)
                .on('mouseout', onMouseOut)
                .on('click', onMouseClick)
                .call((elem) => {
                    elem.select('title').text(
                        (d) =>
                            `${d.data.name} (${d.data.jobtitle})` +
                            `\n${d.outgoing?.length} outgoing` +
                            `\n${d.incoming?.length} incoming`
                    );

                    let text = elem.select('text');

                    if (changed.convertEmail)
                        text.text((d) => {
                            if (options.convertEmail)
                                return d.data.name.replace('.', ' ').substr(0, d.data.name.indexOf('@'));

                            return d.data.name;
                        });
                    if (changed.nodeColor || options.colorNodeBy?.includes('Sentiment'))
                        text.attr('fill', (d) => {
                            return colorNode(d);
                        });
                })
                .each((d) => {
                    //console.log(d);
                    let jobtitle = d.data.jobtitle;
                    if ((options.colorNodeBy.includes('Jobtitle') || options.colorEdgeBy.includes('Jobtitle')) && !jobs.has(jobtitle)) {
                        let color = jobColors(jobtitle);
                        jobs.set(jobtitle, color);
                    }
                });

            //Enable or disable fast rendering when there are over a certain number of edges on screen.
            //Fast render tells the browser to not render as much detail (edge curves are less smooth)
            let links = root.leaves().flatMap((leaf) => leaf.outgoing);
            let enableFastRender = links.length > FAST_RENDER_THRESHOLD;

            if (!enableFastRender && svg.classed('fastRender')) message.info('Fast rendering mode disabled.', 5);
            else if (enableFastRender && !svg.classed('fastRender')) message.info('Fast rendering mode enabled.', 5);

            svg.classed('fastRender', enableFastRender).classed('capitalize', options.convertEmail);

            let selection = link.selectAll('path').data(links, (d) => d.id);

            //Add a new path element for all new emails in the filtered dataset
            selection
                .enter()
                .append('path')
                .attr('d', ([i, o]) => line(i.path(o)))
                .attr('stroke', (d) => colorEdge(d))
                .style('stroke-width', options.edgeThickness == 1 ? null : options.edgeThickness + 'px')
                .each(function (d) {
                    pathElements[d.id] = this;
                });
            //Remove all path elements for everything outside filtered dataset
            selection
                .exit()
                .each(function (d) {
                    delete pathElements[d.id];
                })
                .remove();

            //Apply all styles, classes and attributes to each path that is rendered
            let paths = link.selectAll('path');

            if (changed.edgeThickness)
                paths.style('stroke-width', options.edgeThickness == 1 ? null : options.edgeThickness + 'px');

            if (changed.edgeColor) paths.attr('stroke', (d) => colorEdge(d));

            if (changed.bundlingFactor) paths.attr('d', ([i, o]) => line(i.path(o)));

            //Highlighting & unhighlighting

            let { selectedNode, hoveredNode } = getOptions(CONTEXT_ID);

            let toUnhighlight = highlightedEmails.filter(
                (element) => element != selectedNode && element != hoveredNode
            );

            highlightedEmails = [selectedNode, hoveredNode];

            /**
             * Called for all elements that will be unhighlighted
             *
             * @param {*} d            Node data
             * @param {*} element      HTML element
             */
            function unhighlight(d, element) {
                d3.select(element).attr('font-weight', null);
                //Un-highlight the paths
                d3.selectAll(d.incoming.map((d) => pathElements[d.id])).classed('link-target', false);
                d3.selectAll(d.outgoing.map((d) => pathElements[d.id])).classed('link-source', false);
                //Un-highlight the E-mail addresses
                d3.selectAll(d.incoming.map(([d]) => nodeElements[d.data.name])).classed('node-source', false);
                d3.selectAll(d.outgoing.map(([, d]) => nodeElements[d.data.name])).classed('node-target', false);
            }

            toUnhighlight.forEach((email) => {
                let node = root.leaves().find((d) => d.data.name == email);
                if (node != null) unhighlight(node, nodeElements[email]);
            });

            let highlightedNodes = [];

            /**
             * Called when the user hovers over a specific e-mailaddress
             *
             * @param {*} d             Node data
             * @param {*} element       HTML element
             */
            function highlight(d, element) {
                //console.log( d, element );
                d3.select(element).attr('font-weight', 'bold');

                //Highlight the paths by applying a class to them
                d3.selectAll(d.incoming.map((d) => pathElements[d.id]))
                    .classed('link-target', true)
                    .raise();
                d3.selectAll(d.outgoing.map((d) => pathElements[d.id]))
                    .classed('link-source', true)
                    .raise();

                //Highlight the e-mail address labels by applying a class to them
                d3.selectAll(
                    d.incoming.map(([d]) => {
                        if (!highlightedNodes.includes(nodeElements[d.data.name]))
                            highlightedNodes.push(nodeElements[d.data.name]);
                        return nodeElements[d.data.name];
                    })
                ).classed('node-source', true);
                d3.selectAll(
                    d.outgoing.map(([, d]) => {
                        if (!highlightedNodes.includes(nodeElements[d.data.name]))
                            highlightedNodes.push(nodeElements[d.data.name]);
                        return nodeElements[d.data.name];
                    })
                ).classed('node-target', true);
            }

            highlightedEmails.forEach((email) => {
                let node = root.leaves().find((d) => d.data.name == email);
                if (node != null) highlight(node, nodeElements[email]);
            });

            //Unhighlight all previous nodes that might still be highlighted after the removal of an edge
            d3.selectAll(previousHighlightedNodes.filter((node) => !highlightedNodes.includes(node)))
                .classed('node-source', false)
                .classed('node-target', false);

            previousHighlightedNodes = highlightedNodes;

            let jobsSorted = new Map([...jobs.entries()].sort());

            for (let [key, value] of jobsSorted) {
                legendContentText += `<p><span style='color: ${value};'>&#11044</span> ${key}</p>`;
            }
            legendContent.html(legendContentText);

            if (options.colorNodeBy.includes('Sentiment') || options.colorEdgeBy.includes('Sentiment')) {
                legendContent.append('p')
                    .style('font-weight', 'bold')
                    .style('text-align', 'center')
                    .style('margin-bottom', '4px')
                    .html('Sentiment Value');
                legendContent.append('img')
                    .attr('src', `/res/${options.colorRange}.png`)
                    .attr('height', '20px')
                    .attr('width', '100%')
                    .style('border-radius', '5px');
                var colorRangeLabel = legendContent.append('p')
                    .style('display', 'flex')
                    .style('justify-content', 'space-between');
                colorRangeLabel
                    .append('span').html('Angry');
                colorRangeLabel
                    .append('span').html('Happy');
            }

            if (showLegend) {
                legend.style('max-height', legendContent.node().offsetHeight + 67 + 'px');
            }
        };

        //Update the graph with the empty hierarchical data
        update(root, options, getOptions, setOptions);

        setVisualisation({ update: update });

        // When the component unmounts, we will remove the SVG and resize listener
        return () => {
            d3.select(visBox.current).selectAll('*').remove();
        };
    }, []);

    /**
     * Filter and prepare the dataset based on the date range in the timeline.
     */
    useEffect(() => {
        if (!dataset) return;

        // Will be populated with the dataset converted to hierarchical structure
        let root = { name: 'data', children: [] };

        //Create email and job map to easily keep track of all e-mail addresses uniquely and all jobtypes uniquely
        const emailMap = new Map();
        const jobMap = new Map();

        //Get dates from the ones specified by the timeline (use getTime to convert to numbers for efficiency)
        const startDate = new Date(
            moment(globalOptions.timeline).subtract(globalOptions.previousDays, 'days')
        ).getTime();
        const endDate = new Date(globalOptions.timeline).getTime();

        //Loop over the dataset and populate the maps above with all e-mail addresses and jobs (these are not filtered on date).
        //When the date of an e-mail falls within the range, add it to the e-mail map.
        dataset.forEach((data, index) => {
            let { fromJobtitle, fromEmail, toEmail, toJobtitle, date, sentiment } = data;

            if (!jobMap.has(fromJobtitle)) jobMap.set(fromJobtitle, { children: [] });

            if (!jobMap.has(toJobtitle)) jobMap.set(toJobtitle, { children: [] });

            if (!emailMap.get(fromEmail)) emailMap.set(fromEmail, { children: [], jobtitle: fromJobtitle });

            if (!emailMap.get(toEmail)) emailMap.set(toEmail, { children: [], jobtitle: toJobtitle });

            //Convert to number for efficiency
            let time = date.getTime();

            if (time < startDate || time > endDate) return;
            emailMap.get(fromEmail).children.push({ toEmail: toEmail, date: date, sentiment: sentiment, id: index });
        });

        //Add all email adresses to the jobs to create a hierarchical structure
        emailMap.forEach((entry, key) => {
            jobMap
                .get(entry.jobtitle)
                .children.push({ name: key, jobtitle: entry.jobtitle, children: { mails: entry.children } });
        });

        //Populate the root object with the hierarchical job data
        //The root object then contains the structure wanted by d3.hierarchy
        jobMap.forEach((entry, key) => {
            root.children.push({ name: key, children: entry.children });
        });

        //Populate each e-mail address with it's incoming and outgoing edges (e-mails).
        function bilink(root) {
            const map = new Map(root.leaves().map((d) => [d.data.name, d]));

            //Create all outgoing edges for each e-mail address
            for (const d of root.leaves()) {
                d.incoming = [];
                d.outgoing = d.data?.children?.mails?.map((i) => {
                    let array = [d, map.get(i.toEmail)];
                    array.id = i.id;
                    return array;
                });

                if (!d.outgoing) d.outgoing = [];
            }
            //Create all incoming edges for the email addresses based on outgoing edges
            for (const d of root.leaves()) {
                for (const o of d.outgoing) {
                    o[1].incoming.push(o);
                }
            }

            return root;
        }

        let data = bilink(
            d3
                .hierarchy(root)
                .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))
        );

        setFormattedData(data);
    }, [dataset, globalOptions.timeline, globalOptions.previousDays, options]);

    /**
     * Apply to the data to the visualisation when either the visualisation or the data changes.
     */
    useEffect(() => {
        // Can't do anything without data or update function
        if (!formattedData || !visualisation) return;

        //Trigger a visualisation update that lets d3 rerender all data
        visualisation.update(formattedData, options, getOptions, setOptions);
    }, [formattedData, globalOptions, visualisation]);

    //console.log( 'HEB rerender' );

    return (
        <div>
            <h1 style={{ margin: '10px 20px' }}>{VIS_ID}</h1>
            <div ref={visBox} style={{ position: 'absolute', top: 50, width: '100%', height: 'calc(100% - 50px)' }} />
        </div>
    );
}
