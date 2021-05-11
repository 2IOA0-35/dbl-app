import React, { useContext, useState, useEffect } from 'react';
import { Slider, Row, Button, Space } from 'antd';
import { StepBackwardOutlined, StepForwardOutlined, PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { GlobalContext } from './GlobalContext';
import moment from 'moment';
import './Timeline.css';

const MAX_UPDATE_INTERVAL = 500;

export default function Timeline() {
    const contextID = 'Global';

    const [ getOptions, setOptions ] = useContext(GlobalContext);

    const { timeline, playing, timeframe } = getOptions(contextID);

    const maxDate = Math.floor(moment.duration(timeframe[1].diff(timeframe[0])).asDays());

    const marks = {
        0: timeframe[0].format('YYYY MMM DD'),
        [maxDate]: timeframe[1].format('YYYY MMM DD')
    };

    //Use a cooldown timer while the user is dragging the timeline such that we do not update too often.
    //It will update at most every 500ms (MAX_UPDATE_INTERVAL).
    const [ cooldown, setCooldown ] = useState( false );

    //Value that ignores cooldown that is used for correct display of the slider
    const [ value, setValue ] = useState( timeline );

    //The cooldown will activate when the timeline value is changed.
    useEffect(() => {
        return () => {
            setCooldown( true );
            let timeout = setTimeout( () => {
                setCooldown( false );
            }, MAX_UPDATE_INTERVAL );

            return () => clearTimeout( timeout );
        };
    }, [ timeline ] );

    return (
        <Row justify='center' style={{ padding: '20px 50px' }}>
            <Slider
                marks={marks}
                max={maxDate}
                value={moment(value).diff( timeframe[0], 'days' )}
                tooltipVisible={cooldown ? true : undefined}
                style={{ width: '100%' }}
                onChange={( event ) => {
                    let timeline = moment(timeframe[0]).add(event, 'days');

                    setValue( timeline );

                    //While dragging we check if the cooldown is active, in which case we do not update
                    //We do need to set the value manually for correct display of the slider
                    if( cooldown )
                        return;

                    setOptions(contextID, {
                        ...getOptions(contextID),
                        timeline: timeline,
                        playing: false
                    });
                }}
                onAfterChange={( event ) => {
                    let timeline = moment(timeframe[0]).add(event, 'days');

                    setValue( timeline );

                    setOptions(contextID, {
                        ...getOptions(contextID),
                        timeline: timeline,
                        playing: false
                    });
                }}
                tipFormatter={(value) => {
                    return moment(timeframe[0]).add(value, 'days').format('YYYY MMM DD');
                }}
            />
            <Space size='middle'>
                <Button
                    type='primary'
                    onClick={() => {
                        let value = moment( timeline ).subtract(1, 'days');
    
                        setValue( value );

                        setOptions(contextID, { ...getOptions(contextID), timeline: value });
                    }}
                    icon={<StepBackwardOutlined />}
                />
                <Button type='primary' onClick={() => {}} icon={playing ? <PauseOutlined /> : <CaretRightOutlined />} />

                <Button
                    type='primary'
                    onClick={() => {
                        let value = moment( timeline ).add(1, 'days');
    
                        setValue( value );

                        setOptions(contextID, { ...getOptions(contextID), timeline: value });
                    }}
                    icon={<StepForwardOutlined />}
                />
            </Space>
        </Row>
    );
}
