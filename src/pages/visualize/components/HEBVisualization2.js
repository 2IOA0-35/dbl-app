import React, { Component } from 'react';
import { message } from 'antd';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
import flare from './flare.json';
import enron from './enron.json';
import enronSample from './enronSample.json';

/**
 * This file exists because I wanted to try the alternative method of implementing a d3 graph
 * This method is based classes instead of functions and uses 'componentDidMount' instead of 'useEffect'
 * I personally prefer the way this method looks.
 * 
 * This file has a working hierarchy function, while 'HEBVisualization' does not at the time of writing
*/

class HEBVisualization2 extends Component {
    constructor(props) {
        super(props);
        this.createGraph = this.createGraph.bind(this);
    }
    componentDidMount() {
        // try-catch because I want the page to still display after an error
        try {
            this.createGraph();
        } catch (error) {
            message.error('The visualization failed to load. Check the console for errors.', 5);
            console.error('Error loading visualization:\n', error);
        }
    }
    // componentDidUpdate() {
    //     this.createGraph();
    // }

    createGraph() {
        // Switch between the three lines below to toggle between the example data and the enron sample.

        // const data = hierarchy(enronSample);
        // const data = hierarchy(enron);
        const data = hierarchyFlare(flare);

        /**
         * Designed to work with the enron dataset. 
         * Turns json into obj. each jobtitle is an element and has all corresponding fromEmails with toEmails as children
         * 
         * @param {json} data
         * @returns {obj} root
         */
        function hierarchy(data) {
            let root = { name: 'data', children: [] };
            const emailMap = new Map();
            const jobMap = new Map();
            data.forEach((data) => {
                const { fromJobtitle, fromEmail, toEmail, date } = data;
                if (!jobMap.has(fromJobtitle)) {
                    jobMap.set(fromJobtitle, { children: [] });
                }
                if (!emailMap.get(fromEmail)) {
                    emailMap.set(fromEmail, { children: [], fromJobtitle: fromJobtitle });
                }
                emailMap.get(fromEmail).children.push({ toEmail: toEmail, date: date });
            });
            // console.log('emailmap', map, 'jobmap', jobMap);
            emailMap.forEach((entry, key) => {
                jobMap.get(entry.fromJobtitle).children.push({ name: key, children: entry.children });
            });
            jobMap.forEach((entry, key) => {
                root.children.push({ name: key, children: entry.children });
            });
            return root;
        }

        // hierarchy function from the flare.json example
        function hierarchyFlare(data, delimiter = '.') {
            let root;
            const map = new Map();
            data.forEach(function find(data) {
                const { name } = data;
                if (map.has(name)) return map.get(name);
                const i = name.lastIndexOf(delimiter);
                map.set(name, data);
                if (i >= 0) {
                    find({ name: name.substring(0, i), children: [] }).children.push(data);
                    data.name = name.substring(i + 1);
                } else {
                    root = data;
                }
                return data;
            });
            return root;
        }

        // The hierarchy function works as intended:
        console.log(data);

        // TODO: fix this mess. flare used "imports".
        // I have made each email a seperate array with date, instead of putting all toEmails in a single array
        // This is because I wanted to include the time.
        // the point is, is that the format is slightly different and this function will need to be altered.
        function bilink(root) {
            const map = new Map(root.leaves().map((d) => [ id(d), d ]));
            for (const d of root.leaves())
                (d.incoming = []), (d.outgoing = d.data.imports.map((i) => [ d, map.get(i) ]));
            for (const d of root.leaves()) {
                for (const o of d.outgoing) {
                    o[1].incoming.push(o);
                }
            }
            return root;
        }

        // TODO: make work with enron dataset
        function id(node) {
            return `${node.parent ? id(node.parent) + '.' : ''}${node.data.name}`;
        }

        const colorin = '#00f';
        const colorout = '#f00';
        const colornone = '#ccc';
        const width = 850;
        const radius = width / 2;
        const line = d3.lineRadial().curve(d3.curveBundle.beta(0.85)).radius((d) => d.y).angle((d) => d.x);
        const tree = d3.cluster().size([ 2 * Math.PI, radius - 100 ]);

        // TODO: check if use of 'name' here causes a conflict
        const root = tree(
            bilink(
                d3
                    .hierarchy(data)
                    .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))
            )
        );

        // Create an svg and add it to the component. should scale itself to available space.
        const svg = d3
            .select(this.node)
            .append('svg')
            .attr('viewBox', [ -width / 2, -width / 2, width, width ])
            .style('max-height', '100%')
            .style('max-width', '100%');

        // TODO: check if use of 'name' here causes a conflict
        svg
            .append('g')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .selectAll('g')
            .data(root.leaves())
            .join('g')
            .attr('transform', (d) => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
            .append('text')
            .attr('dy', '0.31em')
            .attr('x', (d) => (d.x < Math.PI ? 6 : -6))
            .attr('text-anchor', (d) => (d.x < Math.PI ? 'start' : 'end'))
            .attr('transform', (d) => (d.x >= Math.PI ? 'rotate(180)' : null))
            .text((d) => d.data.name)
            .each(function(d) {
                d.text = this;
            })
            .on('mouseover', overed)
            .on('mouseout', outed)
            .call((text) =>
                text.append('title').text(
                    (d) => `${id(d)}
                        ${d.outgoing.length} outgoing
                        ${d.incoming.length} incoming`
                )
            );

        const link = svg
            .append('g')
            .attr('stroke', colornone)
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .selectAll('path')
            .data(root.leaves().flatMap((leaf) => leaf.outgoing))
            .join('path')
            .style('mix-blend-mode', 'multiply')
            .attr('d', ([ i, o ]) => line(i.path(o)))
            .each(function(d) {
                d.path = this;
            });

        function overed(event, d) {
            link.style('mix-blend-mode', null);
            d3.select(this).attr('font-weight', 'bold');
            d3.selectAll(d.incoming.map((d) => d.path)).attr('stroke', colorin).raise();
            d3.selectAll(d.incoming.map(([ d ]) => d.text)).attr('fill', colorin).attr('font-weight', 'bold');
            d3.selectAll(d.outgoing.map((d) => d.path)).attr('stroke', colorout).raise();
            d3.selectAll(d.outgoing.map(([ , d ]) => d.text)).attr('fill', colorout).attr('font-weight', 'bold');
        }

        function outed(event, d) {
            link.style('mix-blend-mode', 'multiply');
            d3.select(this).attr('font-weight', null);
            d3.selectAll(d.incoming.map((d) => d.path)).attr('stroke', null);
            d3.selectAll(d.incoming.map(([ d ]) => d.text)).attr('fill', null).attr('font-weight', null);
            d3.selectAll(d.outgoing.map((d) => d.path)).attr('stroke', null);
            d3.selectAll(d.outgoing.map(([ , d ]) => d.text)).attr('fill', null).attr('font-weight', null);
        }
    }
    render() {
        return (
            <svg
                ref={(node) => (this.node = node)}
                width={500}
                height={500}
                style={{ position: 'absolute', top: 50, width: '100%', height: 'calc(100% - 50px)' }}
            />
        );
    }
}
export default HEBVisualization2;
