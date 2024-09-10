import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

/**
 * 基础单元格
 * @param {*} param0
 */
export const BaseCell1 = ({ style, children, textStyle, isSingleLine }) => {
    /**内容是一个组件时候直接使用，内容不为组件时候放到text中*/
    let textDom;
    if (isSingleLine) {
        textDom = React.isValidElement(children) ? (
            children
        ) : (
            <Text style={[styles.text, textStyle && { ...textStyle }]} numberOfLines={1} ellipsizeMode={'tail'}>
                {children}
            </Text>
        );
    } else {
        textDom = React.isValidElement(children) ? children : <Text style={[styles.text, textStyle && { ...textStyle }]}>{children}</Text>;
    }
    return <View style={[styles.cell, style]}>{textDom}</View>;
};

const styles = StyleSheet.create({
    cell: {
        width: '100%',
        backgroundColor: '#00000000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 15,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#333333'
    }
});

export default BaseCell1;
