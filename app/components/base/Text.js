import React from 'react';
import { StyleSheet, Text } from 'react-native';

export const _Text = ({children, style, ...rest }) => (
    <Text style={[styles.text,style]} {...rest}>{children}</Text>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#333333',
  },
});

export default _Text;
