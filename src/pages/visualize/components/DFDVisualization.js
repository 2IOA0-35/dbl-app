import React, { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
import test from './graph.json';
import enron from './enron.json';
import enronSample from './enronSample.json';

export default function DFDVisualization(container, linksData, nodesData) {
    // const [ getOptions ] = useContext(GlobalContext);

    const visID = 'Disjoint Force-Directed';

    //const { edgeSize, nodeSize, dynamicEdges, dynamicNodes, colorBy } = getOptions(visID);

    //  const [ state ] = useState({
    //      data: null
    //  });

    const myRef = useRef();
    const height = 680;
    const width = 680;

    useEffect(() => {
        const data = hierarchy(enron);
        const links = data.links.map((d) => Object.create(d));
        const nodes = data.nodes.map((d) => Object.create(d));
        //d3 = require("d3@6")

        const color = () => {
            return '#9D79A0';
        };

        function hierarchy(data) {
            let root = { links: [], nodes: [] };
            const emailMap = new Map();
            const employeeMap = new Map();
            data.forEach((data) => {
                const { fromEmail, toEmail, date } = data;
                if (!employeeMap.has(fromEmail)) {
                    employeeMap.set(fromEmail);
                }
                if (!employeeMap.has(toEmail)) {
                    employeeMap.set(toEmail);
                }
                if (!emailMap.has(`${fromEmail}${toEmail}`) && !emailMap.has(`${toEmail}${fromEmail}`)) {
                    emailMap.set(`${fromEmail}${toEmail}`, [ fromEmail, toEmail ]);
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

        const simulation = d3
            .forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d) => d.id).distance([ 350 ]))
            .force('charge', d3.forceManyBody())
            .force('x', d3.forceX())
            .force('y', d3.forceY());

        function drag(simulation) {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
        }

        const svg = d3
            .select(myRef.current)
            .append('svg')
            .attr('viewBox', [ -width / 2, -height / 2, width, height ])
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

        //validation.then(() => simulation.stop());
    }, []);

    return (
        // D3 viization should go here
        <div>
            <h1 e={{ margin: '10px 20px' }}>{visID}</h1>
            {/* emporary to show that passing data works:</p>
            <p>
                eSize +
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
