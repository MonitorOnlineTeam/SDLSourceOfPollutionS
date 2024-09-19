//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { SCREEN_WIDTH } from '../../../../config/globalsize';
import globalcolor from '../../../../config/globalcolor';
import { NavigationActions } from '../../../../utils';
import TaskImformationHeader from './TaskImformationHeader';

// create a component
@connect()
class TimeLine extends PureComponent {

    renderDetail = (rowData) => {
        let title ;
        let desc = null;
        if (rowData.TaskStatus ==1) {
            //待执行 创建任务
            // title = <Text style={[styles.title]}>{'响应报警创建任务'}</Text>;
            title = <Text style={[styles.title]}>{rowData.Remark}</Text>;
            desc = (
                <View style={styles.descriptionContainer}>   
                    <Text style={[styles.textDescription]}>{rowData.CreateUserName}</Text>
                    <Text style={[styles.textDescription]}>{rowData.Description}</Text>
                </View>
            );
          } else if (rowData.TaskStatus == 9) {
            //签到
            // title = <Text style={[styles.title]}>{'打卡开始执行任务'}</Text>;
            title = <Text style={[styles.title]}>{rowData.Remark}</Text>;
            desc = (
                <View style={styles.descriptionContainer}>   
                    <Text style={[styles.textDescription]}>{rowData.CreateUserName}</Text>
                    <Text style={[styles.textDescription]}>{rowData.Description}</Text>
                </View>
            );
          } else if (rowData.TaskStatus == 2) {
            //暂存
            // title = <Text style={[styles.title]}>{'暂存任务提交表单'}</Text>;
            title = <Text style={[styles.title]}>{rowData.Remark}</Text>;
            desc = (
                <View style={styles.descriptionContainer}>   
                    <Text style={[styles.textDescription]}>{rowData.CreateUserName}</Text>
                    <View style={[{flexDirection:'row',}]}>
                    {/* {rowData.FormRecordList.map((item,index)=>{
                        return(<TouchableOpacity key={index+rowData.ID} onPress={
                            ()=>{
                                this.props.dispatch(NavigationActions.navigate({routeName:'KnowledgeBaseWebview',params:{FormUrl:item.FormUrl,title:item.FormName}}));
                            }
                        }>
                                <Text style={[{marginRight:8,fontSize:12,color:'#4499f0'}]}>{item.FormName}</Text>
                            </TouchableOpacity>);
                    })} */}
                    </View>
                </View>
            );
          } else {
            //3 完成
            // title = <Text style={[styles.title]}>{'结束任务提交表单'}</Text>;
            title = <Text style={[styles.title]}>{rowData.Remark}</Text>;
            desc = (
                <View style={styles.descriptionContainer}>   
                    <Text style={[styles.textDescription]}>{rowData.CreateUserName}</Text>
                    <View style={[{flexDirection:'row',}]}>
                    {/* {rowData.FormRecordList.map((item,index)=>{
                        return(<TouchableOpacity key={index+rowData.ID}
                            onPress={
                                ()=>{
                                    this.props.dispatch(NavigationActions.navigate({routeName:'KnowledgeBaseWebview',params:{FormUrl:item.FormUrl,title:item.FormName}}));
                                }
                            }>
                                <Text style={[{marginRight:8,fontSize:12,color:'#4499f0'}]}>{item.FormName}</Text>
                            </TouchableOpacity>);
                    })} */}
                    </View>
                </View>
            );
          }
        return (
          <View style={{flex:1,minHeight:60, marginTop:33,marginLeft:13,}}>
            {title}
            {desc}
          </View>
        );
      }

    _renderItem = ({item,index}) => {
        return (
            <View style={[{flexDirection:'row', alignItems:'center', minHeight:80, width:SCREEN_WIDTH, backgroundColor:globalcolor.white, borderWidth:0,}]}>
                <View style={[{height:'100%', width:80, alignItems:'flex-end',}]}>
                    <Text style={[{fontSize:10,color:item.timeColor,marginHorizontal:8,marginRight:13, marginTop:30,}]}>{item.time}</Text>
                </View>
                <View style={[{height:'100%', alignItems:'center', borderWidth:0, }]}>
                    <View style={[{height:26,width:index == 0?0:1,backgroundColor:globalcolor.borderGreyColor,borderWidth:0,}]}></View>
                    <Image source={item.icon} style={[{height:32, width:32,}]}/>
                    <View style={[{flex:1,width:this.props.data.length-1 == index&&index != 0?0:1,backgroundColor:globalcolor.borderGreyColor,borderWidth:0,}]}></View>
                </View>
                <View style={[{justifyContent:'center', flex:1, }]}>
                    {this.renderDetail(item)}
                </View>
            </View>
        );
    }

    render() {
        return (
            <FlatList
                ListHeaderComponent={<TaskImformationHeader />}
                data={this.props.data}
                style={[{}]}
                renderItem={this._renderItem}
                keyExtractor={(item)=>{return item.ID;}} />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    title:{
        fontSize:14,
        // fontWeight: 'bold'
        color:'#666666'
    },
    descriptionContainer:{
        paddingRight: 50,
        marginTop:10,
    },
    textDescription:{
        fontSize:12,
        color:'#666666',
        marginBottom:10,
    },
});

//make this component available to the app
export default TimeLine;
