//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, ScrollView, TextInput, LogBox } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import MyTextInput from '../../../../components/base/TextInput';
import { ModalParent, OperationAlertDialog, SimpleLoadingComponent, SDLText,PickerSingleTimeTouchable, } from '../../../../components';
import Mask from '../../../../components/Mask';
import ConfirmDialog from '../components/ConfirmDialog';
import { ShowToast, createAction, NavigationActions, SentencedToEmpty } from '../../../../utils';
import FormRangInput from '../components/FormRangInput';
import FormInput from '../components/FormInput';
import FormPicker from '../components/FormPicker';
import { accAdd, accSub, accMul, accDiv } from '../../../../utils/numutil'
import ImageGrid from '../../../../components/form/images/ImageGrid';
import TimeoutService from '../../../../pOperationContainers/tabView/chengTaoXiaoXi/TimeoutService';
const ic_filt_arrows = require('../../../../images/ic_filt_arrows.png');
const saveItem = 0;
const deleteItem = 1;
const rangSeparator = '-';
import moment from 'moment';

/**
 * 校准记录表 淄博 废水
 */

// create a component
@connect(({ calibrationRecordZbFs }) => ({
    RecordList: calibrationRecordZbFs.RecordList,
    editstatus: calibrationRecordZbFs.editstatus,
    JzConfigItemSelectedList: calibrationRecordZbFs.JzConfigItemSelectedList,
}))
// @connect() 
class CalibrationRecordEditZbFs extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerMode: 'float',
            title: navigation.state.params.item.ItemID + '校准记录表',
            tabBarLable: '校准记录表',
            animationEnabled: false,
            headerBackTitle: null,
            headerTintColor: '#ffffff',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS == 'android' ? 75 : 13 }, //标题居中
            headerStyle: {
                backgroundColor: globalcolor.headerBackgroundColor,
                height: 45
            }
        };
    };
    // ItemID :  "COD"
    // ItemId: "800"
    constructor(props) {
        super(props);
        const item = props.route.params.params.item;
        this.state = {
            ID: item.ID || '',
            FormMainID: item.FormMainID || '',
            ItemId: item.ItemId || '',  // 保持在 state 中
            ItemID: item.ItemID || '',  // 用于显示
            ItemName: item.ItemName || '',
            lastJZTime: item.LastJZTime || moment().format('YYYY-MM-DD HH:mm:ss'),
            newJZTime: item.NewJZTime ||  moment().format('YYYY-MM-DD HH:mm:ss'),
            jzcsmc: item.JZCSMC || '',
            zxjzcsz: item.ZXJZCSZ || '',
            Remark: item.Remark || '',
        };

        this.props.navigation.setOptions({
            title: item.ItemID + '校准记录表',
        });

    }
    componentWillMount() {
        const item = this.props.route.params.params.item;
        const { ItemId } = item;
        let pic1Name;
        pic1Name = 'YQZXJZRQXXHCSZ';
            this.setState({
                pic1Name,
                [pic1Name]: item?.[pic1Name + '_PIC']?.AttachID || new Date().getTime() + pic1Name?.toLowerCase(),
                [pic1Name + '_PIC']: item?.[pic1Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],

            })
        
  
    }


    _renderModal = () => {
        return (
            <ModalParent ref={ref => (this._modalParent = ref)}>
                <Mask
                    hideDialog={() => {
                        this._modalParent.hideModal();
                        this.setState({ doConfirm: false });
                    }}
                    style={{ justifyContent: 'center' }}
                >
                    <ConfirmDialog
                        title={'确认'}
                        description={this.state.dialogType == deleteItem ? '确认删除该校准记录吗？' : '确认提交' + this.props.route.params.params.item.ItemID + '校准记录吗？'}
                        doPositive={() => {
                            //dialog确定
                            if (this.state.dialogType == deleteItem) {
                                //删除记录
                                this.props.dispatch(createAction('calibrationRecordZbFs/updateState')({
                                    jzDeleteResult: { status: -1 }
                                }));
                                this.props.dispatch(createAction('calibrationRecordZbFs/deleteJzItem')({
                                    params: { ID: SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'ID'], 'empty') },
                                    callback: () => {
                                        let index = this.props.JzConfigItemSelectedList.findIndex((seletedItem, selectedIndex) => {
                                            if (seletedItem.ItemID
                                                == SentencedToEmpty(this.props
                                                    , ['route', 'params', 'params', 'item', 'ItemID'], '')) {
                                                return true;
                                            }
                                        });
                                        if (index != -1) {
                                            let newData = this.props.JzConfigItemSelectedList.concat([]);
                                            newData.splice(index, 1);
                                            this.props.dispatch(createAction('calibrationRecordZbFs/updateState')({
                                                JzConfigItemSelectedList: newData, liststatus: { status: -1 }, JzConfigItemResult: { status: -1 },
                                            }));
                                        }
                                        this.props.dispatch(NavigationActions.back());
                                        this.props.dispatch(createAction('calibrationRecordZbFs/getJzItem')({}));
                                    }
                                }));
                            } else {
                                this.props.dispatch(
                                    createAction('calibrationRecordZbFs/saveItem')({
                                        index: this.props.route.params.params.index,
                                        record: this.state,
                                        callback: () => {
                                            this.props.dispatch(createAction('calibrationRecordZbFs/getInfo')({ createForm: false }));
                                            this._modalParent.hideModal();
                                            this.props.dispatch(NavigationActions.back());
                                        }
                                    })
                                );
                            }
                        }}
                        doNegative={() => {
                            //dialog取消
                            this._modalParent.hideModal();
                            this.setState({ doConfirm: false, willingAddForm: {} });
                        }}
                    />
                </Mask>
            </ModalParent>
        );
    };

    /**
     * 判断数字是否存在异常
    */
    testNumberException = (param) => {
        // 处理 undefined 和 null
        if (param === undefined || param === null) {
            return true;
        }
        // 处理空字符串
        if (param === '') {
            return true;
        }
        // 转换为数字
        let sample = Number(param);
        // 检查是否为 NaN
        if (isNaN(sample)) {
            return true;
        }
        // 检查是否为有效的数字格式（整数或小数）
        if (!(/^-?[0-9]+$/.test(param) || /^-?[0-9]+\.?[0-9]+?$/.test(param))) {
            return true;
        }
        return false;
    };



    upLoadImg = (label, id) => {
        return <View>
            <View key={id} style={styles.imageUploadContainer}>
                <ImageGrid
                    componentType={'taskhandle'}
                    style={{
                        backgroundColor: '#fff',
                    }}
                    Imgs={this.state[id + '_PIC']}
                    isUpload={true}
                    isDel={true}
                    UUID={this.state[id]}
                    uploadCallback={items => {
                        console.log('items', items);
                        let newImgList = [...this.state[id + '_PIC']];
                        items.map(imageItem => {
                            newImgList.push(imageItem);
                        });
                        this.setState({ [id + '_PIC']: newImgList });
                    }}
                    delCallback={index => {
                        let newImgList = [...this.state[id + '_PIC']];
                        newImgList.splice(index, 1);
                        this.setState({ [id + '_PIC']: newImgList });
                    }}
                />
            </View>
        </View>
    }
    getTimeSelectOption = (par) => {
        return {
            defaultTime: SentencedToEmpty(this.state, [par], moment().format('YYYY-MM-DD HH:mm')),
            type: 'minute',
            onSureClickListener: time => {
                this.setState({
                    [par]: moment(time).format('YYYY-MM-DD HH:mm:ss')
                })
               
            }
        };
    };
    render() {
        let Item = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        let ItemId = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'ItemId'], '');
  

        const { pic1Name,} = this.state
        return (
            <View style={styles.container}>
                {/* <KeyboardAwareScrollView> */}
                <ScrollView style={[{ width: SCREEN_WIDTH, flex: 1 }]} showsVerticalScrollIndicator={false}>
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center' }]}>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 24,
                                    paddingHorizontal: 24,
                                    borderRadius: 2,
                                    backgroundColor: globalcolor.white
                                }
                            ]}
                        >
                             <View style={[styles.layoutWithBottomBorder]}>
                             <Text style={[styles.labelStyle]}>上次校准日期：</Text>
                             <PickerSingleTimeTouchable option={this.getTimeSelectOption('lastJZTime')} style={{ flexDirection: 'row', height: 45, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ fontSize: 14, color: '#666' }}>{SentencedToEmpty(this.state, ['lastJZTime'], moment().format('YYYY-MM-DD HH:mm'))}</Text>
                                    <Image style={{ width: 10, height: 10, marginLeft: 4 }} source={ic_filt_arrows} />
                                </PickerSingleTimeTouchable>
                            </View>
                            <View style={[styles.layoutWithBottomBorder]}>
                            <Text style={[styles.labelStyle]}>最近校准日期：</Text>
                             <PickerSingleTimeTouchable option={this.getTimeSelectOption('newJZTime')} style={{ flexDirection: 'row', height: 45, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ fontSize: 14, color: '#666' }}>{SentencedToEmpty(this.state, ['newJZTime'], moment().format('YYYY-MM-DD HH:mm'))}</Text>
                                    <Image style={{ width: 10, height: 10, marginLeft: 4 }} source={ic_filt_arrows} />
                                </PickerSingleTimeTouchable>
                            </View>
                            <View
                               style={[styles.layoutWithBottomBorder]}
                            >
                                 <Text style={[styles.labelStyle]}>标准参数名称：</Text>
                                 <MyTextInput
                                           
                                            value={this.state.jzcsmc}
                                            ref={ref => (this._inputNewMachineHaltReason = ref)}
                                            style={[styles.textStyle, { flex: 1 }]}
                                            placeholder={'请填写标准参数名称'}
                                            onChangeText={text => {
                                                // 动态更新组件内State记录
                                                this.setState({
                                                    jzcsmc: text
                                                });
                                            }}
                                        />
                            </View>
                            
                            <View style={[styles.layoutWithBottomBorder]}>
                                        <Text style={[styles.labelStyle]}>最新校准参数：</Text>
                                        <MyTextInput
                                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                            value={this.state.zxjzcsz}
                                            ref={ref => (this._inputNewMachineHaltReason = ref)}
                                            style={[styles.textStyle, { flex: 1 }]}
                                            placeholder={'请填写最新校准参数'}
                                            onChangeText={text => {
                                                // 动态更新组件内State记录
                                                this.setState({
                                                    zxjzcsz: text
                                                });
                                            }}
                                        />
                                    </View> 
                    
                            </View>
                        
                        <View style={[
                            {
                                width: SCREEN_WIDTH - 24,
                                paddingHorizontal: 24,
                                borderRadius: 2,
                                backgroundColor: globalcolor.white,
                                marginTop: 10
                            }
                        ]}>
                            <View style={[styles.lastItem]}>
                                <Text style={[styles.labelStyle]}>情况说明：</Text>
                                <MyTextInput
                                    value={this.state.Remark}
                                    ref={ref => (this._inputMachineHaltReason = ref)}
                                    style={[styles.textStyle, { flex: 1 }]}
                                    placeholder={'请填写情况说明'}
                                    multiline={true}
                                    numberOfLines={2}
                                    onChangeText={text => {
                                        // 动态更新组件内State记录
                                        this.setState({
                                            Remark: text
                                        });
                                    }}
                                />
                            </View>
                        </View>
                        <View style={[
                        {
                            width: SCREEN_WIDTH - 24,
                            paddingHorizontal: 24,
                            borderRadius: 2,
                            backgroundColor: globalcolor.white,
                            marginTop: 10,
                            paddingTop:16,
                            paddingBottom:8,
                        }
                    ]}>
                        {
                         [{ label: '仪器最新校准日期信息和参数值', picName: pic1Name }].map(item => {
                            return this.upLoadImg(item.label, item.picName)
                        })
                    }

                    </View >
                    </View >
                 
                </ScrollView >
                {/* </KeyboardAwareScrollView> */}
                {
                    this.props.route.params.params.index != -1 &&
                        this.props.route.params.params.item.FormMainID  ? (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: globalcolor.orange }, { marginVertical: 10 }]}
                                onPress={() => {
                                    this.setState({ dialogType: deleteItem });
                                    this._modalParent.showModal();
                                }}
                            >
                                <View style={styles.button}>
                                    <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                                    <Text style={[{ color: globalcolor.whiteFont, fontSize: 20, marginLeft: 8 }]}>删除记录</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null
                }
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: globalcolor.blue }, { marginVertical: 20 }]}
                    onPress={() => {
                  
                        let imgFiles = {}
                
                            imgFiles = {
                                yqzxjzrqxxhcsz: this.state[pic1Name],

                            }
                            if (!this.state[pic1Name + '_PIC']?.length) { ShowToast('仪器最新校准日期信息和参数值不能为空'); return }
                         

                        


                        // 构造提交数据
                        const submitData = [{
                            ID: this.state.ID,
                            FormMainID: this.state.FormMainID,
                            // ItemID: this.state.ItemID,
                            // ItemId: this.state.ItemId,
                            itemID: this.state.ItemID,
                            ItemName: this.state.ItemName,
                            lastJZTime: this.state.lastJZTime,
                            newJZTime: this.state.newJZTime,
                            jzcsmc: this.state.jzcsmc,
                            zxjzcsz: this.state.zxjzcsz,
                            remark: this.state.Remark,
                            ...imgFiles
                        }]
                         console.log(submitData,'62222')
                        this.props.dispatch(
                            createAction('calibrationRecordZbFs/saveItem')({
                                index: this.props.route.params.params.index,
                                record: submitData,
                                callback: () => {
                                    this.props.dispatch(createAction('calibrationRecordZbFs/updateState')({
                                        liststatus: { status: -1 }
                                    }));
                                    this.props.dispatch(createAction('calibrationRecordZbFs/getJzItem')({}));
                                    this.props.dispatch(NavigationActions.back());
                                }
                            })
                        );
                    }}
                >
                    <View style={styles.button}>
                        <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                        <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>确定提交</Text>
                    </View>
                </TouchableOpacity>
                {this._renderModal()}
                {this.props.editstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.editstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}


            </View >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey
    },
    layoutWithBottomBorder: {
        flexDirection: 'row',
        height: 45,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
        alignItems: 'center'
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.taskImfoLabel
    },
    touchable: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 14,
        color: globalcolor.taskFormLabel,
        flex: 1
    },
    timeIcon: {
        tintColor: globalcolor.blue,
        height: 16,
        width: 18
    },
    button: {
        flexDirection: 'row',
        height: 46,
        width: 282,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    },
    lastItem: {
        flexDirection: 'row',
        height: 45,
        marginBottom: 10,
        alignItems: 'center'
    }
});

//make this component available to the app
export default CalibrationRecordEditZbFs;
