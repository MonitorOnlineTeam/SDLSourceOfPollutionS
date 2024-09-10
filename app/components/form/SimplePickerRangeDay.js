/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-12-29 11:36:14
 * @LastEditTime: 2024-01-03 18:52:34
 * @FilePath: /SDLMainProject37/app/components/form/SimplePickerRangeDay.js
 */
import React, { PureComponent } from 'react';
import { Text, View, Image } from 'react-native';
import moment from 'moment';

import PickerRangeDayTouchable from './PickerRangeDayTouchable';
import { SentencedToEmpty } from '../../utils';
const ic_arrows_down = require('../../images/ic_filt_arrows.png');

export default class SimplePickerRangeDay extends PureComponent {

    static defaultProps = {
        separator: '-'
    }

    constructor(props) {
        super(props);
        let defaultStart = moment();
        defaultStart.subtract(7, 'day');
        defaultStart.hour(0);
        defaultStart.minute(0);
        defaultStart.second(0);
        let defaultEnd = moment();
        defaultEnd.hour(23);
        defaultEnd.minute(59);
        defaultEnd.second(59);
        let formatStr = SentencedToEmpty(this.props, ['option', 'formatStr'], 'MM/DD'),
            start = SentencedToEmpty(this.props, ['option', 'start'], defaultStart.format('YYYY-MM-DD HH:mm:ss')),
            end = SentencedToEmpty(this.props, ['option', 'end'], defaultEnd.format('YYYY-MM-DD HH:mm:ss'));
        let showStart = moment(start).format(formatStr);
        let showEnd = moment(end).format(formatStr);
        if (formatStr.indexOf('YYYY') == -1
            && moment(start).year() != moment(end).year()) {
            showStart = moment(start).format(`YYYY ${formatStr}`);
            showEnd = moment(end).format(`YYYY ${formatStr}`);
        }
        this.state = {
            start: start,
            end: end,
            formatStr: formatStr,
            showTime: `${showStart}${this.props.separator}${showEnd}`
        };
        this.option = { ...this.props.option };
        this.option.onSureClickListener = (start, end) => {
            let showStart = moment(start).format(formatStr);
            let showEnd = moment(end).format(formatStr);
            if (formatStr.indexOf('YYYY') == -1
                && moment(start).year() != moment(end).year()) {
                showStart = moment(start).format(`YYYY/${formatStr}`);
                showEnd = moment(end).format(`YYYY/${formatStr}`);
            }
            this.setState({ start, end, showTime: `${showStart}${this.props.separator}${showEnd}` });
            this.props.option.onSureClickListener(start, end);
        };
    }

    setTimeRange = (start, end) => {
        //传入字符串格式的时间
        let showStart = moment(start).format(this.state.formatStr);
        let showEnd = moment(end).format(this.state.formatStr);
        if (this.state.formatStr.indexOf('YYYY') == -1
            && moment(start).year() != moment(end).year()) {
            showStart = moment(start).format(`YYYY ${this.state.formatStr}`);
            showEnd = moment(end).format(`YYYY ${this.state.formatStr}`);
        }
        this.setState({
            start: start,
            end: end,
            showTime: `${moment(start).format(this.state.formatStr)}${this.props.separator}${moment(end).format(this.state.formatStr)}`
        });
        this._touchable.setTimeRange(start, end);
    };

    render() {
        return (
            <PickerRangeDayTouchable
                ref={ref => (this._touchable = ref)}
                option={this.option}
                style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 45, paddingLeft: 12, paddingRight: 12 }, this.props.style]}
            >
                <Text style={{ fontSize: 14, color: '#666' }}>{this.state.showTime}</Text>
                <Image style={{ width: 10, height: 10, marginLeft: 4 }} source={ic_arrows_down} />
            </PickerRangeDayTouchable>
        );
    }
}
