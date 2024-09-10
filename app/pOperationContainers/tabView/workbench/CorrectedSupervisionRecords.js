/*
 * @Description: 已整改监管记录
 * @LastEditors: hxf
 * @Date: 2022-11-28 16:06:43
 * @LastEditTime: 2023-04-18 20:00:13
 * @FilePath: /SDLMainProject34/app/pOperationContainers/tabView/workbench/CorrectedSupervisionRecords.js
 */
import moment from 'moment';
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, SimplePickerRangeDay, StatusPage } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../../utils';

@connect(({ supervision })=>({
    correctedIndex: supervision.correctedIndex,
    correctedTotal: supervision.correctedTotal,
    correctedResult: supervision.correctedResult,
    correctedData: supervision.correctedData,
    correctedBeginTime:supervision.correctedBeginTime,
    correctedEndTime:supervision.correctedEndTime,
}))
export default class CorrectedSupervisionRecords extends Component {
    
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '督查已整改记录',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    
    componentDidMount () {
        this.statusOnRefresh();
    }
    
    onRefresh = index => {
        this.props.dispatch(createAction('supervision/updateState')({
            correctedIndex: index,
        }));
        this.props.dispatch(createAction('supervision/getCorrectedInspectorRectificationList')({
            setListData: this.list.setListData
        }));
    }

    statusOnRefresh = () => {
        this.props.dispatch(createAction('supervision/updateState')({
            correctedIndex: 1,
            correctedTotal: 0,
            correctedResult: { status: -1 },
            correctedData: [],
        }));
        this.props.dispatch(createAction('supervision/getCorrectedInspectorRectificationList')({}));
    }

    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        // beginTime = moment()
        //     .subtract(7, 'day')
        //     .format('YYYY-MM-DD 00:00:00');
        // endTime = moment().format('YYYY-MM-DD 23:59:59');
        return {
            defaultTime: this.props.correctedBeginTime,
            start: this.props.correctedBeginTime,
            end: this.correctedEndTime,
            formatStr: 'YYYY/MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);
                /**
                 * recordType == 'VerifyRecords' 原有核实记录
                 * 'OverAlarmVerifyRecords' 运维人员超标核实记录 OverAlarmVerify
                 * 需要将参数更新到不同的state中
                 */
                // if (this.recordType == 'VerifyRecords') {
                this.props.dispatch(
                    createAction('supervision/updateState')({
                        correctedIndex: 1,
                        correctedTotal: 0,
                        correctedBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                        correctedEndTime: endMoment.format('YYYY-MM-DD 23:59:59')
                    })
                );

                if (this.props.correctedResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusOnRefresh();
                }
            }
        };
    };

    renderItem = ({item,index}) => {
        return(<TouchableOpacity
            onPress={()=>{
                this.props.dispatch(createAction('supervision/updateState')({
                    rectificationID: item.ID,
                }));
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'SupervisionDetail',
                }));
            }}
        >
            <View style={{width:SCREEN_WIDTH
            , height: 84, backgroundColor:'#ffffff'
            , paddingLeft:20
            , flexDirection:'row'}}>
                <View style={{marginTop:15,height:54
                , flex:1, justifyContent:'space-between'}}>
                    {/* <Text style={{fontSize:15,color:'#333333'}}>{`SMC科技有限公司-1#排口`}</Text> */}
                    <View style={{flexDirection:'row'}}>
                        <Text numberOfLines={1} style={{fontSize:15,color:'#333333', maxWidth:(SCREEN_WIDTH-45)*2/3}}>{`${item.EntName}`}</Text>
                        <Text numberOfLines={1} style={{fontSize:15,color:'#333333',maxWidth:((SCREEN_WIDTH-45)/3)-40}}>{`-${item.PointName}`}</Text>
                    </View>
                    <Text style={{fontSize:12,color:'#666666'}}>{`${item.Time}`}</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize:12,color:'#666666'}}>{`${item.InspectorTypeName}`}</Text>
                        <View style={{height:11,width:1,backgroundColor:'#666666', marginHorizontal:5}}></View>
                        <Text style={{fontSize:12,color:'#666666'}}>{`${SentencedToEmpty(item,['TotalScore'],'-')}分`}</Text>
                    </View>
                </View>
                {/* <Image source={require('../../../images/ic_corrected_supervision_record.png')}
                    style={{height:44,width:44}}
                /> */}
            </View>
        </TouchableOpacity>)
    }
    
    render() {
        return (
            <View style={{width:SCREEN_WIDTH,flex:1}}>
                <View style={{width:SCREEN_WIDTH,height:45
                , justifyContent:'center', alignItems:'center'
                , backgroundColor:'#ffffff', marginBottom:10}}>
                    <SimplePickerRangeDay style={[{ width: 200 }]} option={this.getRangeDaySelectOption()} />
                </View>
                <StatusPage
                    backRef={true}
                    status={SentencedToEmpty(this.props,['correctedResult','status'],1000)}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        console.log('重新刷新');
                        this.statusOnRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        console.log('错误操作回调');
                        this.statusOnRefresh();
                    }}
                >
                    <FlatListWithHeaderAndFooter
                        style={[{ backgroundColor: '#f2f2f2' }]}
                        ref={ref => (this.list = ref)}
                        ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                        pageSize={20}
                        hasMore={() => {
                            return this.props.correctedData.length < this.props.correctedTotal;
                        }}
                        onRefresh={index => {
                            this.onRefresh(index);
                        }}
                        onEndReached={index => {
                            this.onRefresh(index);
                        }}
                        renderItem={this.renderItem}
                        data={this.props.correctedData}
                    />
                </StatusPage>
            </View>
        )
    }
}
