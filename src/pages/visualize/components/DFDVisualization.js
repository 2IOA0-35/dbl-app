import React, { useContext, useEffect, useRef } from 'react';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
// import test from './graph.json';
import enron from './enron.json';
import moment from 'moment';
import { element, node } from 'prop-types';
// import enronSample from './enronSample.json';

export default function DFDVisualization() {
    const [ getOptions ] = useContext(GlobalContext);

    const visID = 'Disjoint Force-Directed';
    const contextID = 'Global';
    var globalOptions = getOptions(contextID);

    var data;
    var links;
    var nodes;
    var svg;

    const options = getOptions(visID);

    const myRef = useRef();
    const width = 680;

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
                    emailMap.set(`${fromEmail}${toEmail}`, [ fromEmail, toEmail ]);
                }
            }
        });
        employeeMap.forEach((entry, key) => {
            root.nodes.push({ id: key, degree:0, inDegree: 0, outDegree: 0 }); // added base degree of 0 to each node
        });
        emailMap.forEach((entry) => {
            root.links.push({ source: entry[0], target: entry[1] });
        });
        return root;
    }

    //function to calculate degrees
    function degrees () {
        data.links.forEach(link =>{
            data.nodes.forEach(node =>{
                //update degree of the source
                if(link.source === node.id){
                    node.degree = node.degree +1;
                    node.outDegree = node.outDegree +1;
                }
                //update degree of the target
                if(link.target === node.id){
                    node.degree = node.degree +1;
                    node.inDegree = node.inDegree +1;
                }
                //if email sent to one's self then subtract one degree didn't implement anythings bout in/out regarding this
                if((link.source === link.target) && (link.source === node.id)){
                    node.degree = node.degree -1;
                }
            })
        });
    }

    useEffect(
        () => {
            data = hierarchy(enron);
            degrees();
            links = data.links.map((d) => Object.create(d));
            nodes = data.nodes.map((d) => Object.create(d));
            
            

            //Removes old graph
            d3.select(myRef.current).selectAll('*').remove();

            const color = () => {
                return '#9D79A0';
            };

            const simulation = d3
                .forceSimulation(nodes)
                //force('link', d3.forceLink(links).id((d) => d.id).distance([10*data.nodes.length]))//distance linearly grows with nodes
                .force('charge', d3.forceManyBody())
                .force('x', d3.forceX())
                .force('y', d3.forceY());   
            //if dynamic nodes is set then make the lines be dynamic
            if(options.dynamicNodes){
                simulation.force('link', d3.forceLink(links).id((d) => d.id).distance([10*data.nodes.length]));
            }
            else{//otherwise keep it the same
                simulation.force('link', d3.forceLink(links).id((d) => d.id));
            }
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

            svg = d3
                .select(myRef.current)
                .append('svg')
                .attr('viewBox', [ -width / 2, -width / 2, width, width ])
                .style('height', '100%')
                .style('width', '100%');

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
                //.
                .join('circle')
                //.attr('r', (d) => d.degree*5)
                .attr('fill', color)
                .call(drag(simulation));
                //if dynamicNodes set then make size dynamic
                if(options.dynamicNodes){
                    node.attr('r', (d) => d.degree*5);
                }else{//otherwise keep default
                    node.attr('r', 5)
                }

                //returns email and degree on mouseover
                node.append('title').text(function(d) {
                    return `Email: `+d.id + `\nDegree: `+ d.degree + `\ninDegree: `+ d.inDegree + `\noutDegree: `+ d.outDegree ;
                });

            simulation.on('tick', () => {
                link
                    .attr('x1', (d) => d.source.x)
                    .attr('y1', (d) => d.source.y)
                    .attr('x2', (d) => d.target.x)
                    .attr('y2', (d) => d.target.y);

                node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
            });
        },
        [ globalOptions ]
    );

    return (
        // D3 viization should go here
        <div>
            <h1 style={{ margin: '10px 20px' }}>{visID}</h1>
            <div ref={myRef} style={{ position: 'absolute', top: 50, width: '100%', height: 'calc(100% - 50px)' }} />
        </div>
    );
}
