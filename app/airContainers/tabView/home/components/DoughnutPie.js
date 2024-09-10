//import liraries
import React, { PureComponent } from 'react';
import { View, Platform, StyleSheet,Text } from 'react-native';

import {SCREEN_WIDTH} from '../../../../config/globalsize';
import Echarts from 'native-echarts';

/**
 * 实时联网状态
 */
class DoughnutPie extends PureComponent {

    static defaultProps = {
        color:[
            '#66cfcf','#42778f', 
        ],
        backgroundColor:'#ffffff',
        height:100,
        width:120,
    } 

    constructor(props) {
        super(props); 
    }

    render() {
        const data=[];
        if(!this.props.number) return null;
        data.push({value:this.props.number.offLineNumber,name:'离线'});
        data.push({value:this.props.number.onLineNumber,name:'在线'});

        return (
            <View style={[styles.container,{backgroundColor:this.props.backgroundColor,borderTopWidth:1,borderColor:'#cccccc'}]}>
               <Echarts option={this.getOption(data)} width={SCREEN_WIDTH/2} height={this.props.height}></Echarts>

               <View style={{flexDirection:'column',height:120,width:SCREEN_WIDTH/2,justifyContent:'space-around'}}>
                    <View style={{flex:1,borderLeftWidth: 1,borderColor: '#cccccc',width:SCREEN_WIDTH/2,flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text style={{width:6,height:6,marginRight:4,borderRadius:3,backgroundColor:'#66cfcf'}}></Text><Text>{'离线'}</Text><Text>{`${data[0].value}个`}</Text></View>
                    <View style={{flex:1,borderLeftWidth: 1,borderColor: '#cccccc',width:SCREEN_WIDTH/2,borderTopWidth: 1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}><Text style={{width:6,height:6,marginRight:4,borderRadius:3,backgroundColor:'#42778f'}}></Text><Text>{'在线'}</Text><Text>{`${data[1].value}个`}</Text></View>
               </View>
            </View>
        );
    }

    getOption=(data)=>{
        let all = '-';
        if(this.props.number)
            all = this.props.number.sumNumber;
        return {
            //API文档：https://www.echartsjs.com/option.html#series-pie
            backgroundColor: this.props.backgroundColor,
            title: {
                text: '站点总数',
                subtext: all,
                x: 'center',
                y: 'center',
                itemGap: 10,
                textStyle : {
                    color : '#666',
                    fontSize : 15,
                    fontWeight: 'normal',
                },
                subtextStyle : {
                    color : '#424da2',
                    fontSize : 17,
                }
            },
            series : [
                {
                    name:'在线离线',//系列名称
                    type:'pie',
                    radius: ['80%', '100%'],
                    legendHoverLink:true,//是否启用图例 hover 时的联动高亮
                    hoverAnimation:false,//是否开启 hover 在扇区上的放大动画效果。
                    hoverOffset:10,//高亮扇区的偏移距离
                    clockwise:false,//饼图的扇区是否是顺时针排布。
                    startAngle:90,//起始角度，支持范围[0, 360]。
                    minAngle:0,//最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。
                    minShowLabelAngle:0,//小于这个角度（0 ~ 360）的扇区，不显示标签（label 和 labelLine）。
                    avoidLabelOverlap:true,//是否启用防止标签重叠策略，默认开启，在标签拥挤重叠的情况下会挪动各个标签的位置，防止标签间的重叠。
                    stillShowZeroSum:true,//是否在数据和为0（一般情况下所有数据为0） 的时候不显示扇区。
                    center: ['50%', '50%'],//饼图的中心（圆心）坐标
                    label: {
                        normal: {
                          show: false
                        }
                    },//饼图图形上的文本标签
                    labelLine: {
                        normal: {
                          show: false
                        }
                    },//标签的视觉引导线样式
                    data:data,
                }
            ],
            color:this.props.color,
        };
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#f8f8f8',
      },
});

//make this component available to the app
export default DoughnutPie;
