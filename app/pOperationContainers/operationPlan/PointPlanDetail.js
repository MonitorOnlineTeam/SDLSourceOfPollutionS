/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-05-09 13:34:37
 * @LastEditTime: 2024-05-31 16:41:18
 * @FilePath: /SDLMainProject37/app/pOperationContainers/operationPlan/PointPlanDetail.js
 */
import { Platform, ScrollView, Text, View } from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../config/globalsize';
import { SentencedToEmpty, createAction, createNavigationOptions } from '../../utils';
import { connect } from 'react-redux';
import moment from 'moment';

const testData = [{}, {}, {}]
@connect(({ operationPlanModel }) => ({
    appOperationPlanByPointListResult: operationPlanModel.appOperationPlanByPointListResult,
    appOperationPlanByPointList: operationPlanModel.appOperationPlanByPointList
}))
export default class PointPlanDetail extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '1#脱硫出口',
            // headerRight: navigation.state.params ? navigation.state.params.headerRight : <View style={{ height: 20, width: 20, marginHorizontal: 16 }} />,
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    componentDidMount() {
        // console.log('props = ', this.props);
        this.props.dispatch(createAction('operationPlanModel/getAppOperationPlanByPointList')({}));
    }

    isOverdue = (item, index) => {
        return item.IsDistribution;
        console.log('item = ', item);
        const dateStr = SentencedToEmpty(item, ['TaskDate'], '');
        if (dateStr == '') {
            return false;
        } else {
            let _moment = moment(dateStr);
            if (_moment.isValid()) {
                // return _moment.format('YYYY-MM-DD');
                return _moment.isBefore(moment());
            } else {
                return false;
            }
        }
    }

    getDateStr = (item) => {
        const dateStr = SentencedToEmpty(item, ['TaskDate'], '');
        if (dateStr == '') {
            return '日期错误'
        } else {
            let _moment = moment(dateStr);
            if (_moment.isValid()) {
                return _moment.format('YYYY.MM.DD');
            } else {
                return '日期错误'
            }
        }
    }

    getCycleStr = (item) => {
        const beginTime = SentencedToEmpty(item, ['beginTime'], '');
        const endTime = SentencedToEmpty(item, ['entTime'], '');
        let beginTimeShow = '-';
        let endTimeShow = '-';
        if (beginTime == '') { }
        else {
            let _beginMoment = moment(beginTime);
            if (_beginMoment.isValid()) {
                beginTimeShow = _beginMoment.format('YYYY.MM.DD');
            }
        }
        if (endTime == '') { }
        else {
            let _endMoment = moment(endTime);
            if (_endMoment.isValid()) {
                endTimeShow = _endMoment.format('YYYY.MM.DD');
            }
        }

        return `${beginTimeShow}~${endTimeShow}`
    }

    render() {
        const data = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item'], {});
        return (
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH, height: 44
                        , justifyContent: 'center'
                        , backgroundColor: '#ffffff'
                    }]}
                >
                    <Text
                        style={[{
                            fontSize: 14, color: '#333333'
                            , width: SCREEN_WIDTH - 40
                            , marginLeft: 20
                        }]}
                    >{`运维周期：${this.getCycleStr(data)}`}</Text>
                </View>
                <ScrollView
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                        , marginTop: 6
                    }]}
                >
                    {
                        SentencedToEmpty(this.props, ['appOperationPlanByPointList'], [])
                            .map((item, index) => {
                                return (<View
                                    style={[{
                                        width: SCREEN_WIDTH, height: 65
                                        , flexDirection: 'row'
                                        , backgroundColor: '#ffffff'
                                    }]}
                                >
                                    <View
                                        style={[{
                                            width: 45, height: 65
                                            , paddingLeft: 21,
                                        }]}
                                    >
                                        <View
                                            style={[{
                                                alignItems: 'center'
                                            }]}
                                        >
                                            {index == 0 ? <View
                                                style={[{
                                                    width: 1, height: 15
                                                }]}
                                            /> : <View
                                                style={[{
                                                    width: 1, height: 15
                                                    , backgroundColor: '#c4c4c4'
                                                }]}
                                            />}
                                            <View
                                                style={[{
                                                    width: 14, height: 14, borderRadius: 7
                                                    , backgroundColor: this.isOverdue(item, index) ? '#D2D2D233' : '#4AA0FF33'
                                                    , justifyContent: 'center', alignItems: 'center'
                                                }]}
                                            >
                                                <View
                                                    style={[{
                                                        width: 8, height: 8, backgroundColor: this.isOverdue(item, index) ? '#D2D2D2' : '#4AA0FF'
                                                        , borderRadius: 4
                                                    }]}
                                                ></View>
                                            </View>
                                            {index == this.props.appOperationPlanByPointList.length - 1 ? <View
                                                style={[{
                                                    width: 1, height: 36
                                                }]}
                                            /> : <View
                                                style={[{
                                                    width: 1, height: 36
                                                    , backgroundColor: '#c4c4c4'
                                                }]}
                                            />}
                                        </View>
                                    </View>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 35, height: 65
                                        }]}
                                    >
                                        <View
                                            style={[{
                                                height: 18, width: SCREEN_WIDTH - 70,
                                                marginTop: 13, justifyContent: 'center'
                                            }]}
                                        >
                                            <Text
                                                style={[{
                                                    fontSize: 14, color: this.isOverdue(item, index) ? '#999999' : '#666666',
                                                    width: SCREEN_WIDTH - 70,
                                                }]}
                                            >
                                                {this.getDateStr(item)}
                                            </Text>
                                        </View>
                                        <Text
                                            style={[{
                                                fontSize: 14, color: this.isOverdue(item, index) ? '#999999' : '#666666',
                                                width: SCREEN_WIDTH - 70,
                                                marginTop: 7,
                                            }]}
                                        >
                                            {SentencedToEmpty(item, ['RecordType'], '-')}
                                        </Text>
                                    </View>
                                </View>)
                            })
                    }
                </ScrollView >
            </View >
        )
    }
}