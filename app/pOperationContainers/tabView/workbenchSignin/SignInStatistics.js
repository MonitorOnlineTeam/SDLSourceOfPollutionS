/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-02-01 11:02:45
 * @LastEditTime: 2025-01-03 09:20:02
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/tabView/workbenchSignin/SignInStatistics.js
 */
import {
    Animated, Image, Modal, PanResponder, Platform, ScrollView
    , Text, TouchableOpacity, View, Easing
} from 'react-native'
import React, { Component } from 'react'
import moment from 'moment';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { SentencedToEmpty, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import { connect } from 'react-redux';
import CalendarPicker from 'react-native-calendar-picker';
import { getEncryptData } from '../../../dvapack/storage';
import { IMAGE_DEBUG, ImageUrlPrefix } from '../../../config';
import ImageViewer from 'react-native-image-zoom-viewer';


// const calenderComponentHeight = 300;
const calenderComponentHeight = 280;
const SWIPE_LEFT = 'SWIPE_LEFT';
const SWIPE_RIGHT = 'SWIPE_RIGHT';
const formatStr = 'YYYY-MM-DD';

@connect(({ signInModel }) => ({
    calenderData: signInModel.calenderData,
    ctSignInHistoryListResult: signInModel.ctSignInHistoryListResult,
    calenderCurrentMonth: signInModel.calenderCurrentMonth,
    calenderSelectedDate: signInModel.calenderSelectedDate,
    calenderDataObject: signInModel.calenderDataObject
}))
export default class SignInStatistics extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '统计',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            isExpanded: true,  // 使用布尔值来控制展开状态
            calendarHeight: new Animated.Value(calenderComponentHeight),
            panResponder: {},
            hideCalendar: false,
            calenderOpacity: 1,
            startPosition: 0,
            selectedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            listType: 0,
            largImage: [],
            index: 0,
            modalVisible: false,
            isAnimating: false  // 添加动画状态标记
        };
    }

    componentDidMount() {
        this.props.dispatch(
            createAction('signInModel/updateState')({
                calenderSelectedDate: moment().format('YYYY-MM-DD'),
                calenderCurrentMonth: moment().format('YYYY-MM-DD')
            })
        );
        this.props.dispatch(
            createAction('signInModel/getSignInHistoryList')({
                params: {
                    // SignWorkType: this.state.listType == 0 ? 60 : 61,
                    RecordDate: moment().format('YYYY-MM-DD')
                },
                callback: result => { }
            })
        );

        let panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                //是否成为响应者
                return true;
            },
            onPanResponderGrant: () => {
                //开始手势操作
                // console.log('this.state.calendarHeight._value = ', this.state.calendarHeight._value);
                // console.log('this.state.calendarHeight._offset = ', this.state.calendarHeight._offset);
                //是Animated的方法
                this.setState({ startPosition: this.state.calendarHeight._offset });
                this.state.calendarHeight.setOffset(this.state.calendarHeight._offset);
            },
            onPanResponderMove: (e, gestureState) => {
                let newData = this.state.calendarHeight;
                let abc = -(gestureState.y0 - gestureState.moveY);
                let realValue = 0;
                if (abc > 0) {
                    realValue = -calenderComponentHeight + abc;
                } else {
                    if (this.state.startPosition >= 0) {
                        realValue = abc;
                    } else {
                        realValue = newData._offset + abc;
                        if (realValue > -calenderComponentHeight) {
                            realValue = calenderComponentHeight;
                        } else {
                            realValue = newData._offset + abc;
                        }
                    }
                }
                newData.setOffset(realValue);
                if (newData._offset == -calenderComponentHeight && abc < 0) {
                } else if (realValue <= 0) {
                    this.setState({
                        calendarHeight: newData
                    });
                }
            },
            onPanResponderRelease: () => {
                let newData = this.state.calendarHeight;
                if (this.state.calendarHeight._offset < -200) {
                    newData.setOffset(-newData._value);
                    this.setState({
                        calendarHeight: newData,
                        hideCalendar: true
                    });
                } else {
                    newData.setOffset(calenderComponentHeight - newData._value);
                    this.setState({
                        calendarHeight: newData,
                        hideCalendar: false
                    });
                }
            }
        });
        this.setState({ panResponder: panResponder });
    }

    getLocationInfo = (item) => {
        const signType = SentencedToEmpty(item, ['signType'], '');
        if (this.state.listType == 0) {
            // 现场
            return SentencedToEmpty(item, ['entName'], '');
        } else if (this.state.listType == 1) {
            // 非现场
            return SentencedToEmpty(item, ['address'], '');
        } else {
            return '';
        }
    }

    getWorkTypeColor = (workType) => {
        if (workType == 572) {
            // 非驻厂运维
            return '#FFA415'
        } else if (workType == 573) {
            // 驻厂白班
            return '#5061F7'
        } else if (workType == 574) {
            // 驻厂夜班
            return '#FF4747'
        }
        // return '#FF4747'
        return '#999999'
    }

    getTag = (tagType) => {

        /**
         * 572  非驻厂运维
         * 573  驻厂白班
         * 574  驻厂夜班
         * 
         * 非现场
         * 575  环保局/监测站
         * 576  拜访客户
         * 577  现场检查
         * 578  总部/办事处
         * 581  其他
         */
        // #FFA415
        let _color = '#FFA415', tagTypeStr = '未知';
        if (tagType == 572) {
            _color = '#28DB96';
            tagTypeStr = '非驻厂';
        } else if (tagType == 573) {
            _color = '#4F6BF8';
            tagTypeStr = '白班';
        } else if (tagType == 574) {
            _color = '#FF4747';
            tagTypeStr = '夜班';
        } else if (tagType == 575
            || tagType == 576
            || tagType == 577
            || tagType == 578
            || tagType == 581
            || tagType == 706
            || tagType == 713
        ) {
            _color = '#FFA415';
            tagTypeStr = '非现场';
        } else if (tagType == 0) {
            _color = '#4F6BF8';
            tagTypeStr = '现场';
        }
        return (<View style={{ flexDirection: 'row', width: 44, height: 16 }}>
            <View
                style={[{
                    height: 0, width: 0
                    , borderLeftWidth: 2, borderRightWidth: 2
                    , borderTopWidth: 8, borderBottomWidth: 8
                    , borderLeftColor: 'transparent', borderRightColor: _color
                    , borderTopColor: 'transparent', borderBottomColor: _color
                }]}
            ></View>
            <View
                style={[{
                    height: 16, flex: 1
                    , backgroundColor: _color
                    , justifyContent: 'center', alignItems: 'center'
                }]}
            >

                <Text
                    style={[{
                        color: 'white', fontSize: 8
                        , padding: 0, lineHeight: 10
                    }]}
                >{`${tagTypeStr}`}</Text>
            </View>
            <View
                style={[{
                    height: 0, width: 0
                    , borderLeftWidth: 2, borderRightWidth: 2
                    , borderTopWidth: 8, borderBottomWidth: 8
                    , borderLeftColor: _color, borderRightColor: 'transparent'
                    , borderTopColor: _color, borderBottomColor: 'transparent'
                }]}
            ></View>
        </View>);
    }

    getSignInTypeStr = (signInType) => {
        // 签到CheckType=1 签退CheckType=2  
        if (signInType == 1) {
            return '签到';
        } else if (signInType == 2) {
            return '签退'
        } else {
            return '未知'
        }
    }

    signTime = (item) => {
        let baseString = SentencedToEmpty(item, ['signTime'], '');
        if (baseString == '') {
            return '--:--';
        } else {
            let tagMoment = moment(baseString);
            if (tagMoment.isValid()) {
                return tagMoment.format('HH:mm');
            } else {
                return '--:--';
            }
        }
    }

    renderLineItem = (item, index, length = 0) => {
        /**
         * 572  非驻厂运维
         * 573  驻厂白班
         * 574  驻厂夜班
         * 
         * 非现场
         * 575  环保局/监测站
         * 576  拜访客户
         * 577  现场检查
         * 578  总部/办事处
         * 581  其他
         */
        const workType = item.workType;
        if (workType == 575
            || workType == 576
            || workType == 577
            || workType == 578
            || workType == 581) {
            return (<View
                style={[{
                    width: SCREEN_WIDTH - 20, height: 142
                    , paddingVertical: 15, paddingHorizontal: 15
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white'
                    , marginBottom: 5, borderRadius: 5
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 50, flexDirection: 'row'
                        , alignItems: 'center'
                    }]}
                >
                    {
                        this.getTag(item.workType)
                    }
                    <Text
                        style={[{
                            fontSize: 14, color: '#000028'
                        }]}
                    >{this.signTime(item)}</Text>

                    <Text
                        style={[{
                            fontSize: 14, color: '#000028'
                        }]}
                    >{this.getSignInTypeStr(SentencedToEmpty(item, ['signType'], -1))}</Text>
                    <Text
                        numberOfLines={1}
                        style={[{
                            fontSize: 14, color: '#000028'
                            , marginLeft: 8, width: SCREEN_WIDTH - 192
                        }]}
                    >{SentencedToEmpty(item, ['placeName'], '')}</Text>
                </View>
                <Text
                    style={[{
                        fontSize: 13, color: '#666666'
                    }]}
                >{'地址'}</Text>
                <Text
                    style={[{
                        fontSize: 13, color: '#333333'
                    }]}
                >{SentencedToEmpty(item, ['address'], '')}</Text>
                <Text
                    style={[{
                        fontSize: 13, color: '#666666'
                    }]}
                >{'工作类型'}</Text>
                <Text
                    style={[{
                        fontSize: 13, color: '#333333'
                    }]}
                >{SentencedToEmpty(item, ['workTypeName'], '')}</Text>
            </View>);
        } else {
            return (<View
                style={[{
                    width: SCREEN_WIDTH - 20, height: 142
                    , paddingVertical: 15, paddingHorizontal: 15
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white'
                    , marginBottom: 5, borderRadius: 5
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 50, flexDirection: 'row'
                        , alignItems: 'center'
                    }]}
                >
                    {
                        this.getTag(item.workType)
                    }
                    <Text
                        style={[{
                            fontSize: 14, color: '#000028'
                        }]}
                    >{this.signTime(item)}</Text>

                    <Text
                        style={[{
                            fontSize: 14, color: '#000028'
                        }]}
                    >{this.getSignInTypeStr(SentencedToEmpty(item, ['signType'], -1))}</Text>
                    {/* <Text
                        numberOfLines={1}
                        style={[{
                            fontSize: 14, color: '#000028'
                            , marginLeft: 8
                        }]}
                    >{SentencedToEmpty(item, ['Position'], '')}</Text> */}

                </View>
                <Text
                    style={[{
                        fontSize: 13, color: '#666666'
                    }]}
                >{'企业'}</Text>
                <Text
                    numberOfLines={1}
                    style={[{
                        fontSize: 13, color: '#333333'
                    }]}
                >{`${SentencedToEmpty(item, ['entName'], '------')}`}</Text>
                <TouchableOpacity
                    onPress={() => {
                        let ImgNameList = SentencedToEmpty(item, ['file'], []);
                        if (ImgNameList.length == 0) {
                            ShowToast('未上传图片');
                        } else {
                            const ProxyCode = getEncryptData();
                            let largImage = [];
                            ImgNameList.map((innerItem, key) => {
                                largImage.push({
                                    url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${innerItem.FileName}`
                                        : `${ImageUrlPrefix}${ProxyCode}/${innerItem.FileName}`,
                                    AttachID: item
                                });
                            });
                            this.setState({
                                largImage
                            }, () => {
                                this.setState({
                                    modalVisible: true,
                                    index: 0
                                });
                            });
                        }
                    }}
                >
                    <Text
                        style={[{
                            fontSize: 13, color: '#666666'
                        }]}
                    >{'签到图片'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let ImgNameList = SentencedToEmpty(item, ['file'], []);
                        if (ImgNameList.length == 0) {
                            ShowToast('未上传图片');
                        } else {
                            const ProxyCode = getEncryptData();
                            let largImage = [];
                            ImgNameList.map((innerItem, key) => {
                                largImage.push({
                                    url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${innerItem.FileName}`
                                        : `${ImageUrlPrefix}${ProxyCode}/${innerItem.FileName}`,
                                    AttachID: item.FileName
                                });
                            });
                            this.setState({
                                largImage
                            }, () => {
                                this.setState({
                                    modalVisible: true,
                                    index: 0
                                });
                            });
                        }
                    }}
                >
                    <Text
                        style={[{
                            fontSize: 13, color: '#333333'
                        }]}
                    >{`${SentencedToEmpty(item, ['file'], []).length}张`}</Text>
                </TouchableOpacity>
                <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                    <ImageViewer
                        saveToLocalByLongPress={false}
                        menuContext={{ saveToLocal: '保存图片', cancel: '取消' }}
                        onClick={() => {
                            {
                                this.setState({
                                    modalVisible: false
                                });
                            }
                        }}
                        onSave={url => {
                            this.savePhoto(this.state.largImage[0].url);
                        }}
                        imageUrls={this.state.largImage}
                        // index={0}
                        index={this.state.index}
                    />
                </Modal>
            </View>);
        }
    };

    // renderLineItem = (item, index, length = 0) => {
    //     return (
    //         <View
    //             style={[
    //                 {
    //                     width: SCREEN_WIDTH - 40,
    //                     height: 60,
    //                     flexDirection: 'row'
    //                 }
    //             ]}
    //         >
    //             <View
    //                 style={[
    //                     {
    //                         width: 26,
    //                         height: 60,
    //                         alignItems: 'center'
    //                     }
    //                 ]}
    //             >
    //                 {index != 0 ? (
    //                     <View
    //                         style={[
    //                             {
    //                                 width: 1,
    //                                 height: 10,
    //                                 marginBottom: 6,
    //                                 backgroundColor: '#EAEAEA'
    //                             }
    //                         ]}
    //                     />
    //                 ) : (
    //                     <View
    //                         style={[
    //                             {
    //                                 width: 1,
    //                                 height: 10,
    //                                 marginBottom: 6
    //                             }
    //                         ]}
    //                     />
    //                 )}
    //                 <View style={[{
    //                     width: 6, height: 6, borderRadius: 3, backgroundColor: this.getWorkTypeColor(
    //                         SentencedToEmpty(item, ['workType'], ''))
    //                 }]} />
    //                 {index != length - 1 ? (
    //                     <View
    //                         style={[
    //                             {
    //                                 width: 1,
    //                                 height: 32,
    //                                 marginTop: 6,
    //                                 backgroundColor: '#EAEAEA'
    //                             }
    //                         ]}
    //                     />
    //                 ) : null}
    //             </View>

    //             <View style={[{
    //                 width: SCREEN_WIDTH - 66, height: 60
    //             }]}>
    //                 <View style={[{
    //                     width: SCREEN_WIDTH - 66,
    //                     flexDirection: 'row',
    //                     alignItems: 'center',
    //                     marginTop: 10,
    //                 }]}>
    //                     <Text numberOfLines={1} style={[{ maxWidth: SCREEN_WIDTH - 140, fontSize: 14, color: '#000028' }]}>{
    //                         `${item.signTypeName}(${item.workTypeName})：${moment(item.signTime).format('HH:mm')}`
    //                     }
    //                     </Text>
    //                     {
    //                         //exceptType 1 签到  2 补签
    //                         // 补签才有审批
    //                         item.exceptType == 2 ? <Text
    //                             style={[{
    //                                 marginLeft: 8, width: 60,
    //                                 fontSize: 10,
    //                                 color: (() => {
    //                                     // 待审批 0  审批通过 2 审批未通过 3
    //                                     if (item.AuditStatus == 0) {
    //                                         return '#4AA0FF';
    //                                     } else if (item.AuditStatus == 2) {
    //                                         return '#3AD583';
    //                                     } else if (item.AuditStatus == 3) {
    //                                         return '#FF4141';
    //                                     } else {
    //                                         return 'white';
    //                                     }
    //                                 })(),
    //                             }]}
    //                         >
    //                             {(() => {
    //                                 // 待审批 0  审批通过 2 审批未通过 3
    //                                 if (item.AuditStatus == 0) {
    //                                     return '待审批';
    //                                 } else if (item.AuditStatus == 2) {
    //                                     return '审批通过';
    //                                 } else if (item.AuditStatus == 3) {
    //                                     return '审批未通过';
    //                                 } else {
    //                                     return null;
    //                                 }
    //                             })()}
    //                         </Text> : null}
    //                 </View>

    //                 <View style={[{
    //                     flexDirection: 'row', width: SCREEN_WIDTH - 66
    //                     , height: 28, marginTop: 4
    //                 }]}>
    //                     <Image
    //                         style={[{ width: 10, height: 10, marginTop: 4 }]}
    //                         source={require('../../../images/icon_location.png')} />
    //                     <Text
    //                         numberOfLines={2}
    //                         style={[{ fontSize: 11, color: '#666666', lineHeight: 15 }]}
    //                     >
    //                         {`${this.getLocationInfo(item)}`}
    //                     </Text>
    //                 </View>
    //             </View>
    //         </View >
    //     );
    // };

    showCalenderFun = (nextFun = () => { }) => {
        if (this.state.calendarHeight._value == calenderComponentHeight) {
            this.setState({ hideCalendar: true, calenderOpacity: 0 }, () => {
                nextFun();
            });
        } else if (this.state.calendarHeight._value == 0) {
            this.setState({ hideCalendar: false }, () => {
                nextFun();
            });
        }
    };

    onDateChange = (date) => {
        this.props.dispatch(createAction('signInModel/updateState')({
            calenderSelectedDate: date.format('YYYY-MM-DD')
        }));
    }
    onSwipe = (gestureName, gestureState) => {
        switch (gestureName) {
            case SWIPE_LEFT:
                this.nextDateFun();
                break;
            case SWIPE_RIGHT:
                this.previousDateFun();
                break;
        }
    };

    nextDateFun = () => {
        let nextDate = moment(this.props.calenderCurrentMonth).add(1, 'months');
        let selectedDate = nextDate.format("YYYY-MM-01");
        if (nextDate.format('MM') == moment().format('MM')) {
            selectedDate = moment().format('YYYY-MM-DD');
        }
        let showDate = nextDate.format(formatStr);
        let newCalendarDate = nextDate.format('YYYY-MM-01 HH:mm:ss');
        this.setState({ showDate });
        this.CalendarPicker.handleOnPressNext();
        this.props.dispatch(
            createAction('signInModel/updateState')({
                calenderSelectedDate: selectedDate,
                calenderCurrentMonth: nextDate,
            })
        );
        this.CalendarPicker.resetSelections();
        this.props.dispatch(createAction('signInModel/getSignInHistoryList')({
            params: {
                // SignWorkType: this.state.listType == 0 ? 60 : 61,
                'RecordDate': nextDate.format('YYYY-MM-DD')
            }
            , callback: (result) => {

            }
        }));
    }

    previousDateFun = () => {
        let previousDate = moment(this.props.calenderCurrentMonth).subtract(1, 'months');
        let selectedDate = previousDate.format("YYYY-MM-01");
        if (previousDate.format('MM') == moment().format('MM')) {
            selectedDate = moment().format('YYYY-MM-DD');
        }
        let showDate = previousDate.format(formatStr);
        let newCalendarDate = previousDate.format('YYYY-MM-01 HH:mm:ss');
        this.setState({ showDate });
        this.CalendarPicker.handleOnPressPrevious();
        this.props.dispatch(
            createAction('signInModel/updateState')({
                calenderSelectedDate: selectedDate,
                calenderCurrentMonth: previousDate
            })
        );
        this.CalendarPicker.resetSelections();
        this.props.dispatch(createAction('signInModel/getSignInHistoryList')({
            params: {
                // SignWorkType: this.state.listType == 0 ? 60 : 61,
                'RecordDate': previousDate.format('YYYY-MM-DD')
            }
            , callback: (result) => {

            }
        }));
    }

    getMonthAndDate = () => {
        if (this.props.calenderSelectedDate == '') {
            return moment(this.props.calenderCurrentMonth).format('MM')
        } else {
            return moment(this.props.calenderSelectedDate).format('MM.DD')
        }
    }

    getText = () => {
        if (this.props.calenderSelectedDate == '') {
            return '';
        } else {
            return SentencedToEmpty(this.props
                , ['calenderDataObject', this.props.calenderSelectedDate, 'msg'], '')
        }
    }

    getList = () => {
        if (this.props.calenderSelectedDate == '') {
            return [];
        } else {
            return SentencedToEmpty(this.props
                , ['calenderDataObject', this.props.calenderSelectedDate, 'signInfo'], [])
        }
    }

    handleCalendarToggle = () => {
        if (this.state.isAnimating) return;  // 如果正在动画中，直接返回

        this.setState({ isAnimating: true });  // 设置动画状态

        const isExpanded = this.state.calendarHeight._value === calenderComponentHeight;
        const toValue = isExpanded ? 0 : calenderComponentHeight;

        // 先更新 hideCalendar 状态
        this.showCalenderFun(() => {
            Animated.spring(
                this.state.calendarHeight,
                {
                    toValue,
                    useNativeDriver: false,  // Animated.Value 不支持原生驱动
                    friction: 8,  // 添加摩擦力，使动画更流畅
                    tension: 40  // 降低张力，使动画更平滑
                }
            ).start(({ finished }) => {
                // 动画完成后的回调
                if (finished) {
                    this.setState({
                        calenderOpacity: isExpanded ? 0 : 1,
                        isAnimating: false  // 重置动画状态
                    });
                }
            });
        });
    };

    // 简化展开/收起的处理方法
    toggleCalendar = () => {
        const toValue = this.state.isExpanded ? 0 : calenderComponentHeight;

        // 立即更新状态
        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded,
            hideCalendar: prevState.isExpanded
        }));

        // 执行动画
        Animated.timing(this.state.calendarHeight, {
            toValue,
            duration: 300,
            useNativeDriver: false,
            easing: Easing.ease
        }).start(() => {
            this.setState({
                calenderOpacity: this.state.isExpanded ? 1 : 0
            });
        });
    };

    render() {
        const { isExpanded } = this.state;

        return (<View style={[{
            width: SCREEN_WIDTH, flex: 1
        }]}>
            <View style={[{
                width: SCREEN_WIDTH - 20, marginTop: 0
                , marginLeft: 10, backgroundColor: '#ffffff'
                , borderRadius: 5
                , alignItems: 'center'
            }]}>
                <View style={[{
                    width: SCREEN_WIDTH - 40, height: 40
                    , flexDirection: 'row', alignItems: 'flex-end'
                    , paddingBottom: 6
                }]}>
                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`${`${moment(this.props.calenderCurrentMonth).format("YYYY")}年`}`}</Text>
                    <Text style={[{ fontSize: 14, color: '#333333', marginLeft: 16 }]}>{`${this.getMonthAndDate()}`}</Text>
                    <View style={[{ flex: 1 }]} />
                    {!this.state.hideCalendar ? <TouchableOpacity
                        onPress={() => {
                            this.previousDateFun();
                        }}
                    >
                        <View style={[{ width: 64, height: 40, justifyContent: 'flex-end', alignItems: 'flex-end' }]}>
                            <Image style={[{ tintColor: '#666666', width: 20, height: 20 }]} source={require('../../../images/ic_new_left.png')} />
                        </View>
                    </TouchableOpacity> : null}
                    {!this.state.hideCalendar ? <TouchableOpacity
                        onPress={() => {
                            this.nextDateFun();
                        }}
                    >
                        <View style={[{ width: 64, height: 40, justifyContent: 'flex-end', alignItems: 'center' }]}>
                            <Image style={[{ tintColor: '#666666', width: 20, height: 20 }]} source={require('../../../images/ic_new_right.png')} />
                        </View>
                    </TouchableOpacity> : null}
                </View>

                {this.state.hideCalendar ? null : <View style={[{ opacity: this.state.calenderOpacity, width: SCREEN_WIDTH - 40, height: 1, backgroundColor: '#EAEAEA' }]}></View>}
                <View
                    style={[{
                        width: SCREEN_WIDTH - 40,
                    }]}
                >
                    <Animated.View style={[{ height: this.state.calendarHeight, width: SCREEN_WIDTH - 40, }]}>
                        {this.state.hideCalendar ? null : <CalendarPicker
                            ref={ref => (this.CalendarPicker = ref)}
                            showHeader={false}
                            startFromMonday={true}
                            selectedStartDate={this.props.calenderSelectedDate}
                            // selectedEndDate={this.state.selectedEndDate}
                            initialDate={this.props.calenderSelectedDate}
                            weekdays={['一', '二', '三', '四', '五', '六', '日']}
                            months={['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']}
                            // previousTitle={require('../../../images/calenderLeft.png')}
                            // nextTitle={require('../../../images/calendarRight.png')}
                            previousTitle={require('../../../images/ic_new_left.png')}
                            nextTitle={require('../../../images/ic_new_right.png')}
                            // minDate={minDate}
                            // maxDate={maxDate}
                            todayBackgroundColor="#EEE685"
                            selectedDayColor="#dff0ff"
                            selectedDayTextColor="#333333"
                            onDateChange={this.onDateChange}
                            onSwipe={this.onSwipe}
                            customDotDatesStyles={this.props.calenderData}
                        />}
                    </Animated.View>
                    <View style={[{
                        height: 40, width: SCREEN_WIDTH - 40,
                    }]}>
                        <TouchableOpacity
                            onPress={this.toggleCalendar}
                            activeOpacity={0.7}  // 添加触摸反馈
                            disabled={this.state.isAnimating}  // 动画过程中禁用点击
                        >
                            <View style={[{ width: SCREEN_WIDTH - 40, height: 40, flexDirection: 'row', alignItems: 'center' }]}>
                                <View style={[{ flex: 1, height: 1, backgroundColor: '#EAEAEA' }]}></View>
                                <Image
                                    style={[{ width: 20, height: 8 }]}
                                    source={isExpanded
                                        ? require('../../../images/ic_ct_calendar_up.png')
                                        : require('../../../images/ic_ct_calendar_down.png')
                                    }
                                />
                                <View style={[{ flex: 1, height: 1, backgroundColor: '#EAEAEA' }]}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Animated.View
                style={[{ width: SCREEN_WIDTH - 40, flex: 1, marginBottom: 10 }]}
            >

                {
                    SentencedToEmpty(this.props
                        , ['calenderDataObject', this.props.calenderSelectedDate, 'msg'], '') == ''
                        ? null
                        : <View style={[{
                            width: SCREEN_WIDTH - 20, marginVertical: 5
                            , marginLeft: 10, backgroundColor: '#ffffff'
                            , borderRadius: 5
                            , alignItems: 'center'
                            , height: 32, justifyContent: 'center'
                        }]}>
                            <View style={[{
                                width: SCREEN_WIDTH - 40, height: 32
                                , flexDirection: 'row', alignItems: 'center'
                            }]}>
                                <Text
                                    numberOfLines={2}
                                    style={[{
                                        // width: SCREEN_WIDTH - 148,
                                        width: SCREEN_WIDTH - 40,
                                        fontSize: 11, color: '#666666'
                                    }]}>{
                                        `${this.getText()}`
                                    }</Text>
                                {/* <View style={[{
                            flexDirection: 'row'
                            , height: 23, alignItems: 'center'
                            , marginTop: 17, marginLeft: 4
                            , backgroundColor: '#F2F4F5'
                            , borderRadius: 3, paddingHorizontal: 3
                        }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        listType: 0
                                    }, () => {
                                        this.props.dispatch(createAction('signInModel/getSignInHistoryList')({
                                            params: {
                                                // SignWorkType: 60,
                                                'RecordDate': moment(this.props.calenderCurrentMonth).format('YYYY-MM-DD')
                                            }
                                            , callback: (result) => {

                                            }
                                        }));
                                    })
                                }}
                            >
                                <View style={[{
                                    height: 18, backgroundColor: this.state.listType == 0 ? 'white' : '#F2F4F5'
                                    , borderTopLeftRadius: 6, borderBottomLeftRadius: 3
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}>
                                    <Text style={[{
                                        fontSize: 12, color: this.state.listType == 0 ? '#5EA1F8' : '#999999'
                                        , marginHorizontal: 7
                                    }]}>
                                        {'现场'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        listType: 1
                                    }, () => {
                                        this.props.dispatch(createAction('signInModel/getSignInHistoryList')({
                                            params: {
                                                // SignWorkType: 61,
                                                'RecordDate': moment(this.props.calenderCurrentMonth).format('YYYY-MM-DD')
                                            }
                                            , callback: (result) => {

                                            }
                                        }));
                                    })
                                }}
                            >
                                <View style={[{
                                    height: 18, backgroundColor: this.state.listType != 0 ? 'white' : '#F2F4F5'
                                    , borderRadius: 3
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}>
                                    <Text style={[{
                                        fontSize: 12, color: this.state.listType != 0 ? '#5EA1F8' : '#999999'
                                        , marginHorizontal: 7
                                    }]}>
                                        {'非现场'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View> */}
                            </View>
                        </View>
                }

                {
                    SentencedToEmpty(this.props
                        , ['calenderDataObject'
                            , this.props.calenderSelectedDate
                            , 'signInfo'], []).length == 0
                        ? null
                        : <View style={[{
                            width: SCREEN_WIDTH - 20
                            , marginLeft: 10
                            // , backgroundColor: '#ffffff'
                            , borderRadius: 5, flex: 1
                            , alignItems: 'center'
                        }]}>
                            <ScrollView style={[{
                                width: SCREEN_WIDTH - 20, flex: 1
                            }]}>
                                {
                                    this.getList().map((item, index) => {
                                        return this.renderLineItem(item, index, this.getList().length);
                                    })
                                }
                            </ScrollView>
                        </View>
                }
            </Animated.View>
        </View>
        );
    }
}

// 将样式抽离出来，使代码更清晰
const styles = {
    calendarContainer: {
        width: SCREEN_WIDTH - 40,
    },
    calendarWrapper: {
        width: SCREEN_WIDTH - 40,
        overflow: 'hidden'
    },
    toggleButton: {
        height: 44,  // 增加按钮高度，使其更容易点击
        justifyContent: 'center',
        paddingVertical: 10
    },
    toggleButtonContent: {
        width: SCREEN_WIDTH - 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#EAEAEA'
    },
    toggleIcon: {
        width: 20,
        height: 8,
        marginHorizontal: 10
    }
};