/*
 * @Description: 示值误差和响应时间 入口
 * @LastEditors: hxf
 * @Date: 2025-02-26 11:53:29
 * @LastEditTime: 2025-02-26 17:29:30
 * @FilePath: /SDLSourceOfPollutionS_dev/app/operationContainers/taskViews/taskExecution/formViews/IndicationErrorAndResponseTimeList.js
 */
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SCREEN_WIDTH } from '../../../../config/globalsize'
import FormInput from '../components/FormInput';
import globalcolor from '../../../../config/globalcolor';
import { MoreSelectTouchable } from '../../../../components';
import { dispatch } from '../../../../..';
import { NavigationActions } from '../../../../utils';

export default function IndicationErrorAndResponseTimeList() {

    getJzConfigItemOption = () => {
        let selectCodes = [

        ];
        let dataSource = [
            {
                ItemName: "SO2"
            }
            , {
                ItemName: "NO"
            }
            , {
                ItemName: "O2"
            }
            , {
                ItemName: "颗粒物"
            }
            , {
                ItemName: "NO2"
            }
            , {
                ItemName: "NMHC"
            }
            , {
                ItemName: "HCl"
            }
        ];
        // dataSource = SentencedToEmpty(this.props, ['JzConfigItemResult', 'data', 'Datas'], []);
        // const JzConfigItemSelectedList = SentencedToEmpty(this.props, ['JzConfigItemSelectedList'], []);
        // if (JzConfigItemSelectedList.length == 0) {
        //     dataSource.map((item, index) => {
        //         if (item.CheckIn == 1) {
        //             selectCodes.push(item.ItemName);
        //         }
        //     });
        // } else {
        //     JzConfigItemSelectedList.map((item, index) => {
        //         selectCodes.push(item.ItemName);
        //     });
        // }

        return {
            contentWidth: 166,
            selectName: '选择污染物',
            placeHolderStr: '污染物',
            codeKey: 'ItemName',
            nameKey: 'ItemName',
            // maxNum: 3,
            selectCode: selectCodes,
            dataArr: dataSource,
            callback: ({ selectCode = [], selectNameStr, selectCodeStr, selectData }) => {
                // selectData.map((item, index) => {
                //     item.ItemID = item.ItemName;
                // });
                // let findIndex = -1;
                // let selectedIndexList = [];
                // let deleteIndexList = [];
                // this.props.calibrationRecordList.map((item, index) => {
                //     if (SentencedToEmpty(item, ['ID'], '') != '') {
                //         findIndex = selectCode.findIndex(codeItem => {
                //             if (codeItem == item.ItemID) {
                //                 return true;
                //             }
                //         });
                //         if (findIndex == -1) {
                //             deleteIndexList.push({ findIndex, dataIndex: index, recordId: item.ID, recordName: item.ItemName });
                //         } else {
                //             selectedIndexList.push({ findIndex, dataIndex: index });
                //         }
                //     }
                // });
                // selectedIndexList.map(selectedDateItem => {
                //     selectData[selectedDateItem.findIndex] = {
                //         ...selectData[selectedDateItem.findIndex],
                //         ...this.props.calibrationRecordList[selectedDateItem.dataIndex]
                //     };
                // });
                // if (deleteIndexList.length > 0) {
                //     this.setState({
                //         newData: selectData,
                //         lastSelectCodes: this._picker.getBeforeSubmitData(),
                //         pageSelectCodes: selectCode,
                //         deleteIndexList
                //     });
                //     this.refs.delConfigItemsAlert.show();
                //     this.props.dispatch(createAction('calibrationRecord/updateState')({ JzConfigItemSelectedList: selectData }));
                // } else {
                //     this.props.dispatch(createAction('calibrationRecord/updateState')({ RecordList: selectData, JzConfigItemSelectedList: selectData }));
                // }
            }
        };
    };

    return (
        <View style={[{
            width: SCREEN_WIDTH, flex: 1
            , alignItems: 'center'
        }]}>
            <View
                style={[{
                    width: SCREEN_WIDTH
                    , paddingHorizontal: 24
                    , backgroundColor: 'white'
                    , marginBottom: 8
                }]}
            >
                <FormInput
                    required={true}
                    requireIconPosition={'left'}
                    hasColon={true}
                    propsLabelStyle={{
                        fontSize: 15
                        , color: globalcolor.textBlack
                    }}
                    propsTextStyle={{ color: globalcolor.datepickerGreyText, fontSize: 14, marginRight: 0 }}
                    label={'维护管理单位'}
                    placeholder="请记录"
                    keyboardType="default"
                    // value={this.state.StandardGasName}
                    value={''}
                    onChangeText={text => {
                        // let temp = {};
                        // temp['StandardGasName'] = text;
                        // this.setState(temp);
                    }}
                />
                <FormInput
                    required={true}
                    requireIconPosition={'left'}
                    hasColon={true}
                    propsLabelStyle={{
                        fontSize: 15
                        , color: globalcolor.textBlack
                    }}
                    propsTextStyle={{ color: globalcolor.datepickerGreyText, fontSize: 14, marginRight: 0 }}
                    label={'测试人员'}
                    placeholder="请记录"
                    keyboardType="default"
                    // value={this.state.StandardGasName}
                    value={''}
                    onChangeText={text => {
                        // let temp = {};
                        // temp['StandardGasName'] = text;
                        // this.setState(temp);
                    }}
                />
            </View>

            <MoreSelectTouchable ref={ref => (this._picker = ref)} option={this.getJzConfigItemOption()} style={[{ marginBottom: 8 }]}>
                <View style={{ width: SCREEN_WIDTH - 16, justifyContent: 'center', alignItems: 'center', height: 45, backgroundColor: 'white', borderRadius: 4 }}>
                    <Text style={{ fontSize: 15, color: globalcolor.taskImfoLabel }}>{'选择校准因子'}</Text>
                </View>
            </MoreSelectTouchable>
            <ScrollView
                style={[{
                    width: SCREEN_WIDTH, marginBottom: 8
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 16, minHeight: 45, backgroundColor: 'white'
                        , borderRadius: 4, marginBottom: 8
                        , marginLeft: 8, paddingHorizontal: 16
                    }]}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 48, height: 45, backgroundColor: 'white'
                            , flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                        }]}
                    >
                        <Text style={[{
                            fontSize: 18, color: '#333333'
                        }]}>{'SO2'}</Text>

                        <TouchableOpacity>
                            <View
                                style={[{
                                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                                    , borderWidth: 1, borderColor: '#999999', borderRadius: 8, height: 32
                                }]}
                            >
                                <View style={[{ width: 12 }]} />
                                <Image source={require('../../../../images/jiarecord.png')} style={[{ width: 16, height: 16, tintColor: globalcolor.antBlue }]} />
                                <Text
                                    style={[{
                                        fontSize: 15, color: globalcolor.antBlue
                                    }]}
                                >{'添加量程'}</Text>
                                <View style={[{ width: 12 }]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 48, borderBottomWidth: 1
                            , borderBottomColor: '#E5E5E5'
                        }]}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 48,
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{
                                fontSize: 18, color: globalcolor.antBlue
                                , flex: 1, marginTop: 12, marginBottom: 6
                            }]}>{'量程1'}</Text>
                            <TouchableOpacity>
                                <View>
                                    <Text style={[{
                                        marginLeft: 32,
                                        fontSize: 18, color: globalcolor.antBlue
                                        , flex: 1, marginTop: 12, marginBottom: 6
                                    }]}>{'删除'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                // 跳转至编辑页面
                                dispatch(NavigationActions.navigate({
                                    routeName: 'IndicationErrorAndResponseTimeEditor',
                                })
                                );
                            }}
                        >
                            <View>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 48,
                                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                    }]}
                                >
                                    <Text style={[{
                                        fontSize: 15, color: '#333333'
                                        , flex: 1, marginVertical: 12
                                    }]}>{'示值误差(%)：0.5'}</Text>
                                    <Text style={[{
                                        fontSize: 15, color: '#333333'
                                        , flex: 1, marginVertical: 12
                                    }]}>{'响应时间：100'}</Text>
                                </View>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 48,
                                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                    }]}
                                >
                                    <Text style={[{
                                        width: SCREEN_WIDTH - 48,
                                        fontSize: 15, color: '#333333'
                                        , flex: 1, lineHeight: 19
                                        , marginBottom: 12
                                    }]}>{`评价依据：当满量程>=200umol/mol(326mg/m3)时，±5%（标称值）`}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 48, borderBottomWidth: 1
                            , borderBottomColor: '#E5E5E5'
                        }]}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 48,
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{
                                fontSize: 18, color: globalcolor.antBlue
                                , flex: 1, marginTop: 12, marginBottom: 6
                            }]}>{'量程2'}</Text>
                            <TouchableOpacity>
                                <View>
                                    <Text style={[{
                                        marginLeft: 32,
                                        fontSize: 18, color: globalcolor.antBlue
                                        , flex: 1, marginTop: 12, marginBottom: 6
                                    }]}>{'删除'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 48,
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{
                                fontSize: 15, color: '#333333'
                                , flex: 1, marginVertical: 12
                            }]}>{'示值误差(未填写)'}</Text>
                            <Text style={[{
                                fontSize: 15, color: '#333333'
                                , flex: 1, marginVertical: 12
                            }]}>{'响应时间(未填写)'}</Text>
                        </View>
                    </View>
                </View>

                <View
                    style={[{
                        width: SCREEN_WIDTH - 16, minHeight: 45, backgroundColor: 'white'
                        , borderRadius: 4, marginBottom: 8
                        , marginLeft: 8, paddingHorizontal: 16
                    }]}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 48, height: 45, backgroundColor: 'white'
                            , flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                        }]}
                    >
                        <Text style={[{
                            fontSize: 18, color: '#333333'
                        }]}>{'SO2'}</Text>

                        <TouchableOpacity>
                            <View
                                style={[{
                                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                                    , borderWidth: 1, borderColor: '#999999', borderRadius: 8, height: 32
                                }]}
                            >
                                <View style={[{ width: 12 }]} />
                                <Image source={require('../../../../images/jiarecord.png')} style={[{ width: 16, height: 16, tintColor: globalcolor.antBlue }]} />
                                <Text
                                    style={[{
                                        fontSize: 15, color: globalcolor.antBlue
                                    }]}
                                >{'添加量程'}</Text>
                                <View style={[{ width: 12 }]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 48, borderBottomWidth: 1
                            , borderBottomColor: '#E5E5E5'
                        }]}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 48,
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{
                                fontSize: 18, color: globalcolor.antBlue
                                , flex: 1, marginTop: 12, marginBottom: 6
                            }]}>{'量程1'}</Text>
                            <TouchableOpacity>
                                <View>
                                    <Text style={[{
                                        marginLeft: 32,
                                        fontSize: 18, color: globalcolor.antBlue
                                        , flex: 1, marginTop: 12, marginBottom: 6
                                    }]}>{'删除'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 48,
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{
                                fontSize: 15, color: '#333333'
                                , flex: 1, marginVertical: 12
                            }]}>{'示值误差(未填写)'}</Text>
                            <Text style={[{
                                fontSize: 15, color: '#333333'
                                , flex: 1, marginVertical: 12
                            }]}>{'响应时间(未填写)'}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}