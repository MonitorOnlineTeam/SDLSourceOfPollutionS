/*
 * @Description: 运营到期点位统计 合同到期统计
 * @LastEditors: hxf
 * @Date: 2021-10-09 17:11:55
 * @LastEditTime: 2022-05-16 10:47:57
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/ContractExpiresStatistics.js
 */

import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, Animated, StyleSheet } from 'react-native'
import { Echarts, echarts } from 'react-native-secharts';
import { connect } from 'react-redux';
import moment from 'moment';

import { createNavigationOptions, NavigationActions, createAction, ShowToast, SentencedToEmpty } from '../../../utils';
import { FlatListWithHeaderAndFooter, OperationAlertDialog, StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';


const containerWidth = 132;
const numberOfTabs = 3;
const tabUnderlineStyle = {
    position: 'absolute',
    width: containerWidth / numberOfTabs ,
    height: 2,
    bottom:0,
    backgroundColor: '#4AA0FF',
};
const tabBarUnderlineStyle={
    width: SCREEN_WIDTH / 2,
    height: 2,
    backgroundColor: '#4aa1fd',
    marginBottom: -1
};

@connect(({claimTaskModels})=>({
    operationPhoneExpirePointListResult:claimTaskModels.operationPhoneExpirePointListResult,
}))
export default class ContractExpiresStatistics extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '运营到期点位统计',
            headerTitleStyle: { marginRight: 0 },
            headerRight: (
                <View>
                    <TouchableOpacity
                        style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
                        onPress={(e) => {
                            navigation.state.params.navigateRightPress();
                        }}
                    >
                        <Text style={[{fontSize:14,color:'white'}]}>{'说明'}</Text>
                    </TouchableOpacity>
                </View>
            )
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            status:200,
            listStatus:200,
            listData:[],
            activeTab:0,
            isVisible: false,
            spinnerRect: {},
            clickDatas: null,
            option : {
                tooltip: {
                    trigger: 'axis',
                    position: function(point, params, dom, rect, size) {
                        let x = point[0];
                        if (x > 240) {
                            x = 240;
                        } //到右侧后不再挪动了
                        return [x, '10%'];
                    },
                    formatter: function(params) {
                        var relVal = params[0].name;
                        for (var i = 0; i < params.length; i++) {
                            var v = params[i].value;
                            if (typeof v == 'undefined') {
                            v = '--';
                            } //默认值
                            relVal +=
                            '<div class="circle" style= "font-size: 0.7rem;margin-top:-4px"><span style="background-color:' +
                            '#298CFB' +
                            ';display:inline-block;margin-right:5px;border-radius:6px;width:6px;height:6px;"></span>' +
                            v +
                            '</div>';
                        }
                        var seen = [];
                        var paramsString = JSON.stringify(params, function(key, val) {
                            if (val != null && typeof val == 'object') {
                                if (seen.indexOf(val) >= 0) {
                                    return;
                                }
                                seen.push(val);
                            }
                            return val;
                        });
                        window.postMessage(JSON.stringify({ types: 'ON_PRESS', payload: paramsString }));
                        return relVal;
                    },
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效，sahdow为阴影，鼠标放下去的时候显示后面的阴影
                        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                grid: {
                    show: true,
                    top: 30,
                    left: '8%',
                    right: '8%',
                    bottom: 30,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['过期30日内', '0-7日', '8-14日', '15-30日'],
                    axisLabel: {
                        interval:0,
                        //坐标轴刻度标签的相关设置。
                        textStyle: {
                            color: '#666666',
                            fontWeight: 'normal',
                            fontSize: 12
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#EEEEEE',//左边线的颜色
                            width:'2'//坐标线的宽度
                        }
                    },
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        interval:0,
                        //坐标轴刻度标签的相关设置。
                        textStyle: {
                            color: '#666666',
                            fontWeight: 'normal',
                            fontSize: 12
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#EEEEEE',//左边线的颜色
                            width:'2'//坐标线的宽度
                        }
                    },
                    splitLine:{
                        lineStyle: {
                            type: 'solid',
                            color: '#EEEEEE',//左边线的颜色
                            width:'2'//坐标线的宽度
                        }
                    }
                },
                barWidth:22,
                label: {
                    show: true, //开启显示
                    position: 'top', //在上方显示
                    textStyle: { //数值样式
                        color: 'black',
                        fontSize: 16
                    }
                },
                series: [
                    {
                    data: [
                        {
                            value: 654,
                                itemStyle: {
                                    color: '#298CFB',
                                }
                        },
                        {
                            value: 5300,
                                itemStyle: {
                                    color: '#298CFB'
                                }
                        },
                        {
                            value: 500,
                                itemStyle: {
                                    color: '#298CFB'
                                }
                        },
                        {
                            value: 200,
                                itemStyle: {
                                    color: '#298CFB'
                                }
                        }
                    ],
                    type: 'bar'
                    }
                ]
            }
        }
        this.props.navigation.setParams({
            navigateRightPress: () => {
                this.refs.doAlert.show();
                this.setState({
                    isVisible: false
                });
            }
        });
    }

    /**
     * 
     *  // 七日内过期
     *  notExpired7: 0
        notExpired7List: []
        // 8日到14日过期
        notExpired14: 0
        notExpired14List: []
        // 15日到30日过期
        notExpired30: 0
        notExpired30List: []
        // 过期三十天内
        overdue30: 0
        overdue30List: []
     * 
     */

    componentDidMount() {
        this.props.dispatch(createAction('claimTaskModels/getOperationPhoneExpirePointList')({params:{}}));
    }

    onPress = e => {
        this.setState({ clickDatas: e });
        // let that = this;
        //,listData:e[0].data.dataList
        // this.setState({listStatus:-1,listData:SentencedToEmpty(e,[0,'data','dataList'],[])},()=>{
        //     setTimeout(() => {
        //         that.setState({listStatus:200});
        //     }, 1000);
        // });
        this.setState({listData:SentencedToEmpty(e,[0,'data','dataList'],[])}
        ,()=>{
            
        });
    };

    // _renderItemList = ({item}) => {
    //     return <TouchableOpacity>
    //         <View style={[{height:85.5,width:SCREEN_WIDTH,backgroundColor:'white'
    //         , flexDirection:'row',alignItems:'center'
    //         }]}>
    //             <Image style={[{height:27.5,width:27.5,marginLeft:9,marginRight:12}]} source={require('../../../images/ic_company.png')} />
    //             <View style={[{flex:1,height:55.5, width:SCREEN_WIDTH-60, marginTop:15,marginBottom:15
    //             ,justifyContent:'space-between'}]}>
    //                 {/* <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{color:'#333333',fontSize:15}]}>{`库车青松水泥有限责任公司-窑头`}</Text> */}
    //                 <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{color:'#333333', width:SCREEN_WIDTH-60,fontSize:15}]}>{`${item.parentName}-${item.pointName}`}</Text>
    //                 {/* <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{fontSize:12,color:'#666666'}]}>{`项目号：YY2020-YQ170`}</Text> */}
    //                 <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{fontSize:12, width:SCREEN_WIDTH-60,color:'#666666'}]}>{`项目号：${item.projectCode}`}</Text>
    //                 {/* <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{fontSize:12,color:'#666666'}]}>{`运营起止日期：2021-08-18~2021-12-30`}</Text> */}
    //                 <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{fontSize:12, width:SCREEN_WIDTH-60,color:'#666666'}]}>{`运营起止日期：${moment(item.beginTime).format('YYYY-MM-DD')}~${moment(item.endTime).format('YYYY-MM-DD')}`}</Text>
    //             </View>
    //         </View>
    //     </TouchableOpacity>
    // }

    _renderItemList = ({item}) => {
        return <TouchableOpacity>
            <View style={[{height:105.5,width:SCREEN_WIDTH,backgroundColor:'white'
            , flexDirection:'row',alignItems:'center',paddingLeft:19
            }]}>
                <View style={[{flex:1,height:75.5, width:SCREEN_WIDTH-60, marginTop:15,marginBottom:15
                ,justifyContent:'space-between'}]}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{color:'#333333', width:SCREEN_WIDTH-60,fontSize:15}]}>{`${item.pointName}`}</Text>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{color:'#333333', width:SCREEN_WIDTH-60,fontSize:15}]}>{`企业名称：${item.parentName}`}</Text>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{fontSize:12, width:SCREEN_WIDTH-60,color:'#666666'}]}>{`项目号：${item.projectCode}`}</Text>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{fontSize:12, width:SCREEN_WIDTH-60,color:'#666666'}]}>{`运营合同起止日期：${moment(item.beginTime).format('YYYY-MM-DD')}~${moment(item.endTime).format('YYYY-MM-DD')}`}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    ///  处理tabbar的颜色和字体及图标
    renderTabOption = (tab, i) => {
        let color = this.state.activeTab == i ? '#4aa1fd' : '#666666'; // 判断i是否是当前选中的tab，设置不同的颜色
        return (
            //因为要有点击效果 所以要引入可触摸组件
            <TouchableOpacity onPress={() => {
                let that = this;
                this.props.dispatch(createAction('claimTaskModels/updateState')({operationPhoneExpirePointListResult:{status:-1}}));
                let params = {};
                if (i == 0) {

                } else if (i == 1) {
                    params.PollutantType = 1;
                } else if (i == 2) {
                    params.PollutantType = 2;
                }
                this.props.dispatch(createAction('claimTaskModels/getOperationPhoneExpirePointList')({params}));
                this.setState({listData:[]});
                // this.setState({status:-1},()=>{
                //     setTimeout(()=>{that.setState({
                //         status:200
                //     })},2000)
                // })
                this.setState({activeTab:i},()=>{
                    Animated.timing(this.translateX,
                        {
                            toValue:i*44,
                            duration:200,
                        }
                    ).start();
                })
                
            }} style={styles.tab} key={tab}>
                <View style={styles.tabItem}>
                    <Text style={{ color: color, fontSize: 13 }}>{tab}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    translateX=new Animated.Value(0)

    getOption = () => {
        return {
            tooltip: {
                trigger: 'axis',
                position: function(point, params, dom, rect, size) {
                    let x = point[0];
                    if (x > 240) {
                        x = 240;
                    } //到右侧后不再挪动了
                    return [x, '10%'];
                },
                formatter: function(params) {
                    var relVal = params[0].name;
                    for (var i = 0; i < params.length; i++) {
                        var v = params[i].value;
                        if (typeof v == 'undefined') {
                        v = '--';
                        } //默认值
                        relVal +=
                        '<div class="circle" style= "font-size: 0.7rem;margin-top:-4px"><span style="background-color:' +
                        '#298CFB' +
                        ';display:inline-block;margin-right:5px;border-radius:6px;width:6px;height:6px;"></span>' +
                        v +
                        '</div>';
                    }
                    var seen = [];
                    var paramsString = JSON.stringify(params, function(key, val) {
                        if (val != null && typeof val == 'object') {
                            if (seen.indexOf(val) >= 0) {
                                return;
                            }
                            seen.push(val);
                        }
                        return val;
                    });
                    window.postMessage(JSON.stringify({ types: 'ON_PRESS', payload: paramsString }));
                    return relVal;
                },
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效，sahdow为阴影，鼠标放下去的时候显示后面的阴影
                    type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            grid: {
                show: true,
                top: 30,
                left: '8%',
                right: '8%',
                bottom: 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['过期30日内', '0-7日', '8-14日', '15-30日'],
                axisLabel: {
                    interval:0,
                    //坐标轴刻度标签的相关设置。
                    textStyle: {
                        color: '#666666',
                        fontWeight: 'normal',
                        fontSize: 12
                    }
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#EEEEEE',//左边线的颜色
                        width:'2'//坐标线的宽度
                    }
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    interval:0,
                    //坐标轴刻度标签的相关设置。
                    textStyle: {
                        color: '#666666',
                        fontWeight: 'normal',
                        fontSize: 12
                    }
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#EEEEEE',//左边线的颜色
                        width:'2'//坐标线的宽度
                    }
                },
                splitLine:{
                    lineStyle: {
                        type: 'solid',
                        color: '#EEEEEE',//左边线的颜色
                        width:'2'//坐标线的宽度
                    }
                }
            },
            barWidth:22,
            label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                    color: 'black',
                    fontSize: 16
                }
            },
            series: [
                {
                data: [
                    {
                        value: SentencedToEmpty(this.props.operationPhoneExpirePointListResult
                            ,['data','Datas','overdue30'],0),
                        dataList:SentencedToEmpty(this.props.operationPhoneExpirePointListResult
                            ,['data','Datas','overdue30List'],[]),
                        itemStyle: {
                            color: '#298CFB',
                        }
                    },
                    {
                        value: SentencedToEmpty(this.props.operationPhoneExpirePointListResult
                            ,['data','Datas','notExpired7'],0),
                        dataList:SentencedToEmpty(this.props.operationPhoneExpirePointListResult
                            ,['data','Datas','notExpired7List'],[]),
                            itemStyle: {
                                color: '#298CFB'
                            }
                    },
                    {
                        value: SentencedToEmpty(this.props.operationPhoneExpirePointListResult
                            ,['data','Datas','notExpired14'],0),
                        dataList:SentencedToEmpty(this.props.operationPhoneExpirePointListResult
                            ,['data','Datas','notExpired14List'],[]),
                            itemStyle: {
                                color: '#298CFB'
                            }
                    },
                    {
                        value: SentencedToEmpty(this.props.operationPhoneExpirePointListResult
                            ,['data','Datas','notExpired30'],0),
                        dataList:SentencedToEmpty(this.props.operationPhoneExpirePointListResult
                            ,['data','Datas','notExpired30List'],[]),
                            itemStyle: {
                                color: '#298CFB'
                            }
                    }
                ],
                type: 'bar'
                }
            ]
        };
    }

    render() {
        var options = {
            headTitle: '说明',
            innersHeight: 280,
            messText: `1、运维到期点位为当前日期与监测点运营实际结束日期对比后，系统判定为即将到期的点位。
2、运维监测点到期后，系统将停止自动派发工单，关闭手工申请工单功能，对于续签项目请及时续签，然后运营信息维护至平台。`,
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '知道了',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: this.confirm
                }
            ]
        };

        return (
            <View style={[{flex:1,width:SCREEN_WIDTH}]}>
                <View style={[{height:28,width:160,backgroundColor:'white',borderRadius:14
                    ,marginTop:8.5,marginBottom:9.5,marginLeft:19.5
                    ,paddingHorizontal:14}]}>
                        <View style={[{width:132,height:28}]}>
                            <View style={[{width:132,height:28,flexDirection:'row'}]}>
                            {
                                ['全部','废水','废气'].map((tab, i) => this.renderTabOption(tab, i))
                            }
                            </View>
                            
                            <Animated.View
                                style={[
                                    tabUnderlineStyle,
                                    {
                                        transform: [{ translateX:this.translateX }],
                                        alignItems: 'center'
                                    },
                                ]}
                            >
                                <View style={[tabUnderlineStyle]} />
                            </Animated.View>
                        </View>
                    </View>
                <StatusPage
                    status={this.props.operationPhoneExpirePointListResult.status}
                    errorBtnText={'点击重试'}
                    emptyBtnText={'点击重试'}
                    onErrorPress={() => {
                        // this.getData(this.state.DGIMNs, this.state.beginTime, this.state.endTime, this.state.PollutantCode, this.state.pageIndex, this.state.pageSize);
                    }}
                    onEmptyPress={() => {
                        // this.getData(this.state.DGIMNs, this.state.beginTime, this.state.endTime, this.state.PollutantCode, this.state.pageIndex, this.state.pageSize);
                    }}
                >
                    <View style={[{width:SCREEN_WIDTH,height:272,backgroundColor:'white'}]}>
                        <Text style={[{fontSize:14,color:'#666666',marginLeft:20,marginTop:14}]}>{'运营到期监测点数分布'}</Text>
                        <Echarts option={this.getOption()} height={250} onPress={this.onPress} width={SCREEN_WIDTH} />
                    </View>
                    <View style={[{flex:1,width:SCREEN_WIDTH,backgroundColor:'white',marginTop:9.5}]}>
                        <StatusPage
                            status={this.state.listStatus}
                            errorBtnText={'点击重试'}
                            emptyBtnText={'点击重试'}
                            onErrorPress={() => {
                                // this.getData(this.state.DGIMNs, this.state.beginTime, this.state.endTime, this.state.PollutantCode, this.state.pageIndex, this.state.pageSize);
                            }}
                            onEmptyPress={() => {
                                // this.getData(this.state.DGIMNs, this.state.beginTime, this.state.endTime, this.state.PollutantCode, this.state.pageIndex, this.state.pageSize);
                            }}
                        >
                            <FlatListWithHeaderAndFooter
                                style={[{ backgroundColor: '#f2f2f2'}]}
                                ref={ref => (this.list = ref)}
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View style={[{ height: 10.5, width: SCREEN_WIDTH, alignItems: 'center', backgroundColor: '#fff' }]}>
                                            <View style={[{ height: 10.5, width: SCREEN_WIDTH - 13, backgroundColor: '#f2f2f2' }]} />
                                        </View>
                                    );
                                }}
                                pageSize={20}
                                hasMore={() => {
                                    return false;
                                }}
                                onRefresh={index => {
                                    // this.onRefresh(index);
                                    let i = this.state.activeTab;
                                    let params = {};
                                    if (i == 0) {

                                    } else if (i == 1) {
                                        params.PollutantType = 1;
                                    } else if (i == 2) {
                                        params.PollutantType = 2;
                                    }
                                    this.props.dispatch(createAction('claimTaskModels/updateState')({operationPhoneExpirePointListResult:{status:-1}}));
                                    this.props.dispatch(createAction('claimTaskModels/getOperationPhoneExpirePointList')({params}));
                                }}
                                onEndReached={index => {
                                    // this.props.dispatch(createAction('editPoint/updateState')({ editPointListIndex: index }));
                                    // this.props.dispatch(createAction('editPoint/mGetEditPointDatas')({ setListData: this.list.setListData }));
                                }}
                                renderItem={item => {
                                    return this._renderItemList(item);
                                }}
                                data={this.state.listData}
                            />    
                        </StatusPage>
                    </View>
                </StatusPage>
                <OperationAlertDialog options={options} ref="doAlert" />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center'
    }
});