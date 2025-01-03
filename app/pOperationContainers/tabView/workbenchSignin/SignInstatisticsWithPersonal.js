/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2025-01-01 20:54:09
 * @LastEditTime: 2025-01-02 11:43:20
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/tabView/workbenchSignin/SignInstatisticsWithPersonal.js
 */
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { SentencedToEmpty, SentencedToEmptyTimeString, ShowToast } from '../../../utils';
import { SimplePickerRangeDay, StatusPage } from '../../../components';
import moment from 'moment';
import { useSelector } from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import { getEncryptData } from '../../../dvapack/storage';
import { IMAGE_DEBUG, ImageUrlPrefix } from '../../../config';
import { dispatch } from '../../../..';

export default function SignInstatisticsWithPersonal(params) {
    console.log('SignInstatisticsWithPersonal params = ', params);
    const { navigation } = params;
    const [modalVisible, setModelVisible] = useState(false);
    const [largImage, setLargImage] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);
    const { personalResult
        , personalBeginTime
        , personalEndTime
    } = useSelector((state) => state.SignInTeamStatisticsModel);
    useEffect(() => {
        navigation.setOptions({
            title: SentencedToEmpty(params, ['route', 'params', 'params', 'title'], '个人统计'),
        });
    }, [])

    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        beginTime = personalBeginTime;
        endTime = personalEndTime;
        return {
            defaultTime: beginTime,
            start: beginTime,
            end: endTime,
            formatStr: 'YYYY-MM-DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);
                console.log('endMoment = ', endMoment);
                console.log('startMoment = ', startMoment);
                dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                    personalBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                    personalEndTime: endMoment.format('YYYY-MM-DD 23:59:59')
                }));
                dispatch(createAction('SignInTeamStatisticsModel/getPersonSignList')({}));
            }
        };
    }

    getTag = (tagType) => {

        /**
         * 572  非驻厂运维
         * 573  驻厂白班
         * 574  驻厂夜班
         * 
         * 非现场
         * 575  环保局/监测站
         * 576  拜访客户
         * 577  现场检查
         * 578  总部/办事处
         * 581  其他
         */
        // #FFA415
        let _color = '#FFA415', tagTypeStr = '未知';
        if (tagType == 572) {
            _color = '#28DB96';
            tagTypeStr = '非驻厂';
        } else if (tagType == 573) {
            _color = '#4F6BF8';
            tagTypeStr = '白班';
        } else if (tagType == 574) {
            _color = '#FF4747';
            tagTypeStr = '夜班';
        } else if (tagType == 575
            || tagType == 576
            || tagType == 577
            || tagType == 578
            || tagType == 581
            || tagType == 706
            || tagType == 713
        ) {
            _color = '#FFA415';
            tagTypeStr = '非现场';
        } else if (tagType == 0) {
            _color = '#4F6BF8';
            tagTypeStr = '现场';
        }
        return (<View style={{ flexDirection: 'row', width: 44, height: 16 }}>
            <View
                style={[{
                    height: 0, width: 0
                    , borderLeftWidth: 2, borderRightWidth: 2
                    , borderTopWidth: 8, borderBottomWidth: 8
                    , borderLeftColor: 'transparent', borderRightColor: _color
                    , borderTopColor: 'transparent', borderBottomColor: _color
                }]}
            ></View>
            <View
                style={[{
                    height: 16, flex: 1
                    , backgroundColor: _color
                    , justifyContent: 'center', alignItems: 'center'
                }]}
            >

                <Text
                    style={[{
                        color: 'white', fontSize: 8
                        , padding: 0, lineHeight: 10
                    }]}
                >{`${tagTypeStr}`}</Text>
            </View>
            <View
                style={[{
                    height: 0, width: 0
                    , borderLeftWidth: 2, borderRightWidth: 2
                    , borderTopWidth: 8, borderBottomWidth: 8
                    , borderLeftColor: _color, borderRightColor: 'transparent'
                    , borderTopColor: _color, borderBottomColor: 'transparent'
                }]}
            ></View>
        </View>);
    }

    getTagType = (tagType) => {

        /**
         * 572  非驻厂运维
         * 573  驻厂白班
         * 574  驻厂夜班
         * 
         * 非现场
         * 575  环保局/监测站
         * 576  拜访客户
         * 577  现场检查
         * 578  总部/办事处
         * 581  其他
         */
        // #FFA415
        let _color = '#FFA415', tagTypeStr = '未知';
        if (tagType == 572) {
            _color = '#28DB96';
            tagTypeStr = '非驻厂';
        } else if (tagType == 573) {
            _color = '#4F6BF8';
            tagTypeStr = '白班';
        } else if (tagType == 574) {
            _color = '#FF4747';
            tagTypeStr = '夜班';
        } else if (tagType == 575
            || tagType == 576
            || tagType == 577
            || tagType == 578
            || tagType == 581
            || tagType == 706
            || tagType == 713
        ) {
            _color = '#FFA415';
            tagTypeStr = '非现场';
        } else if (tagType == 0) {
            _color = '#4F6BF8';
            tagTypeStr = '现场';
        }
        return { _color, tagTypeStr };
    }

    return (
        <View
            style={[{
                width: SCREEN_WIDTH, flex: 1
                , backgroundColor: '#fff'
            }]}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH, height: 45
                    , justifyContent: 'center', alignItems: 'center'
                }]}
            >
                <View
                    style={[{
                        height: 26, borderRadius: 13
                        , backgroundColor: '#F1F2F4'
                        , paddingHorizontal: 10
                    }]}
                >
                    <SimplePickerRangeDay ref={ref => (this.rangePicker = ref)} style={[{ width: 200, height: 26 }]} option={this.getRangeDaySelectOption()} />
                </View>
            </View>
            <StatusPage
                status={SentencedToEmpty(personalResult, ['status'], 1000)}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    // this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    // this.statusPageOnRefresh();
                }}>
                <ScrollView
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                        , backgroundColor: '#fff'
                    }]}
                >
                    {
                        SentencedToEmpty(personalResult, ['data', 'Datas'], [])
                            .map((item, index) => {
                                return <View
                                    style={[{
                                        width: SCREEN_WIDTH - 40, marginLeft: 20
                                        , marginTop: 5
                                    }]}
                                >
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40, height: 24
                                            , flexDirection: 'row', alignItems: 'center'
                                            , marginBottom: 10
                                        }]}
                                    >
                                        <Text
                                            style={[{
                                                fontSize: 14, color: '#333333'
                                            }]}
                                        >
                                            {item.dateTime}
                                        </Text>
                                        <View
                                            style={[{
                                                width: 1, height: 14
                                                , backgroundColor: '#EAEAEA'
                                                , marginHorizontal: 8
                                            }]}
                                        />
                                        <Text
                                            style={[{
                                                fontSize: 14, color: '#999999'
                                            }]}
                                        >
                                            {`签到${SentencedToEmpty(item, ['count'], '-')}次`}
                                        </Text>
                                    </View>
                                    {
                                        SentencedToEmpty(item, ['list'], [])
                                            .map((signInItem, signInIndex) => {
                                                if (getTagType(signInItem.workType).tagTypeStr == '非现场') {
                                                    return <View
                                                        style={[{
                                                            width: SCREEN_WIDTH - 40, height: 140
                                                            , borderWidth: 1, borderColor: '#EAEAEA'
                                                            , borderRadius: 5, marginBottom: 10
                                                            , justifyContent: 'space-around'
                                                            , paddingVertical: 10
                                                            , marginBottom: 10
                                                        }]}
                                                    >
                                                        <View
                                                            style={[{
                                                                flexDirection: 'row', marginLeft: 15
                                                                , alignItems: 'center'
                                                            }]}
                                                        >
                                                            {getTag(signInItem.workType)}
                                                            <Text
                                                                style={[{
                                                                    fontSize: 14, color: '#000028'
                                                                    , marginLeft: 5
                                                                }]}
                                                            >{`${SentencedToEmptyTimeString(signInItem, ['dateTime'], '--:--', 'HH:mm')}签到`}</Text>
                                                        </View>
                                                        <Text
                                                            style={[{
                                                                fontSize: 13, color: '#666666'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{'地址'}</Text>
                                                        <Text
                                                            numberOfLines={2}
                                                            ellipsizeMode={'middle'}
                                                            style={[{
                                                                fontSize: 13, color: '#333333'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{SentencedToEmpty(signInItem, ['address'], '----')}</Text>
                                                        <Text
                                                            style={[{
                                                                fontSize: 13, color: '#666666'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{'工作类型'}</Text>
                                                        <Text
                                                            style={[{
                                                                fontSize: 13, color: '#333333'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{SentencedToEmpty(signInItem, ['workTypeName'], '----')}</Text>
                                                    </View>
                                                } else {
                                                    return <TouchableOpacity
                                                        onPress={() => {
                                                            let ImgNameList = SentencedToEmpty(signInItem, ['file'], []);
                                                            if (ImgNameList.length == 0) {
                                                                ShowToast('未上传图片');
                                                            } else {
                                                                const ProxyCode = getEncryptData();
                                                                let largImage = [];
                                                                ImgNameList.map((innerItem, key) => {
                                                                    largImage.push({
                                                                        url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${innerItem.FileName}`
                                                                            : `${ImageUrlPrefix}${ProxyCode}/${innerItem.FileName}`,
                                                                        AttachID: item.FileName
                                                                    });
                                                                });
                                                                setLargImage(largImage);
                                                                setModelVisible(true);
                                                                setImageIndex(0);
                                                            }
                                                        }}
                                                    >
                                                        <View
                                                            style={[{
                                                                width: SCREEN_WIDTH - 40, height: 140
                                                                , borderWidth: 1, borderColor: '#EAEAEA'
                                                                , borderRadius: 5, marginBottom: 10
                                                                , justifyContent: 'space-around'
                                                                , paddingVertical: 10
                                                                , marginBottom: 10
                                                            }]}
                                                        >
                                                            <View
                                                                style={[{
                                                                    flexDirection: 'row', marginLeft: 15
                                                                    , alignItems: 'center'
                                                                }]}
                                                            >
                                                                {getTag(572)}
                                                                <Text
                                                                    style={[{
                                                                        fontSize: 14, color: '#000028'
                                                                        , marginLeft: 5
                                                                    }]}
                                                                >{`${SentencedToEmptyTimeString(signInItem, ['dateTime'], '--:--', 'HH:mm')}签到`}</Text>
                                                            </View>
                                                            <Text
                                                                style={[{
                                                                    fontSize: 13, color: '#666666'
                                                                    , marginLeft: 15
                                                                }]}
                                                            >{'企业'}</Text>
                                                            <Text
                                                                numberOfLines={2}
                                                                ellipsizeMode={'middle'}
                                                                style={[{
                                                                    fontSize: 13, color: '#333333'
                                                                    , marginLeft: 15
                                                                }]}
                                                            >{SentencedToEmpty(signInItem, ['entName'], '--')}</Text>
                                                            <Text
                                                                style={[{
                                                                    fontSize: 13, color: '#666666'
                                                                    , marginLeft: 15
                                                                }]}
                                                            >{'签到图片'}</Text>

                                                            <View
                                                                style={[{
                                                                    width: SCREEN_WIDTH / 2
                                                                }]}
                                                            >
                                                                <Text
                                                                    style={[{
                                                                        fontSize: 13, color: '#333333'
                                                                        , marginLeft: 15
                                                                    }]}
                                                                >{`${SentencedToEmpty(signInItem, ['file'], []).length}张`}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                            })
                                    }

                                </View>
                            })
                    }
                </ScrollView >
                <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModelVisible(false)}>
                    <ImageViewer
                        saveToLocalByLongPress={false}
                        menuContext={{ saveToLocal: '保存图片', cancel: '取消' }}
                        onClick={() => {
                            {
                                setModelVisible(false);
                                // this.setState({
                                //     modalVisible: false
                                // });
                            }
                        }}
                        onSave={url => {
                            this.savePhoto(largImage[0].url);
                        }}
                        imageUrls={largImage}
                        // index={0}
                        index={imageIndex}
                    />
                </Modal>
            </StatusPage>
        </View >
    )
}