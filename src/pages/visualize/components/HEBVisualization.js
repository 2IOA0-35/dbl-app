import React, { useContext, useRef, useEffect, useState } from 'react';
import { GlobalContext } from './GlobalContext';
import * as d3 from 'd3';
import flare from './flare.json';
import enron from './enron.json';
import './HEBVisualization.css';
import moment from 'moment';
import { DataContext } from '../../../context/data';
import { message } from 'antd';
import ColumnGroup from 'antd/lib/table/ColumnGroup';

const VIS_ID     = 'Hierarchical Edge Bundling';
const CONTEXT_ID = 'Global';

/**
 * Threshold of the maximum amount of e-mails allowed before fastRender is enabled.
 */
const FAST_RENDER_THRESHOLD = 15000;

export default function HEBVisualization() {

    //const { edgeSize, nodeSize, dynamicEdges, dynamicNodes, groupBy, colorBy } = getOptions(visID);

    const [ getOptions ] = useContext( GlobalContext );


    const globalOptions = getOptions( CONTEXT_ID );

    let [ visualisation, setVisualisation ] = useState( {
        /**
         * @type {( root ) => void}
         */
        update: null,
    } );

    
    let [ dataset ] = React.useContext( DataContext );

    let [ formattedData, setFormattedData ] = useState(
        /**
         * Formatted data in hierarchical form to be used by the HEB
         * @type {d3.HierarchyNode<{
         *   name: string;
         *   children: any[];
         * }>}
         */
        null
    );

    const options = getOptions( VIS_ID );

    const visBox = useRef();

    useEffect(() => {

        const width = 850;
        const radius = width / 2;
        const tree = d3.cluster().size([ 2 * Math.PI, radius - 100 ]);

        const root = d3.hierarchy( { name: '', children: [] } );

        root.incoming = [];
        root.outgoing = [];

        // Create an svg and add it to the component. should scale itself to available space.
        const svg = d3
            .select(visBox.current)
            .append('svg')
            .attr('viewBox', [ -width / 2, -width / 2, width, width ])
            .style('height', '100%')
            .style('width', '100%');

        const node = svg
            .append('g')
            .classed('node', true);
        
        const link = svg
            .append('g')
            .classed('link', true);

        let jobColors = d3.scaleOrdinal( d3.schemeCategory10 );

        let update = ( root, options ) => {

            root = tree( root );

            let line = d3.lineRadial().curve(d3.curveBundle.beta(options.bundlingFactor)).radius((d) => d.y).angle((d) => d.x);

            node.selectAll( 'g' ).selectAll( 'text' ).remove();

            node.selectAll('g')
                .data(root.leaves())
                .join( 'g' )
                .attr('transform', (d) => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)` )
                .append('text')
                .attr('dy', '0.31em')
                .attr('x', (d) => (d.x < Math.PI ? 6 : -6))
                .attr('text-anchor', (d) => (d.x < Math.PI ? 'start' : 'end'))
                .attr('transform', (d) => (d.x >= Math.PI ? 'rotate(180)' : null))
                .text((d) => {
                    if ( options.convertEmail )
                        return d.data.name.replace('.', ' ').substr(
                            0, d.data.name.indexOf('@'));
                    return d.data.name;
                })
                .attr( 'fill', (d) => {
                    switch (options.colorNodeBy) {
                        case 'Sentiment':
                            break;
                        case "Sender's Jobtitle":
                            return jobColors(d.data.jobtitle);
                        default:
                            return 'black';
                    }
                })
                .each(function(d) {
                    d.text = this;
                })
                .on('mouseover', overed)
                .on('mouseout', outed)
                .call((text) =>
                    text.append('title').text(
                        (d) => `${d.data.name} (${d.data.jobtitle})
${d.outgoing?.length} outgoing
${d.incoming?.length} incoming`
                    )
                );
                        
            let links = root.leaves().flatMap((leaf) => leaf.outgoing);
            let enableFastRender = links.length > FAST_RENDER_THRESHOLD;

            if( !enableFastRender && svg.classed( 'fastRender' ) ) {
                message.info( 'Fast rendering mode disabled.', 5 );
            } else if( enableFastRender && !svg.classed( 'fastRender' ) ) {
                message.info( 'Fast rendering mode enabled.', 5 );
            }

            //console.log( links.length, enableFastRender );
            svg.classed( 'fastRender', enableFastRender )
                .classed( 'capitalize', options.convertEmail );

            link.selectAll('path')
                .data(links)
                .join('path')
                .attr('stroke-width', options.edgeThickness + 'px')
                //.style('mix-blend-mode', 'multiply')
                .attr('d', ([ i, o ]) => line(i.path(o)) )
                .attr('stroke', (d) => {
                    switch (options.colorEdgeBy) {
                        case 'Sentiment':
                            var sentiment = 0;
                            var devider = 0
                            d[0].data.children.mails.forEach( (mail) => {
                                if ( d[1].data.name == mail.toEmail ) {
                                    // console.log(mail.sentiment)
                                    sentiment += mail.sentiment;
                                    devider++;
                                }
                            });
                            // console.log('avg sentiment', (sentiment / devider + 1) / 2);
                            return d3.interpolateCool((sentiment / devider + 1) / 2);
                        case "Sender's Jobtitle":
                            return jobColors(d[0].data.jobtitle);
                        case "Receiver's Jobtitle":
                            return jobColors(d[1].data.jobtitle);
                        default:
                            return '#444';
                    }
                })
                .each(function(d) {
                    d.path = this;
                });
        };

        update( root, options );

        function overed(event, d) {
            // link.style('mix-blend-mode', null);
            d3.select(this).attr('font-weight', 'bold');
            d3.selectAll(d.incoming.map((d) => d.path)).classed('link-target', true).raise();
            d3.selectAll(d.incoming.map(([ d ]) => d.text)).classed('node-source', true);
            d3.selectAll(d.outgoing.map((d) => d.path)).classed('link-source', true).raise();
            d3.selectAll(d.outgoing.map(([ , d ]) => d.text)).classed('node-target', true);
        }

        function outed(event, d) {
            // link.style('mix-blend-mode', 'multiply');
            d3.select(this).attr('font-weight', null);
            d3.selectAll(d.incoming.map((d) => d.path)).classed('link-target', false).raise();
            d3.selectAll(d.incoming.map(([ d ]) => d.text)).classed('node-source', false);
            d3.selectAll(d.outgoing.map((d) => d.path)).classed('link-source', false).raise();
            d3.selectAll(d.outgoing.map(([ , d ]) => d.text)).classed('node-target', false);
        }

        setVisualisation( { update: update } );
        
        //When the component unmounts, we will remove the SVG and resize listener
        return () => {
            d3.select( visBox.current ).selectAll( '*' ).remove();
        };
    }, [] );

    useEffect( () => {

        if( !dataset )
            return;

        //Will be populated with the dataset converted to hierarchical structure
        let root = { name: 'data', children: [] };

        const emailMap = new Map();
        const jobMap   = new Map();

        const startDate = new Date( moment( globalOptions.timeline ).subtract( globalOptions.previousDays, 'days' ) );
        const endDate   = new Date( globalOptions.timeline );

        dataset.forEach( ( data ) => {

            let { fromJobtitle, fromEmail, toEmail, toJobtitle, date, sentiment } = data;

            if ( !jobMap.has( fromJobtitle ) )
                jobMap.set( fromJobtitle, { children: [] } );

            if ( !jobMap.has( toJobtitle ) )
                jobMap.set( toJobtitle, { children: [] } );

            if ( !emailMap.get( fromEmail ) )
                emailMap.set( fromEmail, { children: [], jobtitle: fromJobtitle } );

            if ( !emailMap.get( toEmail ) )
                emailMap.set( toEmail, { children: [], jobtitle: toJobtitle } );

            if( date < startDate || date > endDate )
                return;

            emailMap.get( fromEmail ).children.push( { toEmail: toEmail, date: date, sentiment: sentiment } );

        } );
        
        emailMap.forEach( ( entry, key ) => {
            jobMap.get( entry.jobtitle ).children.push( { name: key, jobtitle: entry.jobtitle, children: { mails: entry.children } } );
        } );

        jobMap.forEach( ( entry, key ) => {
            root.children.push( { name: key, children: entry.children } );
        } );

        // TODO: fix this mess. flare used "imports".
        // I have made each email a seperate array with date, instead of putting all toEmails in a single array
        // This is because I wanted to include the time.
        // the point is, is that the format is slightly different and this function will need to be altered.
        function bilink( root ) {
            const map = new Map( root.leaves().map( ( d ) => [d.data.name, d] ) );

            for ( const d of root.leaves() ) {
                d.incoming = [];
                d.outgoing = d.data?.children?.mails?.map( ( i ) => [d, map.get( i.toEmail )] );

                if( !d.outgoing )
                    d.outgoing = [];
            }

            for ( const d of root.leaves() ) {
                for ( const o of d.outgoing ) {
                    o[1].incoming.push( o );
                }
            }

            return root;
        }

        let data = bilink(
            d3
                .hierarchy( root )
                .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))
        );

        setFormattedData( data );

    }, [ dataset, globalOptions, options ] );

    useEffect( () => {

        //Can't do anything without data or update function
        if( !formattedData || !visualisation )
            return;

        visualisation.update( formattedData, options );

    }, [ formattedData, visualisation ] );

    return (
        <div>
            <h1 style={{ margin: '10px 20px' }}>{VIS_ID}</h1>
            <div ref={visBox} style={{ position: 'absolute', top: 50, width: '100%', height: 'calc(100% - 50px)' }} />
        </div>
    );
}
