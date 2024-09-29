import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { PickerTouchable, Touchable, SimpleLoadingComponent, AlertDialog } from '../../components';
import { SentencedToEmpty, createAction, NavigationActions, createNavigationOptions, ShowToast } from '../../utils';
import { CURRENT_PROJECT } from '../../config';
import { getToken } from '../../dvapack/storage';

const ic_arrows_down = require('../../images/ic_arrows_down.png');

/**
 * 任务转移
 */
@connect(({ taskModel, keyParameterVerificationModel }) => ({
    unsubmitParams: keyParameterVerificationModel.unsubmitParams,
    selectTransUser: taskModel.selectTransUser,
    loading: false
}))
export default class KeyParameterTransfer extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '关键参数核查转移',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {
            // User_ID: '',
            // Remark: ''
        };
    }

    componentDidMount() {
        this.props.dispatch(
            createAction('taskModel/updateState')({
                selectTransUser: {}
            })
        );
    }

    cancelButton = () => { }
    confirm = () => {
        const ID = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'id'], '');
        const OperationUser = SentencedToEmpty(this.props
            , ['selectTransUser', 'User_ID'], '');
        let params = {
            ID, //任务主键   
            OperationUser, //人员id
            // Remark: this.state.Remark
        };
        console.log('params = ', params);
        this.setState({ loading: true });
        this.props.dispatch(
            createAction('keyParameterVerificationModel/RetransmissionKeyParameter')({
                params,
                callback: () => {
                    this.setState({ loading: false });
                    let newParams = { ...this.props.unsubmitParams };
                    newParams.index = 1;
                    this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                        unsubmitParams: newParams,
                        unsubmitResult: { status: -1 },
                    }));
                    this.props.dispatch(createAction('keyParameterVerificationModel/getUnsubmitList')({}));
                    this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
                    this.props.dispatch(NavigationActions.back());
                },
                failureCallback: () => {
                    this.setState({ loading: false });
                }
            })
        );
    }

    render() {
        let alertOptions = {
            headTitle: '提示',
            messText: '您确定要转发此核查任务吗？',
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
        return (
            <View style={[styles.container]}>
                <KeyboardAwareScrollView ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                    <View style={[{ width: SCREEN_WIDTH, backgroundColor: globalcolor.headerBackgroundColor, flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }]}>
                        <View style={[{ marginRight: 14 }]}>
                            <Text style={[{ marginVertical: 15 }, styles.label]}>点位名称</Text>
                            <Text style={[{ marginBottom: 15 }, styles.label]}>企业名称</Text>
                            <Text style={[{ marginBottom: 15 }, styles.label]}>派发时间</Text>
                        </View>
                        <View>
                            <Text style={[{ marginVertical: 15 }, styles.content]}>{`${SentencedToEmpty(this.props
                                , ['route', 'params', 'params', 'pointName'], '')}`}</Text>
                            <Text style={[{ marginBottom: 15 }, styles.content]}>{`${SentencedToEmpty(this.props
                                , ['route', 'params', 'params', 'entName'], '')}`}</Text>
                            <Text style={[{ marginBottom: 15 }, styles.content]}>{`${SentencedToEmpty(this.props
                                , ['route', 'params', 'params', 'createTime'], '----/--/--')}`}</Text>
                        </View>
                    </View>
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
                                <Image style={{ width: 10, height: 10, marginRight: 8 }} source={require('../../images/ic_arrows_right.png')} />
                            </Touchable>
                        </View>
                        {/* <View style={[{ width: SCREEN_WIDTH - 26, height: 45, justifyContent: 'center' }]}>
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
                        </View> */}
                    </View>
                </KeyboardAwareScrollView>
                <TouchableOpacity
                    onPress={() => {
                        console.log(this.props);
                        console.log(this.state);
                        // 需转发的关键参数核查信息
                        const ID = SentencedToEmpty(this.props
                            , ['route', 'params', 'params', 'id'], '');
                        if (ID == '') {
                            ShowToast('核查信息错误，无法转发！');
                            return;
                        }
                        const OperationUser = SentencedToEmpty(this.props
                            , ['selectTransUser', 'User_ID'], '');
                        const user = getToken();
                        console.log('user = ', user);
                        if (OperationUser == '') {
                            ShowToast('未选择转发人，无法转发！');
                            return;
                        } else if (OperationUser == user.UserId) {
                            ShowToast('不能转发给自己！');
                            return;
                        }
                        this.refs.doAlert.show();
                    }}
                    style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: globalcolor.headerBackgroundColor, marginBottom: 10, height: 50, width: SCREEN_WIDTH - 20 }}
                >
                    <Text style={{ color: 'white' }}>确定</Text>
                </TouchableOpacity>
                <AlertDialog options={alertOptions} ref="doAlert" />
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
