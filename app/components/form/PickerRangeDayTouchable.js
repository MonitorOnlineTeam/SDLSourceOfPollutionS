import React, { PureComponent } from 'react';

import { TouchableOpacity } from 'react-native';
import { Touchable } from '..';
import PickerView from '../SDLPicker/PickerView';
import moment from 'moment';

export default class PickerSingleTimeTouchable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            start: moment(this.props.option.start),
            end: moment(this.props.option.end)
        };
    }

    setTimeRange = (start, end) => {
        this.setState({
            start: moment(start),
            end: moment(end)
        });
    };

    render() {
        const { onSureClickListener } = this.props.option;
        const { style, children } = this.props;
        return (
            <Touchable
                style={style}
                onPress={() => {
                    this._pickerView.showPicker();
                }}
            >
                {children}
                <PickerView
                    pickerType={'DayRange'}
                    format={'YYYY-MM-DD 00:00:00'}
                    defaultValue={this.state.start}
                    selectedStartDate={this.state.start}
                    selectedEndDate={this.state.end}
                    ref={ref => (this._pickerView = ref)}
                    callback={times => {
                        this.setState({
                            start: times[0],
                            end: times[1]
                        });
                        let oldData = onSureClickListener(times[0].format('YYYY-MM-DD 00:00:00'), times[1].format('YYYY-MM-DD 23:59:59'));
                        if (typeof oldData != 'undefined') {
                            this.setState(oldData);
                        }
                    }}
                />
            </Touchable>
        );
    }
}
