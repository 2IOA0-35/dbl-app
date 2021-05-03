import React, { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
import test from './graph.json';

export default function DFDVisualization(
    container,
    linksData,
    nodesData,
) {
   // const [ getOptions ] = useContext(GlobalContext);

    const visID = 'Disjoint Force-Directed';

    
    //const { edgeSize, nodeSize, dynamicEdges, dynamicNodes, colorBy } = getOptions(visID);


    //  const [ state ] = useState({
    //      data: null
    //  });
    

    // const myRef = useRef();
    // const height = 680
    // const width = 680
    

    // useEffect(
    //     () => {
    //         const data = test;
    //         const links = data.links.map(d => Object.create(d));
    //         const nodes = data.nodes.map(d => Object.create(d));
    //         //d3 = require("d3@6")

    //         const color = () => { return "#9D79A0"; };

    //         const simulation = d3.forceSimulation(nodes)
    //             .force("link", d3.forceLink(links).id(d => d.id))
    //             .force("charge", d3.forceManyBody())
    //             .force("x", d3.forceX())
    //             .force("y", d3.forceY());

    //             function drag(simulation){
    //                 function dragstarted(event, d) {
    //                     if (!event.active) simulation.alphaTarget(0.3).restart();
    //                     d.fx = d.x;
    //                     d.fy = d.y;
    //                   }
                      
    //                   function dragged(event,d) {
    //                     d.fx = event.x;
    //                     d.fy = event.y;
    //                   }
                      
    //                   function dragended(event,d) {
    //                     if (!event.active) simulation.alphaTarget(0);
    //                     d.fx = null;
    //                     d.fy = null;
    //                   }
                      
    //                   return d3.drag()
    //                       .on("start", dragstarted)
    //                       .on("drag", dragged)
    //                       .on("end", dragended);
    //             }                    

    //         const svg = d3.create("svg")
    //             .select(myRef.current)
    //             .attr("viewBox", [-width / 2, -height / 2, width, height]);

    //         const link = svg.append("g")
    //             .attr("stroke", "#999")
    //             .attr("stroke-opacity", 0.6)
    //             .selectAll("line")
    //             .data(links)
    //             .join("line")
    //             .attr("stroke-width", d => Math.sqrt(d.value));

    //         const node = svg.append("g")
    //             .attr("stroke", "#fff")
    //             .attr("stroke-width", 1.5)
    //             .selectAll("circle")
    //             .data(nodes)
    //             .join("circle")
    //             .attr("r", 5)
    //             .attr("fill", color)
    //             .call(drag(simulation));

    //         node.append("title")
    //             .text(d => d.id);

    //         simulation.on("tick", () => {
    //             link
    //                 .attr("x1", d => d.source.x)
    //                 .attr("y1", d => d.source.y)
    //                 .attr("x2", d => d.target.x)
    //                 .attr("y2", d => d.target.y);

    //             node
    //                 .attr("cx", d => d.x)
    //                 .attr("cy", d => d.y);
    //         });

    //         //invalidation.then(() => simulation.stop());
    //     },
    //     [state.data]
    // );


    //force graph simple just to see if it would work (it didn't)
//     const links = linksData.map((d) => Object.assign({}, d));
//     const nodes = nodesData.map((d) => Object.assign({}, d));
  
//     const containerRect = container.getBoundingClientRect();
//     const height = containerRect.height;
//     const width = containerRect.width;
  
//     const color = () => { return "#9D79A0"; };
  
//     const drag = (simulation) => {
//       const dragstarted = (d) => {
//         if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//         d.fx = d.x;
//         d.fy = d.y;
//       };
  
//       const dragged = (d) => {
//         d.fx = d3.event.x;
//         d.fy = d3.event.y;
//       };
  
//       const dragended = (d) => {
//         if (!d3.event.active) simulation.alphaTarget(0);
//         d.fx = null;
//         d.fy = null;
//       };
  
//       return d3
//         .drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended);
//     };
//     const simulation = d3
//     .forceSimulation(nodes)
//     .force("link", d3.forceLink(links).id(d => d.id))
//     .force("charge", d3.forceManyBody().strength(-150))
//     .force("x", d3.forceX())
//     .force("y", d3.forceY());

//   const svg = d3
//     .select(container)
//     .append("svg")
//     .attr("viewBox", [-width / 2, -height / 2, width, height])
//     .call(d3.zoom().on("zoom", function () {
//       svg.attr("transform", d3.event.transform);
//     }));

//   const link = svg
//     .append("g")
//     .attr("stroke", "#999")
//     .attr("stroke-opacity", 0.6)
//     .selectAll("line")
//     .data(links)
//     .join("line")
//     .attr("stroke-width", d => Math.sqrt(d.value));

//   const node = svg
//     .append("g")
//     .attr("stroke", "#fff")
//     .attr("stroke-width", 2)
//     .selectAll("circle")
//     .data(nodes)
//     .join("circle")
//     .attr("r", 12)
//     .attr("fill", color)
//     .call(drag(simulation));

//     const label = svg.append("g")
//     .attr("class", "labels")
//     .selectAll("text")
//     .data(nodes)
//     .enter()
//     .append("text")
//     .attr('text-anchor', 'middle')
//     .attr('dominant-baseline', 'central')
//     .attr("class", d => `fa ${getClass(d)}`)
//     .text(d => {return icon(d);})
//     .call(drag(simulation));

//     simulation.on("tick", () => {
//         //update link positions
//         link
//           .attr("x1", d => d.source.x)
//           .attr("y1", d => d.source.y)
//           .attr("x2", d => d.target.x)
//           .attr("y2", d => d.target.y);
    
//         // update node positions
//         node
//           .attr("cx", d => d.x)
//           .attr("cy", d => d.y);
    
//         // update label positions
//         label
//           .attr("x", d => { return d.x; })
//           .attr("y", d => { return d.y; })
//     });


    return (
        // D3 visualization should go here
        <div>
            <h1 style={{ margin: '10px 20px' }}>{visID}</h1>
            {/*<p>Temporary to show that passing data works:</p>
            <p>{edgeSize + ' - ' + nodeSize + ' - ' + dynamicEdges + ' - ' + dynamicNodes + ' - ' + colorBy}</p>*/}
            {/* <div>
                <DFDVisualization linksData={test.links} nodesData={test.nodes}/>
            </div> */}
        </div>
    );
}
