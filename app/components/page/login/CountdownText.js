/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2022-09-01 11:50:47
 * @LastEditTime: 2022-09-06 17:34:12
 * @FilePath: /SDLMainProject/app/components/page/login/CountdownText.js
 */
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';


export default class CountdownText extends PureComponent {
    static defaultProps = {
        duration: 10,
        textStyle: {
            color: '#ffffff',
            fontSize: 14
        },
        endCallback: () => { },
        changeCallback: () => { },
        prefix: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            remainingTime: props.duration,
            timer: null,
            canGo: false
        };
    }
    componentDidMount() {
        let next = this.state.remainingTime;
        let view = this;
        this.state.timer = setInterval(() => {
            next = view.state.remainingTime - 1;
            this.setState({ remainingTime: next }, () => {
                if (next == 0) {
                    view.props.endCallback()
                    view.props.changeCallback(next)
                    clearInterval(view.state.timer);
                } else {
                    view.props.changeCallback(next)
                }
            });
        }, 1000);
    }
    componentWillUnmount() {
        if (this.state.timer != null) {
            clearInterval(this.state.timer);
        }
    }

    // render() {
    //     return <Text style={[this.props.textStyle]}>{this.props.prefix
    //     +(this.state.remainingTime!=0?'(':'')+this.state.remainingTime+this.state.remainingTime!=0?')':''}</Text>;
    // }
    render() {
        return <Text style={[this.props.textStyle]}>{`${this.props.prefix}${this.state.remainingTime == 0 ? '' : ' ' + this.state.remainingTime}`}</Text>;
    }
}
