//import liraries
import React, { PureComponent } from 'react';
import { View, Platform, StyleSheet,Text } from 'react-native';

import * as Progress from 'react-native-progress';
import Echarts from 'native-echarts';

import {SCREEN_WIDTH} from '../../../../config/globalsize';

/**
 * 数据捕获率
 */
class DataCaptureRate extends PureComponent {

    static defaultProps = {
        color:[          
            '#42778f','#64aece', 
        ],
        backgroundColor:'#ffffff',
        height:84,
        width:SCREEN_WIDTH/2,
    } 

    constructor(props) {
        super(props); 
    }

    render() {
        if(!this.props.captureRateResult) return null;
        const {AllPercent,PointRateData} = this.props.captureRateResult;
        const list=[];
        PointRateData.map((item,index)=>{
            list.push({name:item.PointName,value:item.Percent});
        });
        return (
            <View style={[styles.container,this.props.style]}>

                <View style={{flexDirection:'row',alignItems:'center',marginTop: 8,marginBottom: 15,paddingLeft:20}}>
                    <Echarts option={this.getOption(AllPercent)} width={SCREEN_WIDTH/2} height={this.props.height}></Echarts>

                    <View style={{marginLeft: 36,flexDirection:'column',height:84,width:SCREEN_WIDTH/2,justifyContent:'space-around'}}>
                            <Text style={{fontSize:14,color:'#666666'}}>{this.props.CityName}</Text>
                            <Text style={{fontSize:20,color:'#666666'}}>{`${AllPercent}%`}</Text>
                            <Text style={{fontSize:14,color:'#666666'}}>{'数据捕获率'}</Text>
                    </View>
                </View>
                {
                    list.map((item,index)=>(
                        <View key={index.toString()} style={{flexDirection:'row',width:SCREEN_WIDTH,height:30,alignItems:'center',paddingLeft: 14,}}>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{width:72,fontSize:14,color:'#666',paddingRight: 14,}}>{item.name}</Text>
                            <Progress.Bar  progress={1.0*item.value/100} borderWidth={0} color={'#42778f'} unfilledColor={'#64aece'} width={SCREEN_WIDTH-140}/>
                            <Text style={{width:50,fontSize:14,color:'#666'}}>{`${item.value}%`}</Text>
                        </View>
                    ))
                }
            </View>
        );
    }

    getOption=(AllPercent)=>{
        const data= [{value:AllPercent, name:''},
                    {value:100-AllPercent, name:''}];
        return {
            //API文档：https://www.echartsjs.com/option.html#series-pie
            backgroundColor: '#00000000',
            title: {
                text: `${AllPercent}%`,
                x: 'center',
                y: 'center',
                itemGap: 10,
                textStyle : {
                    color : '#666666',
                    fontWeight: 'normal',
                    fontSize : 20,
                },
            },
            series : [
                {
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
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#ffffff',
      },
});

//make this component available to the app
export default DataCaptureRate;
