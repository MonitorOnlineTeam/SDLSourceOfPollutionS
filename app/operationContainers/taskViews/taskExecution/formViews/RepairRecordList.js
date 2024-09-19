import React, { Component, PureComponent } from 'react';
import { FlatList, View, Text, StyleSheet, Platform, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import { NavigationActions, createAction, createNavigationOptions } from '../../../../utils';
// import { getToken, } from '../../dvapack/storage';
import { StatusPage, Touchable, PickerTouchable } from '../../../../components';
import { AlertDialog } from '../../../../components';
import moment from 'moment';

/**
 * 维修记录 列表界面
 * @class DataWarningView
 * @extends {PureComponent}
 */
@connect(
    ({ repairRecordModel }) => ({
        List: repairRecordModel.List,
        liststatus: repairRecordModel.liststatus
    }),
    null,
    null,
    { withRef: true }
)
class RepairRecordList extends PureComponent {
    static navigationOptions = createNavigationOptions({
        title: '选择维修项目',
        headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentWillMount() {
        this.onRefresh();
    }
    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }
    onRefresh = () => {
        //刷新数据
        this.props.dispatch(createAction('repairRecordModel/getForm')({ params: {} }));
    };

    goTo = selectIndex => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'RepairRecordEdit' })); //跳转到编辑页面
        this.props.dispatch(createAction('repairRecordModel/selectSubInfo')({ params: { selectIndex } })); //选中一个item
    };

    cancelButton = () => {};
    confirm = () => {
        // this.refs.doAlert2.hideModal()
        // Alert.alert(
        //     '标题',
        //     '提交成功',
        //   );
        this.props.dispatch(
            createAction('repairRecordModel/delForm')({
                params: {}
            })
        );
    };
    render() {
        var options = {
            headTitle: '提示',
            messText: '是否确定要删除所有维修记录的表单',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        let data = this.props.List;
        if (!data) data = [];
        //计算出高度
        let height = data.length * 51;
        //不为空时候 最后一个给出标识
        if (data.length > 0) {
            data[data.length - 1].isLast = 'false';
        }

        return (
            <StatusPage
                status={this.props.liststatus.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.onRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onRefresh();
                }}
            >
                <View style={[styles.listContainer, { height: height }]}>
                    <FlatList
                        data={data}
                        onRefresh={() => {
                            this.onRefresh();
                        }}
                        refreshing={this.props.loading ? this.props.loading : false}
                        keyExtractor={(item, index) => index + ''}
                        renderItem={({ item, index }) => {
                            return (
                                <Item
                                    onItemClick={itemData => {
                                        this.goTo(index);
                                    }}
                                    itemData={item}
                                />
                            );
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                    onPress={() => {
                        this.refs.doAlert.show();
                    }}
                >
                    {data.length > 0 ? (
                        <View style={[{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ color: globalcolor.whiteFont }]}>{'删除'}</Text>
                            <Text style={[{ color: globalcolor.whiteFont }]}>{'表单'}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>

                <AlertDialog options={options} ref="doAlert" />
            </StatusPage>
        );
    }
}

class Item extends PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onItemClick(this.props.itemData);
                }}
            >
                <View style={styles.item}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{this.props.itemData.ItemName}</Text>
                        <Image style={[styles.image, this.props.itemData.Completed ? {} : { width: 0 }]} />
                    </View>
                    {typeof this.props.itemData.isLast == 'undefined' ? <Text style={styles.line} /> : null}
                </View>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    listContainer: {
        marginBottom: 18,
        paddingLeft: 13,
        paddingRight: 13,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    item: {
        width: SCREEN_WIDTH,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    textContainer: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 14,
        color: '#333333'
    },
    image: {
        width: 15,
        height: 15
    },
    line: {
        height: 1,
        backgroundColor: '#e7e7e7'
    }
});

//make this component available to the app
export default RepairRecordList;
