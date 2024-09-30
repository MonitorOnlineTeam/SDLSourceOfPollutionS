import React, { Component } from 'react';

import { Dimensions, View, ScrollView, StyleSheet, Text, StatusBar } from 'react-native';
import { Touchable } from '..';
import { AlertDialog } from '../../components';
import SelectButton from '../../components/SelectButton';
import { ShowToast } from '../../utils';
import { DeviceEventEmitter } from 'react-native';
import { SCREEN_WIDTH } from '../../config/globalsize';
const { width, height } = Dimensions.get('window');

export default class MoreSelectTouchable extends Component {
    static defaultProps = {
        width: width - 60,
        count: 3,
        option: {
            maxNum: 999
        }
    };

    constructor(props) {
        super(props);
        const { codeKey = 'codekey', nameKey = 'title', selectData = [], selectCode = [], dataArr = [], maxNum = 999 } = this.props.option;

        let _selectData = [];
        let _selectCode = [];

        if (selectCode.length > 0) {
            _selectCode = selectCode;
            dataArr.map(data => {
                if (selectCode.indexOf(data[codeKey]) != -1) {
                    _selectData.push(data);
                }
            });
        }

        if (selectData.length > 0) {
            _selectData = selectData;
            selectData.map((item, key) => {
                _selectCode.push(item[codeKey]);
            });
        }

        this.state = {
            selectData: _selectData,
            selectCode: _selectCode,
            beforeSubmitCode: [],
            beforeSubmitData: [],
            codeKey: codeKey,
            nameKey: nameKey,
            showText: selectCode.length >= maxNum ? true : false
        };
    }

    componentDidMount() { }

    selectItems = (selectCode = []) => {
        let { codeKey = 'codekey', dataArr = [] } = this.props.option;
        let _selectData = [];
        dataArr.map(item => {
            if (selectCode.indexOf(item[codeKey]) != -1) {
                _selectData.push(item);
            }
        });
        this.setState({ selectCode: selectCode, selectData: _selectData });
    };

    setData = (selectCode) => {
        this.setState({ selectCode });
    }

    getBeforeSubmitData = () => {
        return this.state.beforeSubmitCode;
    }

    render() {
        const { style, children } = this.props;
        const { dataArr = [], callback, maxNum = 999 } = this.props.option;
        return (
            <Touchable
                style={style}
                onPress={() => {
                    if (dataArr.length == 0) {
                        ShowToast('缺少配置');
                        return;
                    }
                    let beforeSubmitCode = this.state.selectCode.concat([]);
                    let beforeSubmitData = this.state.selectData.concat([]);
                    this.setState({ beforeSubmitCode, beforeSubmitData });
                    this.refs.alert.show();
                }}
            >
                {children}
                <AlertDialog
                    orientation={this.props.orientation}
                    components={
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: this.props.width, height: this.props.orientation == 'LANDSCAPE' ? SCREEN_WIDTH : 360, borderWidth: 1 }}>
                            <StatusBar hidden={true} />
                            <Text style={{ marginTop: 10, color: '#4aa0ff' }}>{this.state.showText == true ? '最多支持选中' + maxNum + '个' : ''}</Text>
                            <ScrollView>{this.renderView()}</ScrollView>
                            <View style={{ height: 1, backgroundColor: '#f0f0f0', width: this.props.width }} />
                            <View style={{ marginTop: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', width: this.props.width, height: 45, paddingLeft: 10, paddingRight: 10 }}>
                                <Touchable
                                    onPress={() => {
                                        let beforeSubmitCode = this.state.beforeSubmitCode;
                                        let beforeSubmitData = this.state.beforeSubmitData;
                                        this.setState({
                                            selectCode: beforeSubmitCode, beforeSubmitCode: []
                                            , selectData: beforeSubmitData, beforeSubmitData: []
                                        });
                                        this.refs.alert.hide();
                                    }}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Text style={{ color: '#666666' }}>取消</Text>
                                </Touchable>
                                <View style={{ backgroundColor: '#f0f0f0', width: 1, height: '100%' }} />
                                <Touchable
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => {
                                        this.refs.alert.hide();
                                        /* 取出来选中的code和name 逗号分隔组成字符串 传出去*/
                                        let selectCodeStr = '';
                                        let selectNameStr = '';
                                        console.log('state = ', this.state);
                                        this.state.selectData.map((item, key) => {
                                            selectCodeStr = `${selectCodeStr},${item[this.state.codeKey]}`;
                                            selectNameStr = `${selectNameStr},${item[this.state.nameKey]}`;
                                        });
                                        if (selectCodeStr) {
                                            selectCodeStr = selectCodeStr.substring(1, selectCodeStr.length);
                                        }
                                        if (selectNameStr) {
                                            selectNameStr = selectNameStr.substring(1, selectNameStr.length);
                                        }
                                        let result = callback({ selectData: this.state.selectData, selectCode: this.state.selectCode, selectNameStr, selectCodeStr });
                                        if (typeof result != 'undefined') {
                                            this.setState(result);
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#5688f6' }}>确定</Text>
                                </Touchable>
                            </View>
                        </View>
                    }
                    options={{
                        hiddenTitle: true,
                        innersHeight: 360,
                        innersWidth: width - 60,
                        modalVisible: false,
                        alertDialogHideCallback: () => {
                            let beforeSubmitCode = this.state.beforeSubmitCode;
                            this.setState({ selectCode: beforeSubmitCode, beforeSubmitCode: [] });
                        }
                    }}
                    ref="alert"
                />
            </Touchable>
        );
    }
    renderView() {
        const { dataArr = [] } = this.props.option;
        if (!dataArr || dataArr.length === 0) return;
        var len = dataArr.length;
        var views = [];
        if (this.props.count == 2) {
            for (var i = 0, l = len - 2; i <= l; i += 2) {
                views.push(
                    <View key={i}>
                        <View style={{ width: this.props.width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            {this.renderCheckBox(dataArr[i])}
                            {this.renderCheckBox(dataArr[i + 1])}
                        </View>
                        <View style={styles.line} />
                    </View>
                );
            }
            if (len % 2 != 0) {
                views.push(
                    <View key={len - 1}>
                        <View style={{ width: this.props.width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>{this.renderCheckBox(dataArr[len - 1])}</View>
                    </View>
                );
            }
        } else if (this.props.count == 1) {
            for (var i = 0; i < len; i += 1) {
                views.push(
                    <View key={i}>
                        <View style={{ width: this.props.width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>{this.renderCheckBox(dataArr[i])}</View>
                    </View>
                );
            }
        } else {
            for (var i = 0, l = len - 3; i <= l; i += 3) {
                views.push(
                    <View key={i}>
                        <View style={{ width: this.props.width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            {this.renderCheckBox(dataArr[i])}
                            {this.renderCheckBox(dataArr[i + 1])}
                            {this.renderCheckBox(dataArr[i + 2])}
                        </View>
                        <View style={styles.line} />
                    </View>
                );
            }
            if (len % 3 != 0) {
                views.push(
                    <View key={len - 2}>
                        <View style={{ width: this.props.width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            {len % 3 > 1 ? this.renderCheckBox(dataArr[len - 2]) : null}
                            {len % 3 > 0 ? this.renderCheckBox(dataArr[len - 1]) : null}
                        </View>
                    </View>
                );
            }
        }
        return views;
    }

    onClick(data) {
        const { maxNum = 999 } = this.props.option;
        let selectArr = this.state.selectData.concat([]);
        let selectCode = this.state.selectCode.concat([]);

        if (this.state.selectCode.indexOf(data[this.state.codeKey]) != -1) {
            let deleteIndex = selectArr.findIndex((value, index, arr) => {
                if (value[this.state.codeKey] == data[this.state.codeKey]) {
                    return true;
                } else {
                    return false;
                }
            });
            selectCode.splice(this.state.selectCode.indexOf(data[this.state.codeKey]), 1);
            selectArr.splice(deleteIndex, 1);
        } else {
            if (selectArr.length < maxNum) {
                let newSelectArr = [], newSelectCode = [];
                this.props.option.dataArr.map((item, index) => {
                    if (item[this.state.codeKey] == data[this.state.codeKey]
                    ) {
                        newSelectArr.push(item);
                        newSelectCode.push(data[this.state.codeKey]);
                    } else {
                        // 通过双循环 按照原有顺序记录选中状态
                        selectCode.map((codeItem, codeIndex) => {
                            if (codeItem == item[this.state.codeKey]) {
                                newSelectArr.push(item);
                                newSelectCode.push(codeItem);
                            }
                        });
                    }
                })

                // selectCode.push(data[this.state.codeKey]);
                // selectArr.push(data);
                selectCode = newSelectCode;
                selectArr = newSelectArr;
            }
        }
        //调用事件通知
        DeviceEventEmitter.emit('changeStatus', selectArr.length);
        this.setState({ selectData: selectArr, selectCode: selectCode });
        if (selectArr.length < maxNum) {
            this.setState({ showText: false });
        } else {
            this.setState({ showText: true });
        }
    }

    renderCheckBox(data) {
        var text = data[this.state.nameKey];
        const { maxNum = 999 } = this.props.option;
        return (
            <SelectButton
                style={{ padding: 5, width: this.props.width / this.props.count }}
                selectStyle="More"
                maxNum={maxNum}
                currentNum={this.state.selectCode.length}
                onClick={() => {
                    this.onClick(data);
                }}
                isChecked={this.state.selectCode.indexOf(data[this.state.codeKey]) != -1 ? true : false}
                rightText={text}
            />
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f2f2',
        marginTop: 30
    },
    item: {
        flexDirection: 'row'
    }
});
