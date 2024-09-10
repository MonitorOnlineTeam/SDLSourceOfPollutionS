//import liraries
import React, { PureComponent } from 'react';
import { View, FlatList, Platform, StyleSheet } from 'react-native';

import { BaseRow1 } from '../../components';
import { ShowToast } from '../../utils';
/**
 * 基础图表
 */
export default class BaseTable1 extends PureComponent {
    scrollToOffset = event => {
        this.table.scrollToOffset(event);
    };

    render() {
        const { data, lineData, colNum, flexArr, widthArr, alignArr, height, backgroundColor, borderStyle, textStyle, onRowClick, ...rest } = this.props;
        const { borderColor = '#00000000', borderWidth = 0, borderLeftWidth = 0, borderRightWidth = 0, borderTopWidth = 0, borderBottomWidth = 0 } = borderStyle;
        let _data = [];
        if (data) {
            _data = data;
        } else if (!data && lineData && colNum) {
            //传输为一位数组时候 转为二维数组
            for (let i = 0; i < lineData.length / colNum; i++) {
                let item = [];
                for (let j = colNum * i; j < colNum * (i + 1), j < lineData.length; j++) {
                    item.push(lineData[j]);
                }
                _data.push(item);
            }
        }
        return (
            <FlatList
                ref={ref => (this.table = ref)}
                style={[styles.container]}
                showsVerticalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item, index) => index.toString()}
                data={_data}
                getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
                renderItem={({ item, index }) => {
                    let borderTop = borderTopWidth || borderWidth || 0; //borderTopWidth有数据用 没有就用borderWidth 再没有 赋值为0
                    const _borderTopWidth = index > 0 ? 0 : borderTop; //borderTopWidth 第一行显示上边框1 其他显示0
                    const _borderBottomWidth = borderBottomWidth || borderWidth || 0;

                    return (
                        <BaseRow1
                            data={item}
                            colNum={colNum}
                            flexArr={flexArr}
                            widthArr={widthArr}
                            height={height}
                            backgroundColor={backgroundColor}
                            borderStyle={{
                                borderWidth,
                                borderLeftWidth,
                                borderRightWidth,
                                borderTopWidth: _borderTopWidth,
                                borderBottomWidth: _borderBottomWidth,
                                borderColor
                            }}
                            textStyle={textStyle}
                            alignArr={alignArr}
                            onRowClick={
                                onRowClick &&
                                (() => {
                                    onRowClick(index);
                                })
                            }
                        />
                    );
                }}
                {...rest}
            />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: { flex: 1, width: '100%' }
});
