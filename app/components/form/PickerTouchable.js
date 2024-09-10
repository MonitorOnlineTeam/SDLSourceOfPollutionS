/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-12-29 11:36:14
 * @LastEditTime: 2024-07-01 18:46:47
 * @FilePath: /SDLMainProject37_1/app/components/form/PickerTouchable.js
 */
import React, { Component } from 'react';

import { TouchableOpacity, View } from 'react-native';
import { Touchable } from '..';
import PickerView from './../SDLPicker/PickerView';
import { ShowToast } from '../../utils';
//为保证刷新将控件有PureComponent转为Component，刷新由SimplePickerTouchable控制
export default class PickerTouchable extends Component {
    constructor(props) {
        super(props);
        const { codeKey, nameKey, defaultCode, dataArr, onSelectListener } = this.props.option;
        let defaultIndex = 0;
        if (defaultCode || (typeof defaultCode == 'number' && defaultCode == 0))
            defaultIndex = dataArr.findIndex((item, index) => {
                return item[codeKey] == defaultCode;
            });
        this.state = {
            defaultItem: dataArr[defaultIndex]
        };
    }

    static defaultProps = {
        available: true
    };

    setSelectItem = item => {
        this.setState({ defaultItem: item });
    };

    render() {
        const { codeKey, nameKey, defaultCode, dataArr, onSelectListener } = this.props.option;
        const { style, children } = this.props;
        if (this.props.available) {
            return (
                <Touchable
                    style={style}
                    onPress={
                        this.props.onPress
                            ? this.props.onPress
                            : () => {
                                this._pickerView.showPicker();
                            }
                    }
                >
                    {children}
                    <PickerView
                        pickerType={'data'}
                        defaultValue={this.state.defaultItem}
                        dataArray={dataArr}
                        getShowValue={item => {
                            return item[nameKey];
                        }}
                        defaultIndexFun={(dataArray, value) => {
                            return dataArray.findIndex((item, index) => {
                                if (value && item[codeKey] == value[codeKey]) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        }}
                        ref={ref => (this._pickerView = ref)}
                        callback={item => {
                            if (item && typeof item != 'undefined') {
                                this.setState({ defaultItem: item });
                                onSelectListener(item);
                            } else if (this.state.defaultItem && typeof this.state.defaultItem != 'undefined') {
                                onSelectListener(this.state.defaultItem);
                            } else {
                                ShowToast('没有可供使用的选项！');
                            }
                        }}
                    />
                </Touchable>
            );
        } else {
            return <View style={style}>{children}</View>;
        }
    }
}
