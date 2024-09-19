/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2021-11-24 16:04:58
 * @LastEditTime: 2023-03-29 14:58:14
 * @FilePath: /SDLMainProject34/app/operationContainers/taskViews/taskExecution/components/CommonList.js
 */

import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'

import { AlertDialog, StatusPage } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';

export default class CommonList extends Component {

    static defaultProps = {
        renderItem:()=>{},
        data:[],
        result:{status:200},
        refresh:()=>{}
    }

    render() {
        const {renderItem, data, result, refresh} = this.props;
        return (
            <StatusPage
                status={result.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    refresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    refresh();
                }}
            >
                <FlatList
                    data={data}
                    keyExtractor={this._keyExtractor}
                    renderItem={renderItem}
                />
            </StatusPage>
        )
    }
}

export class DeleteButton  extends Component {

    static defaultProps = {
        _deleteForm:()=>{}
    }

    render(){
        return(<TouchableOpacity
            style={[{ position: 'absolute', right: 18, bottom: 128 }]}
            onPress={() => {
                this._deleteForm();
            }}
        >
            <View
                style={[
                    {
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        backgroundColor: 'red',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                ]}
            >
                <Text style={[{ color: globalcolor.whiteFont }]}>{'删除'}</Text>
                <Text style={[{ color: globalcolor.whiteFont }]}>{'表单'}</Text>
            </View>
        </TouchableOpacity>);
    }
}

export class DeleteDialog  extends Component {

    static defaultProps = {
        options:{
            headTitle: '提示',
            messText: '确认要删除标气更换记录表吗？',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: ()=>{}
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: ()=>{}
                }
            ]
        }
    }

    show = () => {
        this.refs.doAlert.show();
    }

    render(){
        return(
            <AlertDialog options={this.options} ref="doAlert" />
        );
    }
}