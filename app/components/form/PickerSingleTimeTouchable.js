/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-05-13 11:51:43
 * @LastEditTime: 2024-09-20 10:30:51
 * @FilePath: /SDLMainProject/app/components/form/PickerSingleTimeTouchable.js
 */
/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2021-05-07 11:25:10
 * @LastEditTime: 2024-04-17 10:17:53
 * @FilePath: /SDLMainProject37/app/components/form/PickerSingleTimeTouchable.js
 */
import React, { PureComponent } from 'react';

import { TouchableOpacity, View } from 'react-native';
import { Touchable } from '..';
import PickerView from '../SDLPicker/PickerView';
import moment from 'moment';

export default class PickerSingleTimeTouchable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            time: moment(this.props.option.defaultTime)
        };
    }

    setTime = defaultTime => {
        this.setState({
            time: moment(defaultTime)
        });
    };

    static defaultProps = {
        available: true
    };

    render() {
        const { type, onSureClickListener, beforeCheck = () => {
            return true;
        }, pickerType = 'SingleTimeWheel' } = this.props.option;
        const { style, children } = this.props;
        if (this.props.available) {
            return (
                <Touchable
                    style={style}
                    onPress={() => {
                        if (beforeCheck()) {
                            this._pickerView.showPicker();
                        }
                    }}
                >
                    {children}
                    <PickerView
                        orientation={this.props.orientation}
                        defaultValue={this.state.time}
                        pickerType={pickerType}
                        format={this.getFormat(type)}
                        ref={ref => (this._pickerView = ref)}
                        callback={time => {
                            if (typeof time == 'string') {
                                onSureClickListener(time, this.setTime);
                            } else {
                                this.setState({ time: time });
                                onSureClickListener(time.format('YYYY-MM-DD HH:mm:ss'), this.setTime);
                            }

                        }}
                    />
                </Touchable>
            );
        } else {
            return <View style={style}>{children}</View>;
        }
    }

    getFormat = type => {
        switch (type) {
            case 'minute':
                return 'YYYY-MM-DD HH:mm';
            case 'hour':
                return 'YYYY-MM-DD HH:00';
            case 'day':
                return 'YYYY-MM-DD 00:00';
            case 'month':
                return 'YYYY-MM';
            case 'year':
                return 'YYYY';
            case 'realtime':
                return 'YYYY-MM-DD HH:mm:ss';
        }
    };
}
