import React, { PureComponent } from 'react';
import { Text, View, Image } from 'react-native';
import moment from 'moment';

import PickerSingleTimeTouchable from './PickerSingleTimeTouchable';
import { SentencedToEmpty } from '../../utils';

const ic_arrows_down = require('../../images/ic_arrows_right.png');

export default class SimplePickerSingleTimeTouchable extends PureComponent {

    static defaultProps = {
        lastIcon: require('../../images/ic_arrows_right.png'),
        orientation: 'Portrait'
    }

    constructor(props) {
        super(props);
        this.state = {
            time: SentencedToEmpty(this.props, ['option', 'defaultTime'], moment().format('YYYY-MM-DD HH:mm:ss')), //SentencedToEmpty(this.props, ['option', 'formatStr'], 'MM/DD HH:mm')
            formatStr: SentencedToEmpty(this.props, ['option', 'formatStr'], 'MM/DD HH:mm')
        };
        this.option = { ...this.props.option };
        this.option.onSureClickListener = time => {
            this.setState({ time: time });
            this.props.option.onSureClickListener(time);
        };
    }
    setOptions = option => {
        this.option = { ...this.option, ...option };
        this.option.onSureClickListener = time => {
            this.setState({ time: time });
            this.props.option.onSureClickListener(time);
        };

        this.setState({ formatStr: option.formatStr, time: option.defaultTime });
    };
    setTime = defaultTime => {
        this.setState({
            time: defaultTime
        });
        this._touchable.setTime(defaultTime);
    };
    render() {
        const { lastIconStyle = {} } = this.props;
        return (
            <PickerSingleTimeTouchable
                orientation={this.props.orientation}
                ref={ref => (this._touchable = ref)}
                option={this.option}
                style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 45, paddingLeft: 12, paddingRight: 12 }, this.props.style]}
            >
                <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.time).format(this.state.formatStr)}</Text>
                <Image style={[{ width: 10, height: 10, marginLeft: 8 }, lastIconStyle]} source={this.props.lastIcon} />
            </PickerSingleTimeTouchable>
        );
    }
}
