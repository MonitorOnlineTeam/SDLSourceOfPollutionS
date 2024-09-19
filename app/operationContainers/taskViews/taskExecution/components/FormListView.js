import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { createAction, StackActions, NavigationActions } from '../../../../utils';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import globalcolor from '../../../../config/globalcolor';
import { getToken } from '../../../../dvapack/storage';

@connect(({ taskModel }) => ({
    TaskFormList: taskModel.TaskFormList,
    currentTask: taskModel.currentTask
}))
export default class FormListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            User_ID: getToken().User_ID
        };
    }

    renderFormList = () => {
        let taskFormList = [],
            TaskFormNo = 0;
        this.props.TaskFormList.map((item, key) => {
            if (item.FormMainID) {
                TaskFormNo = TaskFormNo + 1;
                taskFormList.push(
                    <TouchableOpacity
                        key={'taskForm' + key}
                        onPress={() => {
                            if (
                                (this.props.currentTask.TaskStatus == 2 || this.props.currentTask.TaskStatus == 1) &&
                                this.props.currentTask.OperationsUserID == this.state.User_ID
                            ) {
                                if (item.TypeName == 'ReagentRepalceHistoryList') {
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'ReagentRepalceHistoryList',
                                            params: { ...item, createForm: false, type: item.TypeName }
                                        })
                                    );
                                } else if (item.TypeName == 'StandardGasRepalceHistoryList') {
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'StandardGasRepalceForm',
                                            params: { ...item, createForm: false, type: item.TypeName }
                                        })
                                    );
                                } else if (item.TypeName == 'ConsumablesReplaceHistoryList') {
                                    this.props.dispatch(
                                        StackActions.push({
                                            routeName: 'ConsumablesReplaceRecord',
                                            params: {
                                                ...item,
                                                createForm: false,
                                                type: 'ConsumablesReplaceHistoryList'
                                            }
                                        })
                                    );
                                    // this.props.dispatch(StackActions.push({
                                    //     routeName: 'ConsumablesReplaceForm',
                                    // }));
                                } else if (item.TypeName == 'SparePartHistoryList') {
                                    //备件更换记录表
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'SparePartsRecord',
                                            params: {
                                                ...item,
                                                createForm: false,
                                                type: 'ConsumablesReplaceHistoryList'
                                            }
                                        })
                                    );
                                }
                            } else {
                                if (item.formUrl != '') {
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'CustomerFormWebview',
                                            params: {
                                                FormUrl: item.formUrl,
                                                title: item.CnName,
                                                item,
                                                reloadList: () => { }
                                            }
                                        })
                                    );
                                }
                            }
                        }}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH,
                                    height: 40,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: globalcolor.lightGreyBackground
                                }
                            ]}
                        >
                            <View
                                style={{
                                    backgroundColor: globalcolor.datepickerGreyText,
                                    marginLeft: 13,
                                    marginRight: 4,
                                    height: 17,
                                    width: 17,
                                    borderRadius: 3,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{ color: globalcolor.whiteFont, fontSize: 14, textAlign: 'center' }}>
                                    {TaskFormNo}
                                </Text>
                            </View>
                            <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.CnName}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }
        });
        return taskFormList;
    };

    render() {
        return <View>{this.renderFormList()}</View>;
    }
}
