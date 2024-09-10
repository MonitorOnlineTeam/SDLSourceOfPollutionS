/*
 * @Description: 补签记录
 * @LastEditors: hxf
 * @Date: 2024-02-27 09:28:04
 * @LastEditTime: 2024-03-08 09:56:13
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/workbenchSignin/SupplementarySignInRecord.js
 */
import { Platform, Text, View } from 'react-native'
import React, { Component } from 'react'
import { createAction, createNavigationOptions } from '../../../utils';
import { connect } from 'react-redux';
import ApprovalPendingList from '../../../operationContainers/approval/ApprovalPendingList';

@connect(({ approvalModel }) => ({
    pendingData: approvalModel.pendingData,
    approvalPage: approvalModel.approvalPage
}))
export default class SupplementarySignInRecord extends Component {

    static navigationOptions = createNavigationOptions({
        title: '补签记录',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {

        this.onRefresh();
    }

    onRefresh = () => {
        this.props.dispatch(createAction('approvalModel/updateState')({
            approvalPage: 1,
            pendingData: { status: -1 },
        }));
        this.props.dispatch(createAction('approvalModel/getTaskListRight')({
            params: {
                taskType: 2,
                type: 1,// 我发起的审批记录
                pageIndex: 1,
                pageSize: 10
            }
        }));
    }

    onEndReached = () => {
        if (this.props.approvalPage <= (this.props.pendingData.data.Total / 10)) {
            this.props.dispatch(createAction('approvalModel/updateState')({
                approvalPage: this.props.approvalPage + 1,
            }))
            this.props.dispatch(createAction('approvalModel/getTaskListRight')({
                params: {
                    taskType: 2,
                    type: 1,// 我发起的审批记录
                    pageIndex: this.props.approvalPage + 1,
                    pageSize: 10
                }
            }));
        }
    }

    render() {
        return (
            <ApprovalPendingList
                // selectItem={this.state.selectItem}
                needLeaveRefresh={false}
                listKey='a' key='0' tabLabel='我发起的' datatype={1}
                approvaData={this.props.pendingData} onRefresh={this.onRefresh} onEndReached={this.onEndReached}
            />
        )
    }
}