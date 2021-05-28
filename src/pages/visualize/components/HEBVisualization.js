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
    console.log(globalOptions.selectedNode);
    //Gets the specific graph options from the context
    const options = getOptions(VIS_ID);

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
        const node = svg
            .append('g')
            .classed('node', true);

        //Create the links container
        const link = svg
            .append('g')
            .classed('link', true);

        //Mapping of jobs to colors
        let jobColors = d3.scaleOrdinal(d3.schemeCategory10);

        //Stores all path and node elements that are rendered by their id, used in the onHover calls
        let pathElements = [];
        let nodeElements = {};

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

            if( options.colorNodeBy != oldOptions.colorNodeBy || options.colorRange != oldOptions.colorRange || options.colorFactor != oldOptions.colorFactor )
                changed.nodeColor = true;

            if( options.convertEmail != oldOptions.convertEmail )
                changed.convertEmail = true;

            if( options.colorEdgeBy != oldOptions.colorEdgeBy || options.colorRange != oldOptions.colorRange || options.colorFactor != oldOptions.colorFactor )
                changed.edgeColor = true;

            if( options.edgeThickness != oldOptions.edgeThickness )
                changed.edgeThickness = true;

            if( options.bundlingFactor != oldOptions.bundlingFactor )
                changed.bundlingFactor = true;

            oldOptions = options;

            /**
             * Called when the user hovers over a specific e-mailaddress
             *
             * @param {*} event Mouse event details
             * @param {*} d     E-mail address data that was hovered over
             */
            function onMouseOver(event, d) {
                //setOptions(CONTEXT_ID, {...getOptions(CONTEXT_ID), selectedNode: d.data.name});

                d3.select(this).attr('font-weight', 'bold');

                //Highlight the paths by applying a class to them
                d3.selectAll(d.incoming.map((d) => pathElements[d.id]))
                    .classed('link-target', true)
                    .raise();
                d3.selectAll(d.outgoing.map((d) => pathElements[d.id]))
                    .classed('link-source', true)
                    .raise();

                //Highlight the e-mail address labels by applying a class to them
                d3.selectAll(d.incoming.map(([d]) => nodeElements[d.data.name])).classed('node-source', true);
                d3.selectAll(d.outgoing.map(([, d]) => nodeElements[d.data.name])).classed('node-target', true);
            }

            /**
             * Called when the user clicks on a specific e-mailaddress
             *
             * @param {*} event Mouse event details
             * @param {*} d     E-mail address data that was clicked
             */
            function onMouseClick(event, d) {
                //setOptions(CONTEXT_ID, {...getOptions(CONTEXT_ID), selectedNode: d.data.name});
                if (d3.select(this).attr('clicked')) {
                    d3.select(this).attr('clicked', null);
                    console.log('here');
                    //Highlight the paths by applying an attribute to them
                    d3.selectAll(d.incoming.map((d) => pathElements[d.id])).attr('clicked', null);
                    d3.selectAll(d.outgoing.map((d) => pathElements[d.id])).attr('clicked', null);

                    //Highlight the e-mail address labels by applying a class to them
                    d3.selectAll(d.incoming.map(([d]) => nodeElements[d.data.name])).attr('clicked', null);
                    d3.selectAll(d.outgoing.map(([, d]) => nodeElements[d.data.name])).attr('clicked', null);
                } else {
                    d3.select(this).attr('clicked', true);

                    //Highlight the paths by applying an attribute to them
                    d3.selectAll(d.incoming.map((d) => pathElements[d.id])).attr('clicked', true);
                    d3.selectAll(d.outgoing.map((d) => pathElements[d.id])).attr('clicked', true);

                    //Highlight the e-mail address labels by applying a class to them
                    d3.selectAll(d.incoming.map(([d]) => nodeElements[d.data.name])).attr('clicked', true);
                    d3.selectAll(d.outgoing.map(([, d]) => nodeElements[d.data.name])).attr('clicked', true);
                }
            }

            /**
             * Called when user stops hovering over the specific e-mailadress
             * @param {*} event Mouse event details
             * @param {*} d     E-mail address data that was hovered over
             */
            function onMouseOut(event, d) {
                //setOptions(CONTEXT_ID, { ...getOptions(CONTEXT_ID), hoveredNode: null });
                if (!d3.select(this).attr('clicked')) {
                    d3.select(this).attr('font-weight', null);
                    //Un-highlight the paths
                    d3.selectAll(d.incoming.map((d) => pathElements[d.id])).classed('link-target', false);
                    d3.selectAll(d.outgoing.map((d) => pathElements[d.id])).classed('link-source', false);
                    //Un-highlight the E-mail addresses
                    d3.selectAll(d.incoming.map(([d]) => nodeElements[d.data.name])).classed('node-source', false);
                    d3.selectAll(d.outgoing.map(([, d]) => nodeElements[d.data.name])).classed('node-target', false);
                }
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

            nodes.enter()
                .append( 'g' )
                
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
                .call((text) =>
                    text.append('title')
                );

            nodes.exit()
                .each(function (d) {
                    delete nodeElements[d.data.name];
                })
                .remove();

            node.selectAll( 'g' ).on('mouseover', onMouseOver)
                .on('mouseout', onMouseOut)
                .on('click', onMouseClick)
                .call((elem) => {
                    elem
                        .select('title')
                        .text(
                            (d) =>
                                `${d.data.name} (${d.data.jobtitle})` +
                                `\n${d.outgoing?.length} outgoing` +
                                `\n${d.incoming?.length} incoming`
                        );

                    let text = elem.select('text');
                           
                    if( changed.convertEmail )
                        text.text((d) => {
                            if (options.convertEmail) return d.data.name.replace('.', ' ').substr(0, d.data.name.indexOf('@'));

                            return d.data.name;
                        });
                    if( changed.nodeColor || options.colorNodeBy?.includes( 'Sentiment' ) )
                        text.attr('fill', ( d ) => { return colorNode( d ); } );
                } );
            

            //Enable or disable fast rendering when there are over a certain number of edges on screen.
            //Fast render tells the browser to not render as much detail (edge curves are less smooth)
            let links = root.leaves().flatMap((leaf) => leaf.outgoing);
            let enableFastRender = links.length > FAST_RENDER_THRESHOLD;

            if (!enableFastRender && svg.classed('fastRender')) message.info('Fast rendering mode disabled.', 5);
            else if (enableFastRender && !svg.classed('fastRender')) message.info('Fast rendering mode enabled.', 5);

            svg.classed('fastRender', enableFastRender).classed('capitalize', options.convertEmail);

            let selection = link.selectAll('path').data(links, ( d ) => d.id);

            //Add a new path element for all new emails in the filtered dataset
            selection.enter().append('path')
                .attr('d', ([i, o]) => line(i.path(o)))
                .attr('stroke', (d) => colorEdge(d))
                .style('stroke-width', options.edgeThickness == 1 ? null : options.edgeThickness + 'px')
                .each( function( d ) {
                    pathElements[ d.id ] = this;
                } );
            //Remove all path elements for everything outside filtered dataset
            selection.exit()
                .each(function( d ) {
                    delete pathElements[ d.id ];
                } )
                .remove();

            //Apply all styles, classes and attributes to each path that is rendered
            let paths = link.selectAll('path');

            if( changed.edgeThickness )
                paths.style('stroke-width', options.edgeThickness == 1 ? null : options.edgeThickness + 'px');

            if( changed.edgeColor )
                paths.attr('stroke', (d) => colorEdge(d));

            if( changed.bundlingFactor )
                paths.attr('d', ([i, o]) => line(i.path(o)));
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

        if (!dataset)
            return;

        // Will be populated with the dataset converted to hierarchical structure
        let root = { name: 'data', children: [] };

        //Create email and job map to easily keep track of all e-mail addresses uniquely and all jobtypes uniquely
        const emailMap = new Map();
        const jobMap = new Map();

        //Get dates from the ones specified by the timeline (use getTime to convert to numbers for efficiency)
        const startDate = new Date(moment(globalOptions.timeline).subtract(globalOptions.previousDays, 'days')).getTime();
        const endDate = new Date(globalOptions.timeline).getTime();

        //Loop over the dataset and populate the maps above with all e-mail addresses and jobs (these are not filtered on date).
        //When the date of an e-mail falls within the range, add it to the e-mail map.
        dataset.forEach((data, index) => {

            let { fromJobtitle, fromEmail, toEmail, toJobtitle, date, sentiment } = data;

            if (!jobMap.has(fromJobtitle))
                jobMap.set(fromJobtitle, { children: [] });

            if (!jobMap.has(toJobtitle))
                jobMap.set(toJobtitle, { children: [] });

            if (!emailMap.get(fromEmail))
                emailMap.set(fromEmail, { children: [], jobtitle: fromJobtitle });

            if (!emailMap.get(toEmail))
                emailMap.set(toEmail, { children: [], jobtitle: toJobtitle });

            //Convert to number for efficiency
            let time = date.getTime();

            if (time < startDate || time > endDate)
                return;
            emailMap.get(fromEmail).children.push({ toEmail: toEmail, date: date, sentiment: sentiment, id: index });

        });

        //Add all email adresses to the jobs to create a hierarchical structure 
        emailMap.forEach((entry, key) => {
            jobMap.get(entry.jobtitle).children.push({ name: key, jobtitle: entry.jobtitle, children: { mails: entry.children } });
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

                if (!d.outgoing)
                    d.outgoing = [];
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

    }, [dataset, globalOptions, options]);

    /**
     * Apply to the data to the visualisation when either the visualisation or the data changes.
     */
    useEffect(() => {

        // Can't do anything without data or update function
        if (!formattedData || !visualisation)
            return;

        //Trigger a visualisation update that lets d3 rerender all data
        visualisation.update(formattedData, options, getOptions, setOptions);

    }, [formattedData, visualisation]);

    return (
        <div>
            <h1 style={{ margin: '10px 20px' }}>{VIS_ID}</h1>
            <div ref={visBox} style={{ position: 'absolute', top: 50, width: '100%', height: 'calc(100% - 50px)' }} />
        </div>
    );
}