import React, { useContext, useEffect, useRef } from 'react';
import moment from 'moment';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
//import test from './graph.json';
import enron from './enron.json';
// import enronSample from './enronSample.json';

export default function FDVisualization() {
    const [ getOptions ] = useContext(GlobalContext);
    const isUpdate = useRef(false);

    const visID = 'Force-Directed Graph';
    const contextID = 'Global';
    var globalOptions = getOptions(contextID);

    var data;
    var links;
    var nodes;
    var node;
    var link;
    var svg;
    var simulation;

    var color;

    const options = getOptions(visID);

    const myRef = useRef();

    function hierarchy(data) {
        let root = { links: [], nodes: [] };
        const emailMap = new Map();
        const employeeMap = new Map();

        // first date: 1998-11-12
        // last date: 2002-06-20
        const startDate = new Date(moment(globalOptions.timeline).subtract(globalOptions.previousDays, 'days'));
        const endDate = new Date(globalOptions.timeline);
        // const startDate = new Date(globalOptions.timeframe[0]);
        // const endDate = new Date(globalOptions.timeframe[1]);

        data.forEach((data) => {
            const { fromEmail, toEmail, date, fromJobtitle, toJobtitle } = data;
            const emailDate = moment(date);
            if (emailDate >= startDate && emailDate <= endDate) {
                if (!employeeMap.has(fromEmail)) {
                    employeeMap.set(fromEmail, fromJobtitle);
                }
                if (!employeeMap.has(toEmail)) {
                    employeeMap.set(toEmail, toJobtitle);
                }
                if (!emailMap.has(`${fromEmail}${toEmail}`) && !emailMap.has(`${toEmail}${fromEmail}`)) {
                    emailMap.set(`${fromEmail}${toEmail}`, [ fromEmail, toEmail ]);
                }
            }
        });
        emailMap.forEach((entry) => {
            root.links.push({ source: entry[0], target: entry[1] });
        });
        employeeMap.forEach((entry, key) => {
            root.nodes.push({ id: key, degree: 0, inDegree: 0, outDegree: 0, job: entry }); // added a base degree of 0 to each node
        });
        return root;
    }
    // function to calculate degrees
    function degrees() {
        let maxDegree = 0;
        data.links.forEach((link) => {
            data.nodes.forEach((node) => {
                //update degree of the source
                if (link.source === node.id) {
                    node.degree = node.degree + 1;
                    node.outDegree = node.outDegree + 1;
                }
                //update degree of the target
                if (link.target === node.id) {
                    node.degree = node.degree + 1;
                    node.inDegree = node.inDegree + 1;
                }
                //if email sent to one's self then subtract one degree didn't implement anythings bout in/out regarding this
                if (link.source === link.target && link.source === node.id) {
                    node.degree = node.degree - 1;
                }
                maxDegree = node.degree > maxDegree ? node.degree : maxDegree;
            });
        });
        return maxDegree;
    }
    // useEffect(
    //     () => {
    //         const data = hierarchy(enron);
    //         links = data.links.map((d) => Object.create(d));
    //         nodes = data.nodes.map((d) => Object.create(d));
    //         link.data(links);
    //         node.data(nodes);
    //     },
    //     [ options, globalOptions ]
    // );

    useEffect(
        () => {
            if (!isUpdate.current) {
                isUpdate.current = true;
                const width = myRef.current.offsetWidth;
                const height = myRef.current.offsetHeight;

                const drag = (simulation) => {
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
                        if (!event.active) simulation.alphaTarget(0);
                        event.subject.fx = null;
                        event.subject.fy = null;
                    }

                    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
                };

                color = d3.scaleOrdinal(d3.schemeCategory10);

                data = hierarchy(enron);
                let maxDegree = degrees();
                links = data.links.map((d) => Object.create(d));
                nodes = data.nodes.map((d) => Object.create(d));

                //Removes old graph
                d3.select(myRef.current).selectAll('*').remove();

                const box_force = () => {
                    for (var i = 0, n = nodes.length; i < n; ++i) {
                        var curr_node = nodes[i];
                        var radius = curr_node.degree + 5;
                        curr_node.x = Math.max(radius, Math.min(width - radius, curr_node.x));
                        curr_node.y = Math.max(radius, Math.min(height - radius, curr_node.y));
                    }
                };

                simulation = d3
                    .forceSimulation(nodes)
                    .force('charge', d3.forceManyBody().strength(nodes.length * -1))
                    .force('center', d3.forceCenter(width / 2, height / 2))
                    .force('box_force', box_force);

                //if dynamic nodes is set then make the lines be dynamic
                if (options.dynamicNodes) {
                    simulation.force(
                        'link',
                        d3.forceLink(links).id((d) => d.id)
                        //.distance([ 10 * data.nodes.length ])
                    );
                } else {
                    //otherwise keep it the same
                    simulation.force('link', d3.forceLink(links).id((d) => d.id));
                }
                svg = d3
                    .select(myRef.current)
                    .append('svg')
                    .attr('viewBox', [ 0, 0, width, height ])
                    .style('height', '100%')
                    .style('width', '100%');

                link = svg
                    .append('g')
                    .attr('stroke', '#999')
                    .attr('stroke-opacity', 0.6)
                    .selectAll('line')
                    .data(links)
                    .join('line')
                    .attr('stroke-width', (d) => Math.sqrt(d.value));

                node = svg
                    .append('g')
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 1.5)
                    .selectAll('circle')
                    .data(nodes)
                    .join('circle')
                    .attr('fill', (d) => {
                        return color(d.job);
                    })
                    .call(drag(simulation));
                //if dynamicNodes set then make size dynamic
                if (options.dynamicNodes) {
                    node.attr('r', (d) => Math.max(d.degree / maxDegree * 20, 5));
                } else {
                    //otherwise keep default
                    node.attr('r', 5);
                }
                // on mouse over return email and number of degrees
                node.append('title').text(function(d) {
                    return `Email: ${d.id} + \nDegree: ${d.degree} \ninDegree: ${d.inDegree} \noutDegree: ${d.outDegree} \nJob: ${d.job}`;
                });
                // node.on('mouseover', function(d) {
                //     d3.select(this).select(text).text((d) => {
                //         return d.degree;
                //     });
                // });
                simulation.on('tick', () => {
                    link
                        .attr('x1', (d) => d.source.x)
                        .attr('y1', (d) => d.source.y)
                        .attr('x2', (d) => d.target.x)
                        .attr('y2', (d) => d.target.y);

                    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
                });
            } else {
                data = hierarchy(enron);
                links = data.links.map((d) => Object.create(d));
                nodes = data.nodes.map((d) => Object.create(d));
                node = node.data(nodes, function(d) {
                    return d.id;
                });
                node.exit.remove();

                link = link.data(links, function(d) {
                    return d.source.id + '-' + d.target.id;
                });
                link.exit().remove();

                simulation.nodes(nodes);
                simulation.force('link').links(links);
                simulation.alpha(1).restart();
            }
        },
        [ globalOptions, options ]
    );

    return (
        // D3 visualization should go here
        <div>
            {console.log('render')}
            <h1 style={{ margin: '10px 20px' }}>{visID}</h1>
            <div ref={myRef} style={{ position: 'absolute', top: 50, width: '100%', height: 'calc(100% - 50px)' }} />
        </div>
    );
}
