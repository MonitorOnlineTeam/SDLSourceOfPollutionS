/*
 * @Description: 校验测试项目配置功能
 * @LastEditors: hxf
 * @Date: 2023-08-22 11:49:14
 * @LastEditTime: 2024-03-02 10:50:44
 * @FilePath: /SDLMainProject37/app/operationContainers/taskViews/taskExecution/formViews/BdItemSetting.js
 */
import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Image, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import moment from 'moment';
import { SCREEN_WIDTH } from '../../../../../config/globalsize';
import { NavigationActions, createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../../../utils';
import PickerSingleTimeTouchable from '../../../../../components/form/PickerSingleTimeTouchable';
import { connect } from 'react-redux';


@connect(
    ({ bdRecordZBModel }) => ({
        List: bdRecordZBModel.List
    })
)
export default class BdItemSetting extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '校验测试配置',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
            // headerRight: navigation.state.params ? navigation.state.params.headerRight : <View style={{ height: 20, width: 20, marginHorizontal: 16 }} />
        });

    constructor(props) {
        super(props);
        this.state = {
            // 污染物
            pollutantItems: [].concat(this.props.List),

            // 起始时间
            baseTime: moment().format('YYYY-MM-DD HH:mm:00'),
            duration: '', // 时间间隔
            times: '', // 记录数量

            defaultItems: [],
            lastSelectedPollutant: ''
        };
    }

    // 更新数据的方法
    setOption = (params) => {
        this.setState(params);
    }

    getTimeSelectOption = index => {
        // let type = this.props.datatype;
        let type = 'minute'
        return {
            formatStr: 'YYYY-MM-DD HH:mm',
            type: type,
            defaultTime: this.state.baseTime,
            onSureClickListener: time => {
                this.setOption({
                    baseTime: moment(time).format('YYYY-MM-DD HH:mm:00')
                })
            }
        };
    };

    // 选中需要配置的校验测试污染因子
    setPollutantSelected = (item, index) => {
        let temp = { ...this.state.pollutantItems[index] };
        temp.selected = !SentencedToEmpty(temp, ['selected'], false);
        let params = [].concat(this.state.pollutantItems);
        params[index] = temp;
        // 获取需要至少九条记录的因子
        let less9TimePollutant = '';
        params.map((item) => {
            if (item.ItemID == '162'
                || item.ItemID == '163'
                || item.ItemID == '164'
            ) {
                if (less9TimePollutant == '') {
                    less9TimePollutant = item.Name;
                } else {
                    less9TimePollutant = less9TimePollutant + `、${item.Name}`;
                }
            }
        })
        this.setState({
            pollutantItems: params,
            less9TimePollutant
        });
    }

    /**
     * 
     *  if ('162' == this.state.ItemID || '163' == this.state.ItemID || '164' == this.state.ItemID) {
            //气态至少9对
            if (this.state.TestResult.length < 9) {
                ShowToast(this.state.Name + '最少需要测量9次');
                return;
            }
        } else {
            if (this.state.TestResult.length < 5) {
                ShowToast(this.state.Name + '最少需要测量5次');
                return;
            }
        }
     */
    // 生成记录
    createRecords = () => {
        let selected = [];
        let less9TimePollutant = '';
        this.state.pollutantItems.map((item) => {
            if (item.selected) {
                selected.push(item);
                /**
                 * todo list
                 * CO、HCL、NMHC 创建时提示应大于9条
                 */
                if (item.ItemID == '162'
                    || item.ItemID == '163'
                    || item.ItemID == '164'
                ) {
                    if (less9TimePollutant == '') {
                        less9TimePollutant = item.Name;
                    } else {
                        less9TimePollutant = less9TimePollutant + `、${item.Name}`;
                    }
                }
            }
        });
        if (selected.length == 0) {
            ShowToast('未选中任何污染物！');
            return;
        }
        const duration = parseInt(this.state.duration);
        if (typeof duration != 'number') {
            ShowToast('时间间隔必须为数字！');
            return;
        } else if (duration <= 0) {
            ShowToast('时间间隔必须为大于0！');
            return;
        }
        if (typeof parseInt(this.state.times) != 'number') {
            ShowToast('记录数量必须为数字！');
            return;
        } else if (this.state.times < 5) {
            ShowToast('记录数量应该大于5！');
            // return;
        } else if (less9TimePollutant != '' && this.state.times < 9) {
            ShowToast(`包含${less9TimePollutant}，记录数量需要大于9`);
            // return;
        }
        let i = 0;
        let newList = [];
        const baseTime = this.state.baseTime;

        for (i = 0; i < this.state.times; i++) {
            newList.push({
                beginIsEdited: false,
                endIsEdited: false,
                beginTime: moment(baseTime).add(i * duration, 'minutes').format('YYYY-MM-DD HH:mm:00'),
                // EndTime: moment(baseTime).add((i+1)*duration,'minutes').format('YYYY-MM-DD HH:mm:00'),
                EndTime: moment(baseTime).add((i + 1) * duration - 1, 'minutes').format('YYYY-MM-DD HH:mm:59'),
            });
        }
        this.setState({
            defaultItems: newList,
            lastSelectedPollutant: less9TimePollutant,
        });
    }

    // 向校验测试记录中装在数据
    commit = () => {
        const defaultItems = this.state.defaultItems;
        if (defaultItems.length <= 0) {
            ShowToast('您还没有生成记录！');
            return;
        }
        // if (defaultItems.length < 5) {
        //     ShowToast('记录数量必须为大于5！');
        //     return;
        // }
        // if (defaultItems.length < 9&&this.state.less9TimePollutant!='') {
        //     ShowToast(`包含${this.state.less9TimePollutant}，记录数量需要大于9`);
        //     return;
        // }
        /**
         *  ItemName: this.state.Name,
            ItemID: this.state.ItemID,
            TestTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            CbValue: '', //参比方法测定值
            CemsTextValue: '' //CEMS测定值
         */
        /**
         * "ItemName":"流速",
         * "ItemID":"165",
         * "TestTime":"2023-08-23 15:58:05",
         * "CbValue":"2",
         * "CemsTextValue":"2"
         */
        let listTemp = SentencedToEmpty(this.props, ['List'], []).concat([]);
        let testResultTemp = [];
        listTemp.map((item) => {
            this.state.pollutantItems.map((_pollutantItem) => {
                if (_pollutantItem.selected
                    && _pollutantItem.ItemID == item.ItemID) {
                    testResultTemp = [];
                    defaultItems.map((_defaultItem) => {
                        testResultTemp.push({
                            ItemName: item.ItemName,
                            ItemID: item.ItemID,
                            TestTime: _defaultItem.beginTime,
                            CbValue: '',
                            CemsTextValue: '',
                            ..._defaultItem,
                        })
                    });
                    item.TestResult = testResultTemp;
                    item.EvaluateResults = 2;
                }
            });
        });
        this.props.dispatch(
            createAction('bdRecordZBModel/updateState')({
                List: listTemp
            })
        );
        this.props.dispatch(
            NavigationActions.back()
        );
    }

    // 测试记录长度是否符合要求
    checkLessItemCount = (minusOne = false) => {
        const defaultItems = this.state.defaultItems;
        let length = defaultItems.length;
        if (minusOne) {
            length = length - 1;
        }
        if (length < 5) {
            ShowToast('记录数量必须为大于5！');
            return false;
        }
        if (length < 9 && this.state.less9TimePollutant != '') {
            ShowToast(`包含${this.state.less9TimePollutant}，记录数量需要大于9`);
            return false;
        }
        return true;
    }

    getListTimeSelectOption = (index, timePickerType) => {
        let type = 'minute'
        const record = this.state.defaultItems[index];
        if (timePickerType == 'begin') {
            return {
                formatStr: 'YYYY-MM-DD HH:mm',
                type: type,
                defaultTime: record.beginTime,
                onSureClickListener: time => {
                    let newData = this.state.defaultItems.concat([]);
                    newData[index].beginTime = moment(time).format('YYYY-MM-DD HH:mm:00');
                    newData[index].beginIsEdited = true;
                    this.setOption({
                        defaultItems: newData
                    })
                }
            };
        } else if (timePickerType == 'end') {
            return {
                formatStr: 'YYYY-MM-DD HH:mm',
                type: type,
                defaultTime: record.EndTime,
                onSureClickListener: time => {
                    let newData = this.state.defaultItems.concat([]);
                    newData[index].EndTime = moment(time).format('YYYY-MM-DD HH:mm:00');
                    newData[index].endIsEdited = true;
                    this.setOption({
                        defaultItems: newData
                    })
                }
            };
        }
    }

    render() {
        return (<KeyboardAvoidingView style={{ width: SCREEN_WIDTH, flex: 1, alignItems: 'center' }} behavior={Platform.OS == 'ios' ? 'padding' : ''} keyboardVerticalOffset={100}>
            <ScrollView style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <View style={[{
                    width: SCREEN_WIDTH, flexDirection: 'row'
                    , paddingTop: 15, paddingLeft: 10, paddingRight: 20
                    , flexWrap: 'wrap', backgroundColor: 'white'
                }]}>
                    {
                        this.state.pollutantItems.map((item, index) => {
                            return (<TouchableOpacity
                                onPress={() => {
                                    this.setPollutantSelected(item, index);
                                }}
                                style={[{ marginLeft: 10, marginBottom: 10 }]}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 30) / 3 - 10, height: 30, flexDirection: 'row'
                                        , borderWidth: 1, borderColor: SentencedToEmpty(item, ['selected'], false) ? '#4AA0FF' : '#E7E7E7'
                                        , borderRadius: 2.5, justifyContent: 'space-between'
                                        , alignItems: 'center', backgroundColor: '#FBFBFD'
                                    }]}
                                >
                                    <View style={[{ height: 30, width: 16, justifyContent: 'flex-end' }]}></View>
                                    <Text style={[{
                                        fontSize: 12
                                        , color: SentencedToEmpty(item, ['selected'], false) || item.EvaluateResults == '2' ? '#4AA0FF'
                                            : item.EvaluateResults == '0' ? '#ef4d4d'
                                                : (item.EvaluateResults == '1') ? '#33c066' : '#333333'
                                    }]}>{`${item.Name}`}</Text>
                                    <View style={[{ height: 30, width: 16, justifyContent: 'flex-end', alignItems: 'flex-end', borderBottomRightRadius: 2.5 }]}>
                                        {
                                            SentencedToEmpty(item, ['selected'], false) ?
                                                <Image
                                                    source={require('../../../../../images/ic_rb_corner_selected.png')}
                                                    style={[{ width: 16, height: 15, borderBottomRightRadius: 2.5 }]}
                                                />
                                                : null
                                        }

                                    </View>
                                </View>
                            </TouchableOpacity>);
                        })
                    }
                    <View style={[{ width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#E7E7E7' }]}></View>

                    <View style={[{ width: SCREEN_WIDTH - 40, height: 44, marginLeft: 10 }]}>
                        <View style={[{
                            width: SCREEN_WIDTH - 40, height: 43, flexDirection: 'row'
                            , alignItems: 'center'
                        }]}>
                            <Text style={[{ fontSize: 14, color: '#333333' }]}>{'起始时间'}</Text>
                            <PickerSingleTimeTouchable style={[{ flex: 1, height: 43 }]}
                                option={this.getTimeSelectOption()}
                            >
                                <View style={[{
                                    flex: 1, height: 43
                                    , flexDirection: 'row', alignItems: 'center'
                                }]}>
                                    <Text style={[{ flex: 1, textAlign: 'right', fontSize: 14, color: '#666666' }]}>{`${moment(this.state.baseTime).format('YYYY-MM-DD HH:mm')}`}</Text>
                                    <Image source={require('../../../../../images/ic_time.png')}
                                        style={[{ width: 18, height: 18, tintColor: '#4DA9FF', marginLeft: 11 }]}
                                    />
                                </View>

                            </PickerSingleTimeTouchable>
                        </View>
                        <View style={[{ width: SCREEN_WIDTH - 40, height: 1, backgroundColor: '#E7E7E7' }]}></View>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH - 40, height: 44, marginLeft: 10 }]}>
                        <View style={[{
                            width: SCREEN_WIDTH - 40, height: 43, flexDirection: 'row'
                            , alignItems: 'center'
                        }]}>
                            <Text style={[{ fontSize: 14, color: '#333333' }]}>{'时间间隔'}</Text>
                            <TextInput
                                editable={true}
                                keyboardType={'numeric'}
                                placeholderTextColor="#999999"
                                placeholder="请输入"
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                underlineColorAndroid={'transparent'}
                                onChangeText={text => {
                                    //动态更新组件内state 记录输入内容
                                    this.setOption({ duration: text });
                                }}
                                value={this.state.duration + ''}
                                style={{ textAlign: 'right', color: '#666666', flex: 1, height: 43, fontSize: 14 }}
                            />
                            <Text style={[{ width: 40, fontSize: 14, color: '#333333', marginLeft: 15, textAlign: 'right' }]}>{'分钟'}</Text>
                        </View>
                        <View style={[{ width: SCREEN_WIDTH - 40, height: 1, backgroundColor: '#E7E7E7' }]}></View>
                    </View>
                    <View style={[{
                        width: SCREEN_WIDTH - 40, height: 43, flexDirection: 'row'
                        , alignItems: 'center', marginLeft: 10
                    }]}>
                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{'记录数量'}</Text>
                        <TextInput
                            editable={true}
                            keyboardType={'numeric'}
                            placeholderTextColor="#999999"
                            placeholder="请输入"
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            onChangeText={text => {
                                //动态更新组件内state 记录输入内容
                                this.setOption({ times: text });

                            }}
                            value={this.state.times + ''}
                            style={{ textAlign: 'right', color: '#666666', flex: 1, height: 43, fontSize: 14 }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.createRecords()
                            }}
                            style={[{ marginLeft: 15 }]}
                        >
                            <View style={[{
                                width: 40, height: 20
                                , backgroundColor: '#4DA9FF', borderRadius: 2
                                , justifyContent: 'center', alignItems: 'center'
                            }]}>
                                <Text style={[{ fontSize: 12, color: 'white' }]}>{'生成'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    this.state.defaultItems.map((item, index) => {
                        return (<View style={[{
                            width: SCREEN_WIDTH, paddingHorizontal: 10
                        }]}>
                            <View style={[{
                                height: 34, width: SCREEN_WIDTH - 20
                                , paddingHorizontal: 10, flexDirection: 'row'
                                , alignItems: 'center', justifyContent: 'space-between'
                            }]}>
                                <Text style={[{ fontSize: 15, color: '#666' }]}>{`第${index + 1}组`}</Text>
                                <TouchableOpacity
                                    onPress={() => {

                                    }}
                                >
                                    <Text style={[{ fontSize: 15, color: '#666' }]}>{'删除'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[{ width: SCREEN_WIDTH - 20, backgroundColor: 'white' }]}>
                                <View style={[{ width: SCREEN_WIDTH - 40, height: 44, marginLeft: 10 }]}>
                                    <View style={[{
                                        width: SCREEN_WIDTH - 40, height: 43, flexDirection: 'row'
                                        , alignItems: 'center'
                                    }]}>
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{'起始时间'}</Text>
                                        <PickerSingleTimeTouchable style={[{ flex: 1, height: 43 }]}
                                            option={this.getListTimeSelectOption(index, 'begin')}
                                        >
                                            <View style={[{
                                                flex: 1, height: 43
                                                , flexDirection: 'row', alignItems: 'center'
                                            }]}>
                                                <View style={[{ flex: 1, height: 43, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }]}>
                                                    <View style={[{
                                                        height: 24, borderRadius: 4
                                                        , backgroundColor: item.beginIsEdited ? 'white' : '#ffc207'
                                                        , alignItems: 'center', justifyContent: 'center'
                                                    }]}>
                                                        <Text style={[{ marginHorizontal: 4, fontSize: 14, color: item.beginIsEdited ? '#666666' : 'white' }]}>{`${moment(item.beginTime).format('HH:mm')
                                                            }`}</Text>
                                                    </View>
                                                </View>
                                                <Image source={require('../../../../../images/ic_time.png')}
                                                    style={[{ width: 18, height: 18, tintColor: '#4DA9FF', marginLeft: 11 }]}
                                                />
                                            </View>

                                        </PickerSingleTimeTouchable>
                                    </View>
                                    <View style={[{ width: SCREEN_WIDTH - 40, height: 1, backgroundColor: '#E7E7E7' }]}></View>
                                </View>
                                <View style={[{ width: SCREEN_WIDTH - 40, height: 44, marginLeft: 10 }]}>
                                    <View style={[{
                                        width: SCREEN_WIDTH - 40, height: 43, flexDirection: 'row'
                                        , alignItems: 'center'
                                    }]}>
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{'结束时间'}</Text>
                                        <PickerSingleTimeTouchable style={[{ flex: 1, height: 43 }]}
                                            option={this.getListTimeSelectOption(index, 'end')}
                                        >
                                            <View style={[{
                                                flex: 1, height: 43
                                                , flexDirection: 'row', alignItems: 'center'
                                            }]}>
                                                <View style={[{ flex: 1, height: 43, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }]}>
                                                    <View style={[{
                                                        height: 24, borderRadius: 4
                                                        , backgroundColor: item.endIsEdited ? 'white' : '#ffc207'
                                                        , alignItems: 'center', justifyContent: 'center'
                                                    }]}>
                                                        <Text style={[{ marginHorizontal: 4, fontSize: 14, color: item.endIsEdited ? '#666666' : 'white' }]}>{`${moment(item.EndTime).format('HH:mm')
                                                            }`}</Text>
                                                    </View>
                                                </View>
                                                <Image source={require('../../../../../images/ic_time.png')}
                                                    style={[{ width: 18, height: 18, tintColor: '#4DA9FF', marginLeft: 11 }]}
                                                />
                                            </View>
                                        </PickerSingleTimeTouchable>
                                    </View>
                                </View>
                            </View>
                        </View>);
                    })
                }

            </ScrollView>
            <View style={styles.bottomOperate}>
                <TouchableOpacity
                    style={styles.commit}
                    onPress={() => {
                        this.commit();
                    }}
                >
                    <Text style={{ fontSize: 17, color: '#ffffff' }}>确认</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>)
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2'
    },
    scroll: {
        flex: 1,
        width: SCREEN_WIDTH
    },
    scrollContent: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: '#00000000'
    },

    itemcontainer: {
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#00000000'
    },

    itemtitle: {
        paddingLeft: 13,
        paddingRight: 13,
        backgroundColor: '#00000000',
        height: 37,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    itemContent: {
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    item: {
        width: '100%',
        height: 40,
        paddingLeft: 13,
        paddingRight: 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    textlabel: {
        fontSize: 14,
        color: '#333333'
    },

    textcontent: {
        flex: 1,
        fontSize: 14,
        color: '#666666',
        textAlign: 'right'
    },

    textinput: {
        flex: 1,
        fontSize: 14,
        color: '#666666',
        textAlign: 'right'
    },

    line: {
        height: 1,
        backgroundColor: '#e7e7e7'
    },

    bottomOperate: {
        marginTop: 10,
        width: SCREEN_WIDTH,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000000'
    },
    del: {
        marginTop: 10,
        width: 282,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ee9944',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    commit: {
        marginBottom: 15,
        marginTop: 10,
        width: SCREEN_WIDTH - 20,
        height: 44,
        borderRadius: 2,
        backgroundColor: '#4499f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});