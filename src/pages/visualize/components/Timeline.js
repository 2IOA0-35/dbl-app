import React, { useContext, useState, useEffect, useRef } from 'react';
import { Slider, Row, Button, Space, Dropdown, Typography, Menu } from 'antd';
import { Tooltip } from 'antd';
import { StepBackwardOutlined, StepForwardOutlined, PauseOutlined, CaretRightOutlined, FastBackwardOutlined, FastForwardOutlined, LockFilled, UnlockOutlined, DownOutlined } from '@ant-design/icons';
import { GlobalContext } from './GlobalContext';
import moment from 'moment';
import './Timeline.css';
import { DataContext } from '../../../context/data';

const MAX_UPDATE_INTERVAL = 500;

export default function Timeline() {
    const contextID = 'Global';

    const [ getOptions, setOptions ] = useContext( GlobalContext );

    let [ dataset ] = React.useContext( DataContext );

    const { timeline, playing, timeframe, playbackSpeed, previousDays } = getOptions( contextID );

    const maxDate = Math.floor( moment.duration( timeframe[1].diff( timeframe[0] ) ).asDays() );

    const marks = {
        0: timeframe[0].format( 'YYYY MMM DD' ),
        [maxDate]: timeframe[1].format( 'YYYY MMM DD' )
    };

    // Use a cooldown timer while the user is dragging the timeline such that we do not update too often.
    // It will update at most every 500ms (MAX_UPDATE_INTERVAL).
    const [ cooldown, setCooldown ] = useState( false );

    // Value that ignores cooldown that is used for correct display of the slider
    const [ value, setValue ] = useState( timeline.add(10) );
    const [ diff , setDiff  ] = useState( previousDays );

    //Animation lock controls
    const [ startLock, setStartLock ] = useState( true );
    const [   endLock, setEndLock   ] = useState( false );

    // State that contains the dataset dates in sorted order
    const [ sortedDates, setSortedDates ] = useState( [] );

    const timelineRef = useRef();

    // Sets default values for the slider
    useEffect( () => {
        setDiff(31);
        setValue(value.add(31, 'days'));
    }, []);

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


    //Shift the date ranges with the specified offset
    let shift = ( offset ) => {
        let value = moment( timeline );

        if( !endLock )
            value.add( offset, 'days' );

        let difference = diff;

        //Limit the value to the timeframe
        if( value.isAfter( timeframe[ 1 ] ) ) {
            value.subtract( 1, 'days' );
            difference--;
        }

        if( startLock && !endLock )
            difference = difference + offset;
        else if( !startLock && endLock )
            difference = difference - 1 * offset;

        //Limit the difference to the timeframe
        if( moment( value ).subtract( difference, 'days' ).isBefore( timeframe[ 0 ] ) )
            difference--;
        if( difference < 0 )
            difference = 0;

        setValue( value );
        setDiff ( difference );

        setOptions( contextID, { ...getOptions( contextID ), timeline: value, previousDays: difference } );
    };

    // useEffect that will trigger going to the next day when we are playing
    useEffect( () => {

        if ( !playing || playbackSpeed == 0 )
            return;

        let interval = setTimeout( () => {

            shift( Math.sign( playbackSpeed ) );

        }, 500 / Math.abs( playbackSpeed ) );

        return () => clearTimeout( interval );

    }, [ playing, timeline, playbackSpeed, getOptions, startLock, endLock ] );

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

    //Bodgy code to fix the rc-slider node_module to allow for correct dragging behaviour
    //This can be removed when a new version of rc-slider comes out that fixes the issue.
    //Pull request for reference: https://github.com/react-component/slider/pull/760
    useEffect( () => {

        if( !timelineRef || !timelineRef.current )
            return;

        //Overwrite the onMove method inside the timelineRef
        timelineRef.current.onMove = ( function( e, position, dragTrack, startBounds ) {
            e.stopPropagation();
            e.preventDefault();
            const { state, props } = this;
            const maxValue = props.max || 100; // eslint-disable-line
            const minValue = props.min || 0; // eslint-disable-line
            if (dragTrack) {
                let pos = props.vertical ? -position : position; // eslint-disable-line
                pos = props.reverse ? -pos : pos;                // eslint-disable-line
                const max = maxValue - Math.max(...startBounds);
                const min = minValue - Math.min(...startBounds);
                const ratio = Math.min(Math.max(pos / (this.getSliderLength() / (maxValue - minValue)), min), max);
                const nextBounds = startBounds.map((v) =>
                    Math.floor(Math.max(Math.min(v + ratio, maxValue), minValue))
                );
                if (state.bounds.map((c, i) => c === nextBounds[i]).some((c) => !c)) {
                    this.onChange({
                        bounds: nextBounds
                    });
                }
                return;
            }
            const value = this.calcValueByPos(position);
            const oldValue = state.bounds[state.handle];
            if (value === oldValue) return;

            this.moveTo(value);
        } ).bind( timelineRef.current );

    }, [ timelineRef ] );

    const lockControls = 
        <Space className='lock'>
            <Tooltip title={'Lock or unlock the timeline start position when playing.'}>
                <Button type='link' icon={startLock ? <LockFilled/> : <UnlockOutlined/>} onClick={() => setStartLock( !startLock )}>
                    Start
                </Button>
            </Tooltip>
            <Tooltip title={'Lock or unlock the timeline end position when playing.'}>
                <Button type='link' icon={endLock ? <LockFilled/> : <UnlockOutlined/>} onClick={() => setEndLock( !endLock )}>
                    End
                </Button>
            </Tooltip>
        </Space>;

    const speedControls =
        <Space className='speed'>
            <Dropdown trigger='click' placement='topRight' style={{ paddingRight: 20 }} overlay={
                <Menu>
                    <Menu.Item style={{ textAlign: 'center' }}>Playback Speed</Menu.Item>
                    <Slider
                        style={{ width: 200, margin: '15px 15px 30px 15px' }}
                        min={-4}
                        max={4}
                        step={0.1}
                        marks={{
                            [-4]: '-4',
                            0: '0',
                            4: '4'
                        }}
                        defaultValue={playbackSpeed}
                        onAfterChange={( event ) => {
                            setOptions( contextID, { ...getOptions( contextID ), playbackSpeed: event } );
                        }}
                    />
                </Menu>
            }>
                <Typography.Link>{playbackSpeed}x <DownOutlined/></Typography.Link>
            </Dropdown>
        </Space>;
    return (
        <>
            <Row style={{ padding: '20px 50px 0 50px' }}>
                <Slider
                    ref={timelineRef}
                    marks={marks}
                    max={maxDate}
                    range={{ draggableTrack: true }}
                    value={[ moment( value ).diff( timeframe[0], 'days' ) - diff, moment( value ).diff( timeframe[0], 'days' ) ]}
                    tooltipVisible={cooldown || playing ? true : undefined}
                    style={{ width: '100%' }}
                    onChange={( event ) => {
                        let timeline = moment( timeframe[0] ).add( event[1], 'days' );

                        setDiff ( event[ 1 ] - event[ 0 ] );
                        setValue( timeline );

                        // While dragging we check if the cooldown is active, in which case we do not update
                        // We do need to set the value manually for correct display of the slider
                        if ( cooldown )
                            return;

                        setOptions( contextID, {
                            ...getOptions( contextID ),
                            previousDays: event[ 1 ] - event[ 0 ],
                            timeline: timeline,
                            playing: false
                        } );
                    }}
                    onAfterChange={( event ) => {
                        let timeline = moment( timeframe[0] ).add( event[1], 'days' );

                        setDiff ( event[ 1 ] - event[ 0 ] );
                        setValue( timeline );

                        setOptions( contextID, {
                            ...getOptions( contextID ),
                            previousDays: event[ 1 ] - event[ 0 ],
                            timeline: timeline,
                            playing: false
                        } );
                    }}
                    tipFormatter={( value ) => {
                        return moment( timeframe[0] ).add( value, 'days' ).format( 'YYYY MMM DD' );
                    }}
                />
            </Row>
            <Row className='timelineControls' justify='center'>
                {lockControls}
                <Space className='controls'>
                    <Tooltip placement='topLeft' title='Skip to previous change'>

                        <Button
                            type='primary'
                            onClick={() => {
                                let value = moment( timeline );

                                let start = moment( timeline ).subtract( previousDays, 'days' );
                                
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

                                let diff = previousDays;
                                
                                if( startLock )
                                    diff = value.diff( start, 'days' );

                                setValue( value );
                                setDiff ( diff  );

                                setOptions( contextID, { ...getOptions( contextID ), timeline: value, previousDays: diff } );
                            }}
                            icon={<FastBackwardOutlined style={{ fontSize: 18 }} />}
                        />

                    </Tooltip>
                    <Tooltip placement='topLeft' title='Skip backward'>

                        <Button
                            type='primary'
                            onClick={() => shift( -1 )}
                            icon={<StepBackwardOutlined />}
                        />
                    </Tooltip>

                    <Tooltip title={playing ? 'Pause' : 'Play'  }>
                        <Button type='primary' onClick={() => {
                            setOptions( contextID, { ...getOptions( contextID ), playing: !playing } );
                        }} icon={playing ? <PauseOutlined /> : <CaretRightOutlined />} />
                    </Tooltip>

                    <Tooltip placement='topRight' title='Skip forward'>
                        <Button
                            type='primary'
                            onClick={() => shift( 1 )}
                            icon={<StepForwardOutlined />}
                        />
                    </Tooltip>

                    <Tooltip placement='topRight' title='Skip to next change'>
                        <Button
                            type='primary'
                            onClick={() => {
                                let value = moment( timeline );
                                let start = moment( timeline ).subtract( previousDays, 'days' );

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

                                let diff = previousDays;
                                
                                if( startLock )
                                    diff = value.diff( start, 'days' );

                                setValue( value );
                                setDiff ( diff  );

                                setOptions( contextID, { ...getOptions( contextID ), timeline: value, previousDays: diff } );
                            }}
                            icon={<FastForwardOutlined style={{ fontSize: 18 }}/>}
                        />
                    </Tooltip>
                </Space>
                {speedControls}
            </Row>
            <Row className='timelineSecondary' justify='space-between'>
                {lockControls}
                {speedControls}
            </Row>
        </>
    );
}
