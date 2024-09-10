import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import BaseCell from './BaseCell';
/**
 * 基础行
 * @param {*} param0 
 */
export const BaseRow = ({data,colNum,flexArr,widthArr,height,borderWidth,borderLeftWidth,borderRightWidth,borderTopWidth,borderBottomWidth,borderColor,textStyle,backgroundColor}) => {
  const _colNum = colNum||data.length;
  const cells = [];

  /* 循环 对不满一行的特殊处理 */
  for(let index = 0;index < _colNum; index++){
    const flex = flexArr && flexArr[index];
    const width = widthArr && widthArr[index];

    let borderLeft = (borderLeftWidth||borderWidth)||0;
    const _borderLeftWidth = index>0?0:borderLeft;//最左侧 左边框宽度展示1|其他 左边框宽度展示0
    const _borderRightWidth = (borderRightWidth||borderWidth)||0;//全部显示1

    /* 出现不满一行时候 多余的部分 不绘制表格 */
    const _borderColor = borderColor||'#00000000';
    const _borderTopColor = _borderColor;
    const _borderLeftColor = index>data.length-1?'#00000000':_borderColor;
    const _borderRightColor = index>data.length-1?'#00000000':_borderColor;
    const _borderBottomColor = index>data.length-1?'#00000000':_borderColor;

    const children = index<data.length?data[index]:'';//不满一行 不显示children
    cells.push(<BaseCell
                    key={index.toString()}
                    style={[
                    {
                      flex:flex,
                      backgroundColor:backgroundColor||'#00000000',
                      
                      borderTopColor:_borderTopColor,
                      borderLeftColor: _borderLeftColor,
                      borderRightColor: _borderRightColor,
                      borderBottomColor: _borderBottomColor,

                      borderLeftWidth: _borderLeftWidth,
                      borderTopWidth: borderTopWidth,
                      borderBottomWidth: borderBottomWidth,
                      borderRightWidth:_borderRightWidth,
                    },
                    height && {height: height},
                    width && {width: width},
                  ]}
                  textStyle={textStyle}>
              {children}
              </BaseCell>);
  }
  return (<View style={{flexDirection:'row',backgroundColor:'#00000000'}}>{cells}</View>);
};
export default BaseRow;