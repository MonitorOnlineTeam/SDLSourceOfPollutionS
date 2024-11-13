import React, { Component, PureComponent } from 'react';
import { ScrollView, View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Dimensions } from 'react-native';
import { NavigationActions, createAction, ShowToast, createNavigationOptions } from '../../../../utils';
import { connect } from 'react-redux';
import globalcolor from '../../../../config/globalcolor';
import Picker from 'react-native-picker';
import { TextInput, StatusPage, SimpleLoadingComponent } from '../../../../components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 维修记录 编辑界面
 * @class DataWarningView
 * @extends {PureComponent}
 */
@connect(
    ({ repairRecordModel }) => ({ editstatus: repairRecordModel.editstatus, ItemPageData: repairRecordModel.ItemPageData, EnumPart: repairRecordModel.EnumPart }),
    null,
    null,
    { withRef: true }
)
class RepairRecordEdit extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ItemID: '',
            ItemName: '', //维修项目名字
            RepairDescription: '', //描述
            ChangeSpareparts: '', //部件
            IsClear: '', //是否清理
            RepairSummary: '', //总结
            Completed: false
        };
    }

    static navigationOptions = createNavigationOptions({
        title: '维修记录',
        headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentWillMount() {
        this.setState({ ...this.state, ...this.props.ItemPageData });
        this.props.dispatch(createAction('repairRecordModel/updateState')({ editstatus: 'default' }));
        this.initPicker();
    }

    del = () => {
        //修改本地的数据
        this.props.dispatch(createAction('repairRecordModel/delItem')({}));
        //提交本地的数据
        this.props.dispatch(createAction('repairRecordModel/saveForm')({ params: {} }));
    };

    commit = () => {
        //修改本地的数据
        this.props.dispatch(
            createAction('repairRecordModel/saveItem')({
                params: {
                    ItemID: this.state.ItemID,
                    ItemName: this.state.ItemName, //维修项目名字
                    RepairDescription: this.state.RepairDescription, //描述
                    ChangeSpareparts: this.state.ChangeSpareparts, //部件
                    IsClear: this.state.IsClear, //是否清理
                    RepairSummary: this.state.RepairSummary //总结
                }
            })
        );
        //提交本地的数据
        this.props.dispatch(createAction('repairRecordModel/saveForm')({ params: {} }));
    };

    render() {
        return (
            <StatusPage
                status={this.props.editstatus.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    // this.onRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onRefresh();
                }}
            >
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
                    <ScrollView style={styles.content}>
                        {/*第一分部 维修项目名称 更换部件 维修情况描述*/}
                        <View style={styles.content1}>
                            <View style={[styles.item, { height: 54 }]}>
                                <Text style={styles.label}>仪器名称</Text>
                                <Text style={[styles.value, { width: 160, textAlign: 'right' }]} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {this.state.ItemName}
                                </Text>
                            </View>

                            <Text style={styles.line} />

                            <TouchableOpacity
                                onPress={() => {
                                    Picker.show();
                                }}
                            >
                                <View style={[styles.item, { height: 54 }]}>
                                    <Text style={styles.label}>更换部件</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.value}>{this.state.ChangeSpareparts == '' ? '请选择' : this.state.ChangeSpareparts}</Text>
                                        <Image style={{ width: 15, height: 15, marginLeft: 5 }} />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.line} />

                            <View style={styles.itemedit}>
                                <Text style={[styles.label]}>维修情况描述</Text>
                                <TextInput
                                    defaultValue={this.state.RepairDescription ? this.state.RepairDescription : ''}
                                    style={styles.textInput}
                                    onChangeText={text => {
                                        this.setState({ RepairDescription: text });
                                    }}
                                    underlineColorAndroid="transparent"
                                    placeholder="请输入维修情况描述"
                                    placeholderTextColor={'#999999'}
                                    multiline={true}
                                />
                            </View>
                        </View>

                        {/*第二分部 是否清理 维修情况总结*/}
                        <View style={styles.content2}>
                            <View style={styles.item}>
                                <Text style={styles.label}>站房是否清理</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
                                        onPress={() => {
                                            this.setState({ IsClear: '是' });
                                        }}
                                    >
                                        <Text style={styles.value}>是</Text>
                                        <Image
                                            style={{ width: 15, height: 15, marginLeft: 12 }}
                                            source={this.state.IsClear == '是' ? require('../../../../images/login_checkbox_on.png') : require('../../../../images/login_checkbox_off.png')}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
                                        onPress={() => {
                                            this.setState({ IsClear: '否' });
                                        }}
                                    >
                                        <Text style={styles.value}>否</Text>
                                        <Image
                                            style={{ width: 15, height: 15, marginLeft: 12 }}
                                            source={this.state.IsClear == '否' ? require('../../../../images/login_checkbox_on.png') : require('../../../../images/login_checkbox_off.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.line} />
                            <View style={styles.itemedit}>
                                <Text style={[styles.label]}>维修情况总结</Text>
                                <TextInput
                                    defaultValue={this.state.RepairSummary ? this.state.RepairSummary : ''}
                                    style={styles.textInput}
                                    onChangeText={text => {
                                        this.setState({ RepairSummary: text });
                                    }}
                                    underlineColorAndroid="transparent"
                                    placeholder="请填写维修状况总结"
                                    placeholderTextColor={'#999999'}
                                    multiline={true}
                                />
                            </View>
                        </View>

                        {/*第三部分*/}
                        <View style={styles.content3}>
                            {this.state.Completed ? (
                                <TouchableOpacity
                                    style={styles.del}
                                    onPress={() => {
                                        this.del();
                                    }}
                                >
                                    <Image style={{ width: 15, height: 15 }} source={require('../../../../images/ic_commit.png')} />
                                    <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>删除记录</Text>
                                </TouchableOpacity>
                            ) : null}

                            <TouchableOpacity
                                style={styles.commit}
                                onPress={() => {
                                    this.commit();
                                }}
                            >
                                <Image style={{ width: 15, height: 15 }} source={require('../../../../images/ic_commit.png')} />
                                <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>提交保存</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </StatusPage>
        );
    }
    initPicker = () => {
        let pickerData = [];
        this.props.EnumPart.map((item, index) => {
            pickerData.push(item.PartName);
        });
        if (pickerData.length == 0) {
            // this.props.dispatch(NavigationActions.back());
            ShowToast('没有可选配件，请在平台维护相关信息');
        } else {
            Picker.init({
                pickerTextEllipsisLen: 18,
                pickerData: pickerData,
                selectedValue: [pickerData[0]],
                pickerConfirmBtnText: '确定',
                pickerCancelBtnText: '取消',
                pickerTitleText: '部件选择',
                onPickerConfirm: data => {
                    this.setState({ ChangeSpareparts: data[0] });
                    Picker.hide();
                },
                onPickerCancel: data => {
                    Picker.hide();
                }
            });
        }
    };
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: SCREEN_HEIGHT - 75,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2'
    },
    content: {
        flexDirection: 'column',
        // alignItems:'center',
        paddingTop: 15,
        // paddingLeft: 13,
        // paddingRight: 13,
        width: SCREEN_WIDTH - 24,
        height: SCREEN_HEIGHT - 75
    },
    content1: {
        width: SCREEN_WIDTH - 24,
        paddingLeft: 27,
        paddingRight: 27,
        borderRadius: 2,
        backgroundColor: '#ffffff'
    },
    content2: {
        width: SCREEN_WIDTH - 24,
        marginTop: 18,
        paddingLeft: 27,
        paddingRight: 27,
        borderRadius: 2,
        backgroundColor: '#ffffff'
    },
    content3: {
        flex: 1,
        width: SCREEN_WIDTH - 24,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: '#00000000'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemedit: {
        paddingTop: 24,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },

    textInput: {
        marginTop: 24,
        marginBottom: 30,
        padding: 0,
        color: '#666666',
        textAlignVertical: 'top',
        textAlign: 'left'
    },

    label: {
        fontSize: 14,
        color: '#333333'
    },
    value: {
        fontSize: 14,
        color: '#666666'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#e7e7e7'
    },
    del: {
        marginTop: 10,
        width: 282,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ee9944',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    commit: {
        marginBottom: 15,
        marginTop: 10,
        width: 282,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4499f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

//make this component available to the app
export default RepairRecordEdit;
