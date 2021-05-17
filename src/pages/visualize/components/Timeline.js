import React, { useContext, useState, useEffect } from 'react';
import { Slider, Row, Button, Space } from 'antd';
import { Tooltip } from 'antd';
import { StepBackwardOutlined, StepForwardOutlined, PauseOutlined, CaretRightOutlined, FastBackwardOutlined, FastForwardOutlined } from '@ant-design/icons';
import { GlobalContext } from './GlobalContext';
import moment from 'moment';
import './Timeline.css';
import { DataContext } from '../../../context/data';

const MAX_UPDATE_INTERVAL = 500;

export default function Timeline() {
    const contextID = 'Global';

    const [ getOptions, setOptions ] = useContext( GlobalContext );

    let [ dataset ] = React.useContext( DataContext );

    const { timeline, playing, timeframe, playbackSpeed } = getOptions( contextID );

    const maxDate = Math.floor( moment.duration( timeframe[1].diff( timeframe[0] ) ).asDays() );

    const marks = {
        0: timeframe[0].format( 'YYYY MMM DD' ),
        [maxDate]: timeframe[1].format( 'YYYY MMM DD' )
    };

    // Use a cooldown timer while the user is dragging the timeline such that we do not update too often.
    // It will update at most every 500ms (MAX_UPDATE_INTERVAL).
    const [ cooldown, setCooldown ] = useState( false );

    // Value that ignores cooldown that is used for correct display of the slider
    const [ value, setValue ] = useState( timeline );

    // State that contains the dataset dates in sorted order
    const [ sortedDates, setSortedDates ] = useState( [] );

    // The cooldown will activate when the timeline value is changed.
    useEffect( () => {
        return () => {
            setCooldown( true );
            let timeout = setTimeout( () => {
                setCooldown( false );
            }, MAX_UPDATE_INTERVAL );

            return () => clearTimeout( timeout );
        };
    }, [ timeline ] );


    // useEffect that will trigger going to the next day when we are playing
    useEffect( () => {

        if ( !playing || playbackSpeed == 0 )
            return;

        let interval = setTimeout( () => {
            let value = moment( timeline ).add( 1, 'days' );

            setValue( value );

            setOptions( contextID, { ...getOptions( contextID ), timeline: value } );
        }, 500 / playbackSpeed );

        return () => clearTimeout( interval );

    }, [ playing, timeline, playbackSpeed, getOptions ] );

    // useEffect that sorts the dataset on date to be used for the skip forward and skip back buttons
    useEffect( () => {
        if (!dataset)
            return;

        let sorted = dataset.sort( ( a, b ) => {
            return a.date - b.date;
        } );

        sorted = sorted.map( ( row ) => {
            return row.date;
        } );

        setSortedDates( sorted );
        
    }, [ dataset ] );


    return (
        <Row justify='center' style={{ padding: '20px 50px' }}>
            <Slider
                marks={marks}
                max={maxDate}
                value={moment( value ).diff( timeframe[0], 'days' )}
                tooltipVisible={cooldown || playing ? true : undefined}
                style={{ width: '100%' }}
                onChange={( event ) => {
                    let timeline = moment( timeframe[0] ).add( event, 'days' );

                    setValue( timeline );

                    // While dragging we check if the cooldown is active, in which case we do not update
                    // We do need to set the value manually for correct display of the slider
                    if ( cooldown )
                        return;

                    setOptions( contextID, {
                        ...getOptions( contextID ),
                        timeline: timeline,
                        playing: false
                    } );
                }}
                onAfterChange={( event ) => {
                    let timeline = moment( timeframe[0] ).add( event, 'days' );

                    setValue( timeline );

                    setOptions( contextID, {
                        ...getOptions( contextID ),
                        timeline: timeline,
                        playing: false
                    } );
                }}
                tipFormatter={( value ) => {
                    return moment( timeframe[0] ).add( value, 'days' ).format( 'YYYY MMM DD' );
                }}
            />
            <Space size='middle'>
                <Tooltip placement='topLeft' title='Skip to previous change'>

                    <Button
                        type='primary'
                        onClick={() => {
                            let value = moment( timeline );
                            
                            for( let i = sortedDates.length - 1; i >= 0; i-- ) {

                                if( !value.isAfter( sortedDates[ i ] ) ) {

                                    //Check that we are not at the first element yet
                                    if( i > 0 ) 
                                        continue;

                                    //If no elements match, we set the date to the start
                                    value = moment( timeframe[0] );
                                    
                                } else {
                                    value = moment( sortedDates[ i ] );

                                    break;
                                }
                                
                            }

                            setValue( value );

                            setOptions( contextID, { ...getOptions( contextID ), timeline: value } );
                        }}
                        icon={<FastBackwardOutlined style={{ fontSize: 18 }} />}
                    />

                </Tooltip>
                <Tooltip placement='topLeft' title='Skip backward'>

                    <Button
                        type='primary'
                        onClick={() => {
                            let value = moment( timeline ).subtract( 1, 'days' );

                            setValue( value );

                            setOptions( contextID, { ...getOptions( contextID ), timeline: value } );
                        }}
                        icon={<StepBackwardOutlined />}
                    />
                </Tooltip>

                <Tooltip title={playing ? 'Pause' :'Play'  }>
                    <Button type='primary' onClick={() => {
                        setOptions( contextID, { ...getOptions( contextID ), playing: !playing } );
                    }} icon={playing ? <PauseOutlined /> : <CaretRightOutlined />} />
                </Tooltip>

                <Tooltip placement='topRight' title='Skip forward'>
                    <Button
                        type='primary'
                        onClick={() => {
                            let value = moment( timeline ).add( 1, 'days' );

                            setValue( value );

                            setOptions( contextID, { ...getOptions( contextID ), timeline: value } );
                        }}
                        icon={<StepForwardOutlined />}
                    />
                </Tooltip>

                <Tooltip placement='topRight' title='Skip to next change'>
                    <Button
                        type='primary'
                        onClick={() => {
                            let value = moment( timeline );

                            for( let i = 0; i < sortedDates.length; i++ ) {

                                if( !value.isBefore( sortedDates[ i ] ) ) {

                                    //Check that we are not at the last element yet
                                    if( i < sortedDates.length - 1 ) 
                                        continue;

                                    //If no elements match, we set the date to the end
                                    value = moment( timeframe[1] );
                                    
                                } else {
                                    value = moment( sortedDates[ i ] );

                                    break;
                                }
                                
                            }

                            setValue( value );

                            setOptions( contextID, { ...getOptions( contextID ), timeline: value } );
                        }}
                        icon={<FastForwardOutlined style={{ fontSize: 18 }}/>}
                    />
                </Tooltip>
            </Space>
        </Row>
    );
}
