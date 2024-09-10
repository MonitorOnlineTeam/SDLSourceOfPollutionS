import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Touchable } from '..';
import BaseCell1 from './BaseCell1';
import { ShowToast } from '../../utils';
/**
 * 基础行
 * @param {*} param0
 */
export const BaseRow1 = ({ data, colNum, flexArr, widthArr, alignArr, height, backgroundColor = '#00000000', borderStyle, textStyle, onRowClick, isSingleLine, style }) => {
    const _colNum = colNum || data.length;
    const { borderWidth = 0, borderLeftWidth = 0, borderRightWidth = 0, borderTopWidth = 0, borderBottomWidth = 0, borderColor = '#00000000' } = borderStyle;

    const cells = [];
    /* 循环 对不满一行的特殊处理（data.length<colNum时） */
    for (let index = 0; index < _colNum; index++) {
        const width = widthArr && widthArr[index];
        let flex = flexArr && flexArr[index];
        if (flex == null || flex == 'undefined') {
            if (width == 0 || width == null || width == 'undefined') {
                flex = 1;
            }
        }

        let borderLeft = borderLeftWidth || borderWidth;
        const _borderLeftWidth = index > 0 ? 0 : borderLeft; //最左侧 左边框宽度展示1|其他 左边框宽度展示0
        const _borderRightWidth = borderRightWidth || borderWidth; //全部显示1

        /* 出现不满一行时候 多余的部分 不绘制网格 */
        const _borderTopColor = borderColor;
        const _borderLeftColor = index > data.length - 1 ? '#00000000' : borderColor;
        const _borderRightColor = index > data.length - 1 ? '#00000000' : borderColor;
        const _borderBottomColor = index > data.length - 1 ? '#00000000' : borderColor;

        const children = index < data.length ? data[index] : ''; //不满一行 不显示children

        cells.push(
            <BaseCell1
                key={index.toString()}
                isSingleLine={isSingleLine}
                style={[
                    {
                        borderTopColor: _borderTopColor,
                        borderLeftColor: _borderLeftColor,
                        borderRightColor: _borderRightColor,
                        borderBottomColor: _borderBottomColor,

                        borderLeftWidth: _borderLeftWidth,
                        borderTopWidth: borderTopWidth,
                        borderBottomWidth: borderBottomWidth,
                        borderRightWidth: _borderRightWidth
                    },
                    flex && { flex: flex },
                    height && { height: height },
                    width && { width: width },
                    alignArr && { alignItems: alignArr[index] }
                ]}
                textStyle={textStyle}
            >
                {children}
            </BaseCell1>
        );
    }

    if (onRowClick)
        return (
            <Touchable style={[{ flexDirection: 'row' }, backgroundColor && { backgroundColor: backgroundColor }]} onPress={onRowClick}>
                {cells}
            </Touchable>
        );
    return <View style={[{ flexDirection: 'row' }, backgroundColor && { backgroundColor: backgroundColor }, style]}>{cells}</View>;
};
export default BaseRow1;
