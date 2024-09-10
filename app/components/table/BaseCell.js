import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

/**
 * 基础单元格
 * @param {*} param0 
 */
export const BaseCell = ({style,children,textStyle}) => {
  const textDom = React.isValidElement(children) ? children : (
    <Text 
        style={[{color:'#333333',fontSize:15,fontWeight: 'normal'},
        textStyle&&{...textStyle}]}>{children}</Text>
  );
  return(<View style={[styles.cell, style]}>{textDom}</View>);
};

const styles = StyleSheet.create({
  cell: {
    backgroundColor: '#00000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BaseCell;