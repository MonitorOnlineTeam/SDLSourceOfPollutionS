import React, { Component, PureComponent } from 'react';
import { TextInput, ScrollView, View, Text, StyleSheet, Platform, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native';
import { NavigationActions, createAction, SentencedToEmpty } from '../../../../utils';
import { connect } from 'react-redux';
import MyTextInput from '../../../../components/base/TextInput';
import globalcolor from '../../../../config/globalcolor';
import { StatusPage, ModalParent } from '../../../../components';
import Mask from '../../../../components/Mask';
import ConfirmDialog from '../components/ConfirmDialog';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 巡检记录 巡检记录
 * @class DataWarningView
 * @extends {PureComponent}
 */
@connect(
    ({ patrolRecordModel }) => ({
        List: patrolRecordModel.List,
        editstatus: patrolRecordModel.editstatus
    }),
    null,
    null,
    { withRef: true }
)
@connect()
class PatrolRecord extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: '巡检记录',
        tabBarLable: '巡检记录',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17 },
        headerStyle: { backgroundColor: globalcolor.headerBackgroundColor, height: 45 },
        labelStyle: { fontSize: 14 },
        headerRight: (
            <TouchableOpacity
                onPress={() => {
                    navigation.state.params.navigatePress();
                }}
            >
                <Text style={{ color: 'white', marginRight: 8 }}>删除</Text>
            </TouchableOpacity>
        )
    });

    static defaultProps = {
        List: [],
        editstatus: 200
    };

    constructor(props) {
        super(props);
        this.props.navigation.setParams({
            navigatePress: () => {
                this._modalParent.showModal();
            }
        });
    }

    componentDidMount() {
        this.onRefresh();
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    //刷新数据
    onRefresh = () => {
        this.props.dispatch(createAction('patrolRecordModel/getForm')({ params: {} }));
    };

    //提交本地的数据
    commit = () => {
        this.props.dispatch(createAction('patrolRecordModel/saveForm')({ params: {} }));
    };

    _deleteForm() {
        this.props.dispatch(createAction('patrolRecordModel/delForm')({})); //删除
    }

    // 返回
    back = () => {
        this.props.dispatch(NavigationActions.back());
    };
    render() {
        let data = this.props.List;
        return (
            <StatusPage
                style={styles.container}
                status={200}
                button={{
                    name: '重新加载',
                    callback: () => {
                        this.onRefresh();
                    }
                }}
            >
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} keyboardVerticalOffset={180} style={styles.container}>
                    <View style={styles.listContainer}>
                        <ScrollView style={styles.scroll}>
                            {data.map((item, index) => {
                                return (
                                    <View key={index + ''}>
                                        {/* 大项的标题 */}
                                        <Text style={styles.header}>{item.Parent}</Text>
                                        {/* 巡检项目 */}
                                        <View>
                                            {item.Child.map((child, key) => {
                                                return <Item key={key + ''} index={key} itemData={child} />;
                                            })}
                                        </View>
                                        {/* 备注 */}
                                        <ItemInput index={index} itemData={item} />
                                    </View>
                                );
                            })}
                            <Text style={styles.header}>异常处理情况</Text>
                            <ExceptionHandlingInput />
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.commit}
                            onPress={() => {
                                this.commit();
                            }}
                        >
                            <Image style={{ width: 15, height: 15 }} source={require('../../../../images/ic_commit.png')} />
                            <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>提交保存</Text>
                        </TouchableOpacity>

                        <ModalParent ref={ref => (this._modalParent = ref)}>
                            <Mask
                                hideDialog={() => {
                                    this._modalParent.hideModal();
                                }}
                                style={{ justifyContent: 'center' }}
                            >
                                <ConfirmDialog
                                    title={'确认'}
                                    description={'确认要删除巡检记录表？'}
                                    doPositive={() => {
                                        this._deleteForm();
                                        this._modalParent.hideModal();
                                    }}
                                    doNegative={() => {
                                        this._modalParent.hideModal();
                                    }}
                                />
                            </Mask>
                        </ModalParent>
                    </View>
                </KeyboardAvoidingView>
            </StatusPage>
        );
    }
}

/** 异常处理情况 */
@connect(
    ({ patrolRecordModel }) => ({
        MainInfo: patrolRecordModel.MainInfo
    }),
    null,
    null,
    { withRef: true }
)
class ExceptionHandlingInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {
        MainInfo: {}
    };

    componentWillMount() {
        this.setState({
            content: typeof this.props.MainInfo.ExceptionHandling == 'undefinded' ? '' : this.props.MainInfo.ExceptionHandling
        });
    }
    saveMainInfo = content => {
        this.props.dispatch(createAction('patrolRecordModel/saveMainInfo')({ params: { ExceptionHandling: content } }));
    };

    componentWillReceiveProps(nextProps) {
        if (this.state.content == '' && SentencedToEmpty(nextProps, ['MainInfo', 'ExceptionHandling'], '') != '') {
            this.setState({ content: SentencedToEmpty(nextProps, ['MainInfo', 'ExceptionHandling'], '') });
        }
    }

    render() {
        return (
            <View style={styles.editContainer}>
                <Text style={styles.editlabel}>异常处理情况</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => {
                        this.setState({ content: text });
                        this.saveMainInfo(text);
                    }}
                    underlineColorAndroid="transparent"
                    placeholder={'请输入异常处理情况'}
                    placeholderTextColor={'#999999'}
                    multiline={true}
                >
                    {this.state.content}
                </TextInput>
            </View>
        );
    }
}

/** 备注信息 */
@connect()
class ItemInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.setState({
            content: typeof this.props.itemData.Remark == 'undefinded' ? '' : this.props.itemData.Remark
        });
    }
    saveMainInfo = content => {
        switch (this.props.index) {
            case 0:
                Remark = { Remark1: content };
                break;
            case 1:
                Remark = { Remark2: content };
                break;
            case 2:
                Remark = { Remark3: content };
                break;
            case 3:
                Remark = { Remark4: content };
                break;
            case 4:
                Remark = { Remark5: content };
                break;
            case 5:
                Remark = { Remark6: content };
                break;
            case 6:
                Remark = { Remark7: content };
                break;
        }
        this.props.dispatch(createAction('patrolRecordModel/saveMainInfo')({ params: { ...Remark } }));
    };
    render() {
        return (
            <View style={styles.editContainer}>
                <Text style={styles.editlabel}>备注</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => {
                        this.setState({ content: text });
                        this.saveMainInfo(text);
                    }}
                    underlineColorAndroid="transparent"
                    placeholder={'请输入' + this.props.itemData.Parent + '的巡检备注'}
                    placeholderTextColor={'#999999'}
                    multiline={true}
                >
                    {this.state.content}
                </TextInput>
            </View>
        );
    }
}
/**
 * 是否正常
 * itemData={"ItemID":"32","ItemName":"日志是否查询（1）","MintenanceDescription":"是"
 * @class Item
 * @extends {PureComponent}
 */
@connect()
class Item extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        // console.log('props = ', props);
    }

    componentWillMount() {
        this.setState({
            YesOrNo: this.props.itemData.MintenanceDescription
        });
    }

    render() {
        return (
            <View style={styles.itemContainer}>
                {this.props.index == 0 ? null : <Text style={styles.line} />}
                <View style={styles.item}>
                    <Text style={styles.itemLeft}>{this.props.itemData.ItemName}</Text>
                    <View style={styles.itemRight}>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectYesOrNo('yes');
                            }}
                            style={styles.radio}
                        >
                            <Image style={styles.radioImage} source={this.getYesImage(this.state.YesOrNo)} />
                            <Text style={styles.radioText}>是</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectYesOrNo('no');
                            }}
                            style={[styles.radio, { marginLeft: 15 }]}
                        >
                            <Image style={styles.radioImage} source={this.getNoImage(this.state.YesOrNo)} />
                            <Text style={styles.radioText}>否</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * 点击yes或者no 并修改从表信息
     * @memberof Item
     */
    selectYesOrNo = whoPress => {
        let YesOrNo = '';
        if (whoPress == 'yes') {
            if (this.state.YesOrNo != '是') {
                YesOrNo = '是';
            }
        } else {
            if (this.state.YesOrNo != '否') {
                YesOrNo = '否';
            }
        }
        this.setState({ YesOrNo });

        //修改从表信息
        this.props.dispatch(
            createAction('patrolRecordModel/saveItem')({
                params: {
                    ItemID: this.props.itemData.ItemID,
                    ItemName: this.props.itemData.ItemName,
                    MintenanceDescription: YesOrNo
                }
            })
        );
    };

    /**
     * 根据是否 选择图片
     * @memberof Item
     */
    getYesImage = MintenanceDescription => {
        if (MintenanceDescription == '是') {
            return require('../../../../images/duihao.png');
        } else {
            return require('../../../../images/auditunslect.png');
        }
    };
    /**
     * 根据是否 选择图片
     * @memberof Item
     */
    getNoImage = MintenanceDescription => {
        if (MintenanceDescription == '否') {
            return require('../../../../images/cuohao.png');
        } else {
            return require('../../../../images/auditunslect.png');
        }
    };
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2'
    },
    listContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT - 75,
        flexDirection: 'column',
        alignItems: 'center'
    },
    scroll: {
        paddingLeft: 12,
        paddingRight: 12,
        width: SCREEN_WIDTH
    },
    itemContainer: {
        width: SCREEN_WIDTH - 24,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        paddingLeft: 27,
        paddingRight: 20
    },
    header: {
        fontSize: 12,
        color: '#666666',
        marginTop: 14,
        marginBottom: 6
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between'
    },
    itemLeft: {
        width: SCREEN_WIDTH - 175,
        fontSize: 14,
        color: '#333333',
        marginTop: 15
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 33
    },
    radio: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    radioImage: {
        width: 20,
        height: 20
    },
    radioText: {
        marginLeft: 9,
        fontSize: 14,
        color: '#666666'
    },
    line: {
        height: 1,
        backgroundColor: '#e7e7e7'
    },
    editContainer: {
        marginTop: 8,
        width: SCREEN_WIDTH - 24,
        paddingLeft: 27,
        paddingRight: 20,
        paddingTop: 24,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff'
    },
    editlabel: {
        fontSize: 14,
        color: '#333333'
    },
    textInput: {
        color: '#666666',
        marginTop: 24,
        marginBottom: 30,
        padding: 0,
        color: '#666666',
        textAlignVertical: 'top',
        textAlign: 'left'
    },
    commit: {
        marginTop: 10,
        marginBottom: 15,
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
export default PatrolRecord;
