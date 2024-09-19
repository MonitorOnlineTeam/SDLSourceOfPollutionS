import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import { createAction } from '../../../../utils';

@connect(({ taskModel }) => ({
    time: taskModel.time,
    clockinTimerStart: taskModel.clockinTimerStart
}))
export default class AutoTimerText extends PureComponent {
    static defaultProps = {
        textStyle: {
            color: '#ffffff',
            fontSize: 14
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            time: '',
            timer: null
        };
    }
    componentDidMount() {
        this.state.timer = setInterval(() => {
            this.setState({ time: moment().format('HH:mm:ss') });
        }, 1000);
    }
    componentWillUnmount() {
        if (this.state.timer != null) {
            clearInterval(this.state.timer);
        }
    }

    render() {
        return <Text style={[this.props.textStyle]}>{this.state.time}</Text>;
    }
}
