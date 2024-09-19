import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { PickerTouchable, Touchable, SimpleLoadingComponent } from '../../../components';
import { SentencedToEmpty, createAction, NavigationActions, createNavigationOptions, ShowToast } from '../../../utils';
import { CURRENT_PROJECT } from '../../../config';

const ic_arrows_down = require('../../../images/ic_arrows_down.png');

/**
 * 任务转移
 */
@connect(({ taskModel }) => ({
    currentTask: taskModel.currentTask,
    selectableMaintenanceStaff: taskModel.selectableMaintenanceStaff,
    selectTransUser: taskModel.selectTransUser,
    TaskCode: taskModel.TaskCode,
    TaskID: taskModel.TaskID,
    loading: false
}))
export default class TaskTransfer extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '任务转移',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {
            User_ID: '',
            Remark: ''
        };
    }

    componentDidMount() {
        this.props.dispatch(
            createAction('taskModel/updateState')({
                selectTransUser: {}
            })
        );
    }

    render() {
        let taskArr = this.props.TaskID.split(',');
        return (
            <View style={[styles.container]}>
                <KeyboardAwareScrollView ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                    {(taskArr.length > 1 && taskArr[1] != '') || this.props.currentTask == null ? null : (
                        <View style={[{ width: SCREEN_WIDTH, backgroundColor: globalcolor.headerBackgroundColor, flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }]}>
                            <View style={[{ marginRight: 14 }]}>
                                <Text style={[{ marginVertical: 15 }, styles.label]}>任务单号</Text>
                                <Text style={[{ marginBottom: 15 }, styles.label]}>创建人</Text>
                                <Text style={[{ marginBottom: 15 }, styles.label]}>创建时间</Text>
                                <Text style={[{ marginBottom: 15 }, styles.label]}>任务类型</Text>
                            </View>
                            <View>
                                <Text style={[{ marginVertical: 15 }, styles.content]}>{`${SentencedToEmpty(this.props.currentTask, ['TaskCode'], '')}`}</Text>
                                <Text style={[{ marginBottom: 15 }, styles.content]}>{`${SentencedToEmpty(this.props.currentTask, ['CreateUser'], '')}`}</Text>
                                <Text style={[{ marginBottom: 15 }, styles.content]}>{`${SentencedToEmpty(this.props.currentTask, ['CreateTime'], '')}`}</Text>
                                <Text style={[{ marginBottom: 15 }, styles.content]}>
                                    {CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' ? `${SentencedToEmpty(this.props.currentTask, ['TaskTypeText'], '')}` : `${SentencedToEmpty(this.props.currentTask, ['TaskContentType'], '')}`}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={[styles.card]}>
                        <View style={[styles.selectRow]}>
                            <Touchable
                                onPress={() => {
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'ContactOperation',
                                            params: {
                                                selectType: 'people'
                                            }
                                        })
                                    );
                                }}
                                style={[styles.row]}
                            >
                                <Text style={[styles.label, { color: '#333', marginRight: 42 }]}>{'接收人'}</Text>
                                <Text style={[styles.content, { color: '#666' }]}>{this.props.selectTransUser.title}</Text>
                                <Image style={{ width: 10, height: 10, marginRight: 8 }} source={require('../../../images/ic_arrows_right.png')} />
                            </Touchable>
                        </View>
                        <View style={[{ width: SCREEN_WIDTH - 26, height: 45, justifyContent: 'center' }]}>
                            <Text style={[styles.label, { marginLeft: 6, color: '#333' }]}>{'转移原因'}</Text>
                        </View>
                        <View style={[styles.selectRow, { marginBottom: 15 }]}>
                            <TextInput
                                style={[{ width: SCREEN_WIDTH - 38, fontSize: 14, color: '#666666', textAlignVertical: 'top' }]}
                                placeholder={'请输入申请说明'}
                                multiline={true}
                                numberOfLines={2}
                                onChangeText={text => {
                                    // 动态更新组件内State记录用户名
                                    this.setState({
                                        Remark: text
                                    });
                                }}
                                placeholderTextColor={globalcolor.placeholderTextColor}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <TouchableOpacity
                    onPress={() => {
                        const _ToUserId = SentencedToEmpty(this.props, ['selectTransUser', 'User_ID'], '');
                        if (_ToUserId == '') {
                            ShowToast('未选择接收人！');
                            return;
                        }
                        this.setState({ loading: true });
                        this.props.dispatch(
                            createAction('taskModel/postRetransmission')({
                                params: {
                                    TaskId: this.props.TaskID,
                                    ToUserId: _ToUserId,
                                    Remark: this.state.Remark
                                },
                                callback: () => {
                                    this.setState({ loading: false });
                                    this.props.dispatch(NavigationActions.back());
                                    this.props.dispatch(NavigationActions.back());
                                }
                            })
                        );
                    }}
                    style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: globalcolor.headerBackgroundColor, marginBottom: 10, height: 50, width: SCREEN_WIDTH - 20 }}
                >
                    <Text style={{ color: 'white' }}>确定</Text>
                </TouchableOpacity>
                {this.state.loading == true ? <SimpleLoadingComponent message={'转发中'} /> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey
    },
    card: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        paddingHorizontal: 13,
        alignItems: 'center'
    },
    icon: {
        height: 24,
        width: 24,
        marginRight: 5
    },
    row: {
        width: SCREEN_WIDTH - 38,
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    selectRow: {
        width: SCREEN_WIDTH - 26,
        height: 45,
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 15,
        color: '#d6e5ff'
    },
    content: {
        fontSize: 14,
        color: '#fdffff',
        flex: 1
    },
    rowInner: {
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#e5e5e5'
    }
});
