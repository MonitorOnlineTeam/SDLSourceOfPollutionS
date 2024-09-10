/*
 * @Description: 未整改督查记录
 * @LastEditors: hxf
 * @Date: 2022-11-28 13:55:07
 * @LastEditTime: 2023-04-07 11:31:33
 * @FilePath: /SDLMainProject34/app/pOperationContainers/tabView/workbench/ResponseToSupervision.js
 */
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../../utils';

//CorrectedSupervisionRecords
@connect(({ supervision })=>({
    inspectorRectificationListIndex: supervision.inspectorRectificationListIndex,
    inspectorRectificationListTotal: supervision.inspectorRectificationListTotal,
    inspectorRectificationListResult: supervision.inspectorRectificationListResult,
    inspectorRectificationListData: supervision.inspectorRectificationListData,
}))
export default class ResponseToSupervision extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '督查未整改记录',
            headerRight: (
                <TouchableOpacity
                    style={{ width: 72, height: 40, justifyContent: 'center' }}
                    onPress={() => {
                        navigation.state.params.navigatePress();
                    }}
                >
                    <Text style={[{ fontSize: 12, color: globalcolor.whiteFont }]}>{'已整改记录'}</Text>
                </TouchableOpacity>
            )
        });

    constructor(props){
        super(props);
        this.props.navigation.setParams({
            navigatePress: () => {
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'CorrectedSupervisionRecords',
                }));
            }
        });
    }

    componentDidMount() {
        this.statusOnRefresh();
    }

    onRefresh = index => {
        this.props.dispatch(createAction('supervision/updateState')({
            inspectorRectificationListIndex: index,
            Rectification:0,
        }));
        this.props.dispatch(createAction('supervision/getInspectorRectificationList')({
            setListData: this.list.setListData
        }));
    }

    statusOnRefresh = () => {
        this.props.dispatch(createAction('supervision/updateState')({
            Rectification:0,
            inspectorRectificationListIndex: 1,
            inspectorRectificationListTotal: 0,
            inspectorRectificationListResult: { status: -1 },
            inspectorRectificationListData: [],
        }));
        this.props.dispatch(createAction('supervision/getInspectorRectificationList')({}));
    }
    
    renderItem = ({ item, index }) => {
        /**
         *  CommonlyProblemNum		一般问题
            PrincipleProblemNum		原则问题
            importanProblemNum 		重点问题
         */
        return <TouchableOpacity
            onPress={()=>{
                this.props.dispatch(createAction('supervision/updateState')({
                    rectificationID: item.ID,
                }));
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'SupervisionDetail',
                }));
            }}
        >
        <View style={{width:SCREEN_WIDTH,
            height: 113, backgroundColor:'#ffffff', 
            paddingVertical:15, paddingHorizontal:20, justifyContent:'space-between'}}>
            <View style={{flexDirection:'row'}}>
                <Text numberOfLines={1} style={{fontSize:15,color:'#333333', maxWidth:SCREEN_WIDTH*2/3}}>{`${item.EntName}`}</Text>
                <Text numberOfLines={1} style={{fontSize:15,color:'#333333',maxWidth:(SCREEN_WIDTH/3)-40}}>{`-${item.PointName}`}</Text>
            </View>
            <Text style={{fontSize:12,color:'#666666'}}>{`${item.Time}`}</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{fontSize:12,color:'#666666'}}>{`${item.InspectorTypeName}`}</Text>
                <View style={{height:11,width:1,backgroundColor:'#666666', marginHorizontal:5}}></View>
                <Text style={{fontSize:12,color:'#666666'}}>{`${SentencedToEmpty(item,['TotalScore'],'-')}分`}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                {
                    SentencedToEmpty(item,['PrincipleProblemNum'],0)>0?<View style={{borderWidth:1,borderRadius:9
                    ,borderColor:'#4AA0FF', height:19, paddingHorizontal:7
                    , justifyContent:'center', alignItems:'center', marginRight:10}}>
                        <Text style={{fontSize:12,color:'#4AA0FF'}}>{`原则问题${item.PrincipleProblemNum}个`}</Text>
                    </View>:null
                }
                {
                    SentencedToEmpty(item,['importanProblemNum'],0)>0?<View style={{borderWidth:1,borderRadius:9
                    ,borderColor:'#4AA0FF', height:19, paddingHorizontal:7
                    , justifyContent:'center', alignItems:'center', marginRight:10}}>
                        <Text style={{fontSize:12,color:'#4AA0FF'}}>{`重点问题${item.importanProblemNum}个`}</Text>
                    </View>:null
                }
                {
                    SentencedToEmpty(item,['CommonlyProblemNum'],0)>0?<View style={{borderWidth:1,borderRadius:9
                    ,borderColor:'#4AA0FF', height:19, paddingHorizontal:7
                    , justifyContent:'center', alignItems:'center', marginRight:10}}>
                        <Text style={{fontSize:12,color:'#4AA0FF'}}>{`一般问题${item.CommonlyProblemNum}个`}</Text>
                    </View>:null
                }
            </View>
        </View></TouchableOpacity>
    }

    render() {
        return (
            <StatusPage
                backRef={true}
                status={SentencedToEmpty(this.props,['inspectorRectificationListResult','status'],1000)}
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
                        return this.props.inspectorRectificationListData.length < this.props.inspectorRectificationListTotal;
                    }}
                    onRefresh={index => {
                        this.onRefresh(index);
                    }}
                    onEndReached={index => {
                        this.onRefresh(index);
                    }}
                    renderItem={this.renderItem}
                    data={this.props.inspectorRectificationListData}
                />
            </StatusPage>
        )
    }
}
