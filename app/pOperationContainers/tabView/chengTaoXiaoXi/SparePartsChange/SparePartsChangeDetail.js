/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-04-29 11:10:51
 * @LastEditTime: 2024-11-05 11:21:10
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/SparePartsChange/SparePartsChangeDetail.js
 */
import { Platform, ScrollView, Text, View } from 'react-native'
import React, { Component } from 'react'
import { SentencedToEmpty, createNavigationOptions } from '../../../../utils';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import globalcolor from '../../../../config/globalcolor';

export default class SparePartsChangeDetail extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '更换详情',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    render() {
        const oneItem = SentencedToEmpty(this.props, ['route', 'params', 'params', 'data'], {})
        console.log('data = ', oneItem);
        return (
            <View
                style={[{
                    flex: 1, width: SCREEN_WIDTH
                }]}
            >
                <ScrollView
                    style={[{
                        width: SCREEN_WIDTH,
                    }]}
                >
                    <ItemOutLayout
                        label={'点位情况：'}
                        content={`${oneItem.IsPoint ? '有监测点' : '设备未安装'}`}
                    />
                    <ItemOutLayout
                        label={'项目编号：'}
                        content={`${SentencedToEmpty(oneItem, ['ProjectCode'], '')}`}
                    />
                    <ItemOutLayout
                        label={'项目名称：'}
                        content={`${SentencedToEmpty(oneItem, ['ProjectName'], '')}`}
                    />
                    <ItemOutLayout
                        label={'企业名称：'}
                        content={`${SentencedToEmpty(oneItem, ['EntName'], '')}`}
                    />
                    {oneItem.IsPoint ? <ItemOutLayout
                        label={'点位名称：'}
                        content={`${SentencedToEmpty(oneItem, ['PointName'], '')}`}
                    /> : null}
                    <ItemOutLayout
                        label={'系统型号：'}
                        content={`${SentencedToEmpty(oneItem, ['SystemModelName'], '')}`}
                    />
                    <ItemOutLayout
                        label={'申请人：'}
                        content={`${SentencedToEmpty(oneItem, ['ApplicationUser'], '')}`}
                    />
                    <ItemOutLayout
                        label={'CIS申请时间：'}
                        content={`${SentencedToEmpty(oneItem, ['ApplicationDate'], '')}`}
                    />
                    <ItemOutLayout
                        label={'物料编码：'}
                        content={`${SentencedToEmpty(oneItem, ['U8Code'], '')}`}
                    />
                    <ItemOutLayout
                        label={'部件名称：'}
                        content={`${SentencedToEmpty(oneItem, ['PartsName'], '')}`}
                    />
                    <ItemOutMultipleLineLayout
                        label={'规格型号：'}
                        content={`${SentencedToEmpty(oneItem, ['ModelType'], '')}`}
                    />
                    <ItemOutLayout
                        label={'CIS更换数量：'}
                        content={`${SentencedToEmpty(oneItem, ['CisChangeCount'], '')}`}
                    />
                    <ItemOutLayout
                        label={'更换数量：'}
                        content={`${SentencedToEmpty(oneItem, ['ReplacementNum'], '')}`}
                    />
                    <ItemOutLayout
                        label={'故障原因：'}
                        content={`${SentencedToEmpty(oneItem, ['FailureCauseName'], '')}`}
                    />
                    <ItemOutLayout
                        label={'更换人：'}
                        content={`${SentencedToEmpty(oneItem, ['ReplacementUser'], '')}`}
                    />
                    <ItemOutLayout
                        label={'更换时间：'}
                        content={`${SentencedToEmpty(oneItem, ['ReplacementTime'], '')}`}
                    />
                </ScrollView>
            </View>
        )
    }
}

class ItemOutLayout extends Component {
    render() {
        return (<View
            style={[{
                width: SCREEN_WIDTH, height: 45
                , backgroundColor: '#fff'
            }]}
        >
            <View style={[{
                width: SCREEN_WIDTH, height: 44
                , paddingHorizontal: 20, flexDirection: 'row'
                , justifyContent: 'center', alignItems: 'center'

            }]}
            >
                <Text
                    style={[{
                        fontSize: 14,
                        color: globalcolor.textBlack
                    }]}
                >{this.props.label}</Text>
                <Text
                    numberOfLines={1}
                    style={[{
                        flex: 1, fontSize: 14,
                        color: globalcolor.datepickerGreyText,
                    }]}
                >{`${this.props.content}`}</Text>

            </View>
            <View
                style={[{
                    width: SCREEN_WIDTH - 40,
                    height: 1, backgroundColor: globalcolor.borderBottomColor,
                    marginLeft: 20
                }]}
            />
        </View>)
    }
}

class ItemOutMultipleLineLayout extends Component {
    render() {
        return (<View
            style={[{
                width: SCREEN_WIDTH, minHeight: 45
                , backgroundColor: '#fff'
            }]}
        >
            <View style={[{
                width: SCREEN_WIDTH, minHeight: 44
                , paddingHorizontal: 20, flexDirection: 'row'
                , justifyContent: 'center'

            }]}
            >
                <Text
                    style={[{
                        marginTop: 13,
                        fontSize: 14,
                        lineHeight: 18,
                        color: globalcolor.textBlack
                    }]}
                >{this.props.label}</Text>
                <Text
                    style={[{
                        marginTop: 13,
                        marginBottom: 13,
                        flex: 1, fontSize: 14,
                        lineHeight: 18,
                        color: globalcolor.datepickerGreyText,
                    }]}
                >{`${this.props.content}`}</Text>

            </View>
            <View
                style={[{
                    width: SCREEN_WIDTH - 40,
                    height: 1, backgroundColor: globalcolor.borderBottomColor,
                    marginLeft: 20
                }]}
            />
        </View>)
    }
}