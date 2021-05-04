import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
import test from './graph.json';
import enron from './enron.json';
import enronSample from './enronSample.json';
import { hierarchy } from 'd3';

export default function FDVisualization(container, linksData, nodesData) {
    const [getOptions] = useContext(GlobalContext);
    const isUpdate = useRef(false)

    const visID = 'Force-Directed';
    const contextID = 'Global';
    var globalOptions = getOptions(contextID);

    var data;
    var links;
    var nodes;
    var svg;

    const options = getOptions(visID);

    //  const [ state ] = useState({
    //      data: null
    //  });

    const myRef = useRef();
    const height = 680;
    const width = 680;

    function hierarchy(data) {
        let root = { links: [], nodes: [] };
        const emailMap = new Map();
        const employeeMap = new Map();

        console.log(globalOptions.timeframe);

        // first date: 1998-11-12
        // last date: 2002-06-20
        const startDate = new Date(globalOptions.timeframe[0]);
        const endDate = new Date(globalOptions.timeframe[1]);

        data.forEach((data) => {
            const { fromEmail, toEmail, date } = data;
            const emailDate = moment(date);
            if (emailDate >= startDate && emailDate <= endDate) {
                if (!employeeMap.has(fromEmail)) {
                    employeeMap.set(fromEmail);
                }
                if (!employeeMap.has(toEmail)) {
                    employeeMap.set(toEmail);
                }
                if (!emailMap.has(`${fromEmail}${toEmail}`) && !emailMap.has(`${toEmail}${fromEmail}`)) {
                    emailMap.set(`${fromEmail}${toEmail}`, [fromEmail, toEmail]);
                }
            }
            // emailMap.get(fromEmail).children.push({ toEmail: toEmail, date: date });
        });
        // console.log(emailMap);
        emailMap.forEach((entry, key) => {
            root.links.push({ source: entry[0], target: entry[1] });
        });
        employeeMap.forEach((entry, key) => {
            root.nodes.push({ id: key });
        });
        return root;
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

    useEffect(() => {
        globalOptions = getOptions(contextID);
        //force graph simple just to see if it would work (it didn't)
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
        const color = () => {
            const scale = d3.scaleOrdinal(d3.schemeCategory10);
            return (d) => scale(d.group);
        };

        const height = 600;
        data = hierarchy(enron);
        links = data.links.map((d) => Object.create(d));
        nodes = data.nodes.map((d) => Object.create(d));

        //Removes old graph
        d3.select(myRef.current).selectAll('*').remove();

        const simulation = d3
            .forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d) => d.id))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2));

        svg = d3
            .select(myRef.current)
            .append('svg')
            .attr('viewBox', [0, 0, width, height])
            .style('max-height', '100%')
            .style('max-width', '100%');

        const link = svg
            .append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke-width', (d) => Math.sqrt(d.value));

        const node = svg
            .append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', 5)
            .attr('fill', color)
            .call(drag(simulation));

        node.append('title').text((d) => d.id);

        simulation.on('tick', () => {
            link
                .attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);

            node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
        });
        //invalidation.then(() => simulation.stop());
    }, [globalOptions]);

    return (
        // D3 visualization should go here
        <div>
            {console.log('render')}
            <h1 style={{ margin: '10px 20px' }}>{visID}</h1>
            {/* <p>Temporary to show that passing data works:</p>
        <p>
            {edgeSize +
                ' - ' +
                nodeSize +
                ' - ' +
                dynamicEdges +
                ' - ' +
                dynamicNodes +
                ' - ' +
                groupBy +
                ' - ' +
                colorBy}
        </p> */}
            <div ref={myRef} style={{ position: 'absolute', top: 50, width: '100%', height: 'calc(100% - 50px)' }} />
        </div>
    );
}
