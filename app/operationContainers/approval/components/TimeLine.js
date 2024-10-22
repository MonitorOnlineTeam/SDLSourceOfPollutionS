//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import globalcolor from '../../../config/globalcolor';
import { NavigationActions, SentencedToEmpty } from '../../../utils';
import { getToken } from '../../../dvapack/storage';

let data0 = [
    {
        ID: '1',
        icon: require('../../../images/icon_correct.png'),
        handler: '我',
        status: 0
    },
    {
        ID: '2',
        icon: require('../../../images/icon_being_approved.png'),
        handler: '王主管',
        status: 1
    }
];

let data1 = [
    {
        ID: '1',
        icon: require('../../../images/icon_correct.png'),
        handler: '我',
        status: 0
    },
    {
        ID: '3',
        icon: require('../../../images/icon_reject_approval.png'),
        handler: '王主管',
        status: 2
    }
];

let data2 = [
    {
        ID: '1',
        icon: require('../../../images/icon_correct.png'),
        handler: '我',
        status: 0
    },
    {
        ID: '4',
        icon: require('../../../images/icon_correct.png'),
        handler: '王主管',
        status: 3
    }
];

// create a component
@connect()
class TimeLine extends PureComponent {
    // renderDetail = (rowData) => {
    //     let title ;
    //     let desc = null;
    //     if (rowData.TaskStatus ==1) {
    //         //待执行 创建任务
    //         // title = <Text style={[styles.title]}>{'响应报警创建任务'}</Text>;
    //         title = <Text style={[styles.title]}>{rowData.Remark}</Text>;
    //         desc = (
    //             <View style={styles.descriptionContainer}>
    //                 <Text style={[styles.textDescription]}>{rowData.CreateUserName}</Text>
    //                 <Text style={[styles.textDescription]}>{rowData.Description}</Text>
    //             </View>
    //         );
    //       } else if (rowData.TaskStatus == 9) {
    //         //签到
    //         // title = <Text style={[styles.title]}>{'打卡开始执行任务'}</Text>;
    //         title = <Text style={[styles.title]}>{rowData.Remark}</Text>;
    //         desc = (
    //             <View style={styles.descriptionContainer}>
    //                 <Text style={[styles.textDescription]}>{rowData.CreateUserName}</Text>
    //                 <Text style={[styles.textDescription]}>{rowData.Description}</Text>
    //             </View>
    //         );
    //       } else if (rowData.TaskStatus == 2) {
    //         //暂存
    //         // title = <Text style={[styles.title]}>{'暂存任务提交表单'}</Text>;
    //         title = <Text style={[styles.title]}>{rowData.Remark}</Text>;
    //         desc = (
    //             <View style={styles.descriptionContainer}>
    //                 <Text style={[styles.textDescription]}>{rowData.CreateUserName}</Text>
    //                 <View style={[{flexDirection:'row',}]}>
    //                 {/* {rowData.FormRecordList.map((item,index)=>{
    //                     return(<TouchableOpacity key={index+rowData.ID} onPress={
    //                         ()=>{
    //                             this.props.dispatch(NavigationActions.navigate({routeName:'KnowledgeBaseWebview',params:{FormUrl:item.FormUrl,title:item.FormName}}));
    //                         }
    //                     }>
    //                             <Text style={[{marginRight:8,fontSize:12,color:'#4499f0'}]}>{item.FormName}</Text>
    //                         </TouchableOpacity>);
    //                 })} */}
    //                 </View>
    //             </View>
    //         );
    //       } else {
    //         //3 完成
    //         // title = <Text style={[styles.title]}>{'结束任务提交表单'}</Text>;
    //         title = <Text style={[styles.title]}>{rowData.Remark}</Text>;
    //         desc = (
    //             <View style={styles.descriptionContainer}>
    //                 <Text style={[styles.textDescription]}>{rowData.CreateUserName}</Text>
    //                 <View style={[{flexDirection:'row',}]}>
    //                 {/* {rowData.FormRecordList.map((item,index)=>{
    //                     return(<TouchableOpacity key={index+rowData.ID}
    //                         onPress={
    //                             ()=>{
    //                                 this.props.dispatch(NavigationActions.navigate({routeName:'KnowledgeBaseWebview',params:{FormUrl:item.FormUrl,title:item.FormName}}));
    //                             }
    //                         }>
    //                             <Text style={[{marginRight:8,fontSize:12,color:'#4499f0'}]}>{item.FormName}</Text>
    //                         </TouchableOpacity>);
    //                 })} */}
    //                 </View>
    //             </View>
    //         );
    //       }
    //     return (
    //       <View style={{flex:1,minHeight:60, marginTop:33,marginLeft:13,}}>
    //         {title}
    //         {desc}
    //       </View>
    //     );
    //   }

    renderDetail = rowData => {
        return (
            <View style={[{ height: '100%', flex: 1 }]}>
                <View style={[{ flexDirection: 'row', width: '100%', marginTop: 42, marginBottom: 5 }]}>
                    <Text style={[{ fontSize: 15, color: '#333', flex: 1 }]}>{rowData.handler}</Text>
                    <Text style={[{ fontSize: 13, color: '#999' }]}>{`${rowData.time}`}</Text>
                </View>
                {this.renderStatus(rowData)}
                {this.renderReason(rowData)}
            </View>
        );
    };

    renderReason = rowData => {
        if (rowData.status == 2) {
            return <Text style={[{ fontSize: 12, color: '#666', marginTop: 15 }]}>{`原因：${SentencedToEmpty(rowData, ['ExamMsg'], '')}`}</Text>;
        }
    };

    renderStatus = rowData => {
        if (rowData.status == 0) {
            return <Text style={[{ fontSize: 13, color: '#53c994' }]}>发起申请</Text>;
        } else if (rowData.status == 1) {
            return <Text style={[{ fontSize: 13, color: '#feb331' }]}>审批中</Text>;
        } else if (rowData.status == 2) {
            return <Text style={[{ fontSize: 13, color: '#fd5d59' }]}>审批未通过</Text>;
        } else if (rowData.status == 3) {
            return <Text style={[{ fontSize: 13, color: '#53c994' }]}>审批通过</Text>;
        }
    };

    _renderItem = ({ item, index }, listData) => {
        return (
            <View
                style={[
                    {
                        flexDirection: 'row',
                        minHeight: 115,
                        width: SCREEN_WIDTH,
                        backgroundColor: globalcolor.white,
                        borderWidth: 0,
                        paddingHorizontal: 20
                    }
                ]}
            >
                {/* <View style={[{height:'100%', width:80, alignItems:'flex-end',}]}>
                    <Text style={[{fontSize:10,color:item.timeColor,marginHorizontal:8,marginRight:13, marginTop:30,}]}>{item.time}</Text>
                </View> */}
                <View style={[{ height: '100%', alignItems: 'center', borderWidth: 0, marginRight: 10 }]}>
                    <View
                        style={[
                            {
                                height: 46,
                                width: index == 0 ? 0 : 1,
                                backgroundColor: globalcolor.borderGreyColor,
                                borderWidth: 0
                            }
                        ]}
                    />
                    <Image source={item.icon} style={[{ height: 23, width: 23 }]} />
                    <View
                        style={[
                            {
                                flex: 1,
                                width: listData.length > index + 1 ? 1 : 0,
                                backgroundColor: globalcolor.borderGreyColor,
                                borderWidth: 0
                            }
                        ]}
                    />
                </View>
                {this.renderDetail(item)}
            </View>
        );
    };

    render() {
        let listData = [];
        let user = getToken();
        //SentencedToEmpty(this.props.approvalDetail,['ImpPersonID'],'')==
        let tempId = 1;
        if (SentencedToEmpty(this.props, ['approvalDetail'], null)) {
            listData.push({
                ID: tempId,
                icon: require('../../../images/icon_correct.png'),
                handler:
                    // user.User_ID == SentencedToEmpty(this.props.approvalDetail, ['ImpPersonID'], '')
                    user.UserId == SentencedToEmpty(this.props.approvalDetail, ['ImpPersonID'], '')
                        ? '我'
                        : SentencedToEmpty(this.props.approvalDetail, ['ImpPerson'], ''),
                status: 0,
                time: SentencedToEmpty(this.props.approvalDetail, ['ImpTime'], '')
            });
            //ExamStatus 0：待审批   1：同意  2：拒绝
            //status    0 发起； 1 待审批； 2 拒绝； 3 同意；
            SentencedToEmpty(this.props.approvalDetail, ['appList'], [])
                .map((item, index) => {
                    tempId += 1
                    listData.push({
                        ID: tempId,
                        icon: item.data.ExamStaus == 0 ? require('../../../images/icon_being_approved.png')
                            : item.data.ExamStaus == 1 ? require('../../../images/icon_correct.png')
                                : item.data.ExamStaus == 2 ? require('../../../images/icon_reject_approval.png')
                                    : require('../../../images/icon_being_approved.png'),
                        handler: item.ExamPerson,
                        status: item.data.ExamStaus == 0 ? 1
                            : item.data.ExamStaus == 1 ? 3
                                : item.data.ExamStaus == 2 ? 2 : 1,
                        time: SentencedToEmpty(item, ['data', 'ExamTime'], ''),
                        ExamMsg: SentencedToEmpty(item, ['data', 'ExamMsg'], '')
                    })
                })
            // switch (SentencedToEmpty(this.props.approvalDetail, ['ExamStatus'], 0)) {
            //     case 0: //待审批
            //         listData = [
            //             {
            //                 ID: '1',
            //                 icon: require('../../../images/icon_correct.png'),
            //                 handler:
            //                     // user.User_ID == SentencedToEmpty(this.props.approvalDetail, ['ImpPersonID'], '')
            //                     user.UserId == SentencedToEmpty(this.props.approvalDetail, ['ImpPersonID'], '')
            //                         ? '我'
            //                         : SentencedToEmpty(this.props.approvalDetail, ['ImpPerson'], ''),
            //                 status: 0,
            //                 time: SentencedToEmpty(this.props.approvalDetail, ['ImpTime'], '')
            //             },
            //             {
            //                 ID: '2',
            //                 icon: require('../../../images/icon_being_approved.png'),
            //                 handler:
            //                     user.User_ID == SentencedToEmpty(this.props.approvalDetail, ['ExamPersonID'], '')
            //                         ? '我'
            //                         : SentencedToEmpty(this.props.approvalDetail, ['ExamPerson'], ''),
            //                 status: 1,
            //                 time: SentencedToEmpty(this.props.approvalDetail, ['ExamTime'], '')
            //             }
            //         ];
            //         break;
            //     case 1: //同意
            //         listData = [
            //             {
            //                 ID: '1',
            //                 icon: require('../../../images/icon_correct.png'),
            //                 handler:
            //                     user.User_ID == SentencedToEmpty(this.props.approvalDetail, ['ImpPersonID'], '')
            //                         ? '我'
            //                         : SentencedToEmpty(this.props.approvalDetail, ['ImpPerson'], ''),
            //                 status: 0,
            //                 time: SentencedToEmpty(this.props.approvalDetail, ['ImpTime'], '')
            //             },
            //             {
            //                 ID: '4',
            //                 icon: require('../../../images/icon_correct.png'),
            //                 handler:
            //                     user.User_ID == SentencedToEmpty(this.props.approvalDetail, ['ExamPersonID'], '')
            //                         ? '我'
            //                         : SentencedToEmpty(this.props.approvalDetail, ['ExamPerson'], ''),
            //                 status: 3,
            //                 time: SentencedToEmpty(this.props.approvalDetail, ['ExamTime'], '')
            //             }
            //         ];
            //         break;
            //     case 2: //拒绝
            //         listData = [
            //             {
            //                 ID: '1',
            //                 icon: require('../../../images/icon_correct.png'),
            //                 handler:
            //                     user.User_ID == SentencedToEmpty(this.props.approvalDetail, ['ImpPersonID'], '')
            //                         ? '我'
            //                         : SentencedToEmpty(this.props.approvalDetail, ['ImpPerson'], ''),
            //                 status: 0,
            //                 time: SentencedToEmpty(this.props.approvalDetail, ['ImpTime'], '')
            //             },
            //             {
            //                 ID: '3',
            //                 icon: require('../../../images/icon_reject_approval.png'),
            //                 handler:
            //                     user.User_ID == SentencedToEmpty(this.props.approvalDetail, ['ExamPersonID'], '')
            //                         ? '我'
            //                         : SentencedToEmpty(this.props.approvalDetail, ['ExamPerson'], ''),
            //                 status: 2,
            //                 ExamMsg: SentencedToEmpty(this.props.approvalDetail, ['ExamMsg'], ''),
            //                 time: SentencedToEmpty(this.props.approvalDetail, ['ExamTime'], '')
            //             }
            //         ];
            //         break;
            // }
        }
        return (
            <FlatList
                data={listData}
                style={[{}]}
                renderItem={(params) => this._renderItem(params, listData)}
                keyExtractor={item => {
                    return item.ID;
                }}
            />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50'
    },
    title: {
        fontSize: 14,
        // fontWeight: 'bold'
        color: '#666666'
    },
    descriptionContainer: {
        paddingRight: 50,
        marginTop: 10
    },
    textDescription: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 10
    }
});

//make this component available to the app
export default TimeLine;
