//import liraries
import React, { PureComponent } from 'react';
import { View, Platform, StyleSheet,Text } from 'react-native';

import moment from 'moment';
import Echarts from 'native-echarts';

/**
 * 审核
 */
export default class AuditBar extends PureComponent {

    static defaultProps = {
        height:220,
    } 

    constructor(props) {
        super(props); 
    }

    render() {
        return (
            <View style={[styles.container]}>
               <Echarts option={this.getOption()} width={this.props.width} height={this.props.height}></Echarts>
            </View>
        );
    }

    getOption=()=>{
        const dataAxis=[];
        const data1=[];
        const data2=[];
        const data3=[];
        const data4=[];
        if(this.props.aduitResult){
            this.props.aduitResult.map((item,index)=>{
                data1.push(item.NoExamine);
                data2.push(item.WaitReport);
                data3.push(item.WaitReview);
                data4.push(item.ReviewNo);
                dataAxis.push(moment(item.MonitorTime).format('MM月DD日'));
            });
        }
        return {
            grid:{
                top:10,
                bottom:44,
            },
            legend: {
                data:['未审核','待上报','待复核','复核不通过'],
                icon: "rect",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
                itemWidth: 10,  // 设置宽度
                itemHeight: 10, // 设置高度
                itemGap: 20, // 设置间距
                y: 'bottom',    //延Y轴居中
                x: 'center', //居右显示
                textStyle:{
                    fontSize:12,
                    color:'#666666'
                }
            },
            xAxis : {
                    data:dataAxis,
                    type : 'category',
                    axisLabel:{//坐标轴刻度标签的相关设置。
                        show:true,
                        inside:false,
                        textStyle:{
                          color:'#666',
                          fontWeight:'normal',
                          fontSize:12,
                        },
                        formatter:function(value,index){
                          return value;
                        }
                      },
                    axisTick: {show: false},
                    splitLine:{show:false},
                    splitArea:{show:false},
                    axisLine: {show: true,
                        lineStyle:{
                            color:'#cccccc'
                        }
                    },
                }
            ,
            yAxis : {
                    axisLine: {show: true},
                    axisTick: {show: false},
                    splitLine:{lineStyle:{type:'dotted',}},
                    axisLabel: {
                        textStyle: {
                            color: '#999',
                            fontSize:10,
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle:{
                            color:'#cccccc'
                        }
                    },
                },
            barWidth:10,
            series : [
                {
                    name:'未审核',
                    type:'bar',
                    data:data1
                },
                {
                    name:'待上报',
                    type:'bar',
                    stack: '广告',
                    data:data2
                },
                {
                    name:'待复核',
                    type:'bar',
                    data:data3,
                   
                },
                {
                    name:'复核不通过',
                    type:'bar',
                    data:data4,
                   
                }
            ]
        };
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#00000000',
      },
});