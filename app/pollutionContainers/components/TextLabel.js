import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import { transformColorToTransparency } from '../../utils';
import { SDLText } from '../../components';

export const TextLabel = ({ style, text, color, rest }) => (
    <View style={[styles.container, { backgroundColor: transformColorToTransparency(color) }, style]} {...rest}>
        <SDLText fontType={'small'} style={{ color: color }}>
            {text}
        </SDLText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginRight: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 16,
        paddingLeft: 6,
        paddingRight: 6
    }
});
export default TextLabel;
