//import liraries
import React, { PureComponent } from 'react';
import { View, Platform, StyleSheet,Text } from 'react-native';
import moment from 'moment';
import Echarts from 'native-echarts';

/**
 * 实时空气质量 使用仪表盘实现
 * 包含 
 * 城市名字、监测时间、AQI、优良程度、首要污染物、天气信息｛温度范围、阴晴、风力、风向、湿度、紫外线｝
 */
export default class AqiGauge extends PureComponent {

    constructor(props) {
        super(props); 
    }

    render() {
        if(!this.props.cityNewModel) return null;
        const {CityName,MonitorTime,weather,
            a01008,//风向
            a01007,//风速
            a01006,//气压
            a01002,//湿度
            a01001,//气温
            AQI,
            AQI_Color,
            AQI_Level,
            PrimaryPollutantCode}= this.props.cityNewModel;
        return (
            <View style={[styles.container,this.props.style,{backgroundColor:AQI_Color}]}>
                <View style={{flexDirection:'row',justifyContent:'space-between',paddingLeft:35,paddingRight:14,paddingTop:18}}>
                    <Text style={{fontSize:15,fontWeight:'500',color:'#fff'}}>{CityName}</Text>
                    <Text style={{fontSize:12,color:'#fff',marginTop:2}}>{`发布时间${moment(MonitorTime).format('HH:00')}`}</Text>
                </View>
                <View style={styles.content}>
                    <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:30}}>
                        <Echarts option={this.getOption()} width={120} height={120}></Echarts>
                        <Text style={{color:'#fff',fontSize:14}}>{`首要污染物：${PrimaryPollutantCode||'--'}`}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'column',alignItems:'flex-start',justifyContent:'center',paddingLeft:50}}>
                        <Text style={{color:'#fff',fontSize:14}}>{`${a01001}℃  ${weather}`}</Text>
                        <Text style={{color:'#fff',fontSize:14,marginTop:10}}>{`${a01008}  ${a01007}级`}</Text>
                        <Text style={{color:'#fff',fontSize:14,marginTop:10}}>{`湿度  ${a01002}%`}</Text>
                    </View>
                </View>
            </View>
        );
    }

    getOption=()=>{

        const {AQI,AQI_Color,AQI_Level} = this.props.cityNewModel;

        const gaugeColor=this.getGaugeColor(AQI);

        return option = {
            grid:{
                left:0,
                right:0,
                top:0,
                bottom:0,
            },
            backgroundColor: '#00000000',
            title: {
                text: AQI,
                subtext: AQI_Level,
                x: 'center',
                y: '30',
                itemGap: 10,
                textStyle : {
                    color : '#ffffff',
                    fontSize : 36,
                    fontWeight:'normal',
                },
                subtextStyle : {
                    color : '#ffffff',
                    fontSize : 13,
                    fontWeight:'normal',
                }
            },
            series: [{
                    radius:'100%',
                    name: "仪表盘",
                    type: "gauge",
                    splitNumber: 10,
                    axisLine: {
                        lineStyle: {
                            color: [
                                [1.0*Number(AQI)/500, '#fff'], //外环基础色
                                [1, gaugeColor]
                            ],
                            width: 13
                        }
                    },
                    axisLabel: {show: false,},
                    axisTick: {show: false,},
                    splitLine: {show: false,},
                    itemStyle: {show: false,},
                    pointer: {show: false,},
                    detail:{show: false,},
                }
            ]
        };
    }
    /**
     *获取内环颜色
     * @memberof AqiGauge
     */
    getGaugeColor=(iaqi)=>{
        if (iaqi > 0 && iaqi <= 50){
            return "#a6e8bb";
        }
        else if (iaqi > 50 && iaqi <= 100){
            return "#fee995";
        }
        else if (iaqi > 100 && iaqi <= 150){
            return "#face8a";
        }
        else if (iaqi > 150 && iaqi <= 200){
            return "#f8b8b8";
        }
        else if (iaqi > 200 && iaqi <= 300){
            return "#e8abcb";
        }
        else if (iaqi > 300 && iaqi < 500){
            return "#d0a2ac";
        }
        else if (iaqi >= 500){
            //爆表
            return "#808080";
        }
        return "#ddd";
    }
}


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ffffff',
        height:236,
      },
    content: {
        flex: 1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#00000000',
      },
});