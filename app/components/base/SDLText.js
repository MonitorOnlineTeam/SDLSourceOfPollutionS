import React, { Component } from 'react';
import { Text, Platform } from 'react-native';

export default class SDLText extends Component {
    static defaultProps = {
        fontType: 'normal'
    };
    render() {
        // let tempProps = { ...this.props };
        let tempStyle;
        let localFontSize = 14;
        switch (this.props.fontType) {
            case 'normal':
                localFontSize = 14;
                break;
            case 'large':
                localFontSize = 17;
                break;
            case 'small':
                if (Platform.OS == 'android') localFontSize = 12;
                else localFontSize = 13;
                break;
            default:
                localFontSize = 14;
        }
        if (this.props.style instanceof Array) {
            tempStyle = [{ color: '#333' }].concat(this.props.style);
            tempStyle.push({ fontSize: localFontSize });
        } else {
            tempStyle = { ...{ fontSize: localFontSize, color: '#333' }, ...this.props.style };
        }
        // delete tempProps.style;
        return <Text {...this.props} style={[tempStyle]} />;
    }
}

/* demo
import React, { Component } from 'react';
import { Text, View, Image, Animated } from 'react-native';

import { SDLText } from '../components';

export default class TestView1 extends Component {
    render() {
        return (
            <View>
                <SDLText style={[{ color: 'red' }]} fontType={'small'}>
                    SmallText
                </SDLText>
                <SDLText style={[{ color: 'yellow' }]} fontType={'normal'}>
                    NormalText
                </SDLText>
                <SDLText style={[{ color: 'blue' }]} fontType={'large'}>
                    LargeText
                </SDLText>
                <SDLText style={[{ color: 'green' }]}>123</SDLText>
                <SDLText style={{ fontSize: 20, color: 'red' }}>123</SDLText>
                <SDLText>NormalText</SDLText>
                <Text> TestView1 </Text>
            </View>
        );
    }
}*/
