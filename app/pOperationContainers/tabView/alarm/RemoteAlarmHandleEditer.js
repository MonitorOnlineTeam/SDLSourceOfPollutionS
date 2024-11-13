/*
 * @Description: 处理 异常和缺失报警
 * @LastEditors: hxf
 * @Date: 2023-04-28 10:51:41
 * @LastEditTime: 2024-11-11 13:59:32
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/alarm/RemoteAlarmHandleEditer.js
 */
import moment from 'moment';
import React, { Component } from 'react'
import { Text, TextInput, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { DeclareModule, SDLText, SimpleLoadingComponent, SimpleLoadingView } from '../../../components';
import ImageGrid from '../../../components/form/images/ImageGrid';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../utils';

@connect(({ taskModel }) => ({
    remoteAlarmHandleResult: taskModel.remoteAlarmHandleResult
}))
export default class RemoteAlarmHandleEditer extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '报警处理登记表'),
            headerRight: SentencedToEmpty(navigation, ['state', 'params', 'headerRight'], null) ? navigation.state.params.headerRight : <View style={{ height: 20, width: 20, marginHorizontal: 16 }} />
        });

    constructor(props) {
        super(props);
        this.state = {
            uuid: 'remoteAlarm' + (new Date().getTime()),
            TaskContent: '',
            imageList: []
        };
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props.route, ['params', 'params', 'title'], '报警处理登记表'),
            headerRight: () => <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'响应时限说明'}</Text>;
                }}
                options={{
                    headTitle: '响应时限说明',
                    innersHeight: 220,
                    messText: `报警信息如在8:30-17:30发生，需要在4小时内进行响应，如在其他时间发生，需要在12小时之内进行响应`,
                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                    buttons: [
                        {
                            txt: '知道了',
                            btnStyle: { backgroundColor: '#fff' },
                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                            onpress: () => { }
                        }
                    ]
                }}
            />
        });
        this.props.navigation.setOptions({
            titile: SentencedToEmpty(this.props.route, ['params', 'params', 'title'], '报警处理登记表'),
            headerRight: () => <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'响应时限说明'}</Text>;
                }}
                options={{
                    headTitle: '响应时限说明',
                    innersHeight: 220,
                    messText: `报警信息如在8:30-17:30发生，需要在4小时内进行响应，如在其他时间发生，需要在12小时之内进行响应`,
                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                    buttons: [
                        {
                            txt: '知道了',
                            btnStyle: { backgroundColor: '#fff' },
                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                            onpress: () => { }
                        }
                    ]
                }}
            />
        });
    }

    componentDidMount() {
        this.props.dispatch(createAction('taskModel/updateState')({ remoteAlarmHandleResult: { status: 200 } }));
    }

    /* 渲染标题bar */
    renderBar = (imageRequire, text, iconStyles) => {
        let useIconStyles = { width: 22, height: 22, marginLeft: 13 };
        if (iconStyles && typeof iconStyles != 'undefined') {
            useIconStyles = iconStyles;
        }
        return (
            <View style={{ width: SCREEN_WIDTH, height: 40, flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#fff' }}>
                <Image style={[useIconStyles]} source={imageRequire} />
                <SDLText fontType={'normal'} style={{ color: '#333', fontWeight: 'bold', marginLeft: 6 }}>
                    {text}
                </SDLText>
            </View>
        );
    };

    render() {
        return (
            <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
                {this.renderBar(require('../../../images/icon_task_processing.png'), '处理说明')}
                <View style={{ width: SCREEN_WIDTH, minHeight: 60, backgroundColor: '#fff' }}>
                    {
                        <TextInput
                            editable={true}
                            multiline={true}
                            placeholder={'请填写任务处理说明'}
                            placeholderTextColor={'#999999'}
                            style={{ marginHorizontal: 13, minHeight: 40, marginTop: 4, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#e7e7e7', textAlignVertical: 'top', color: '#666666' }}
                            onChangeText={text => {
                                this.setState({ TaskContent: text });
                            }}
                        >
                            {this.state.TaskContent}
                        </TextInput>
                    }
                </View>
                {this.renderBar(require('../../../images/icon_upload_pictures.png'), '上传图片')}
                <ImageGrid
                    style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                    Imgs={this.state.imageList} isUpload={true} isDel={true} UUID={this.state.uuid}
                    uploadCallback={(imageItems) => {
                        let imageList = this.state.imageList;
                        let newImageList = imageList.concat(imageItems);
                        this.setState({ imageList: newImageList });
                    }}
                    delCallback={(imageIndex) => {
                        let imageList = [...this.state.imageList];
                        imageList.splice(imageIndex, 1);
                        this.setState({ imageList });
                    }}
                />
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    onPress={() => {
                        // 响应报警生成的任务还可以修改，所以不需要确认提交
                        if (this.state.TaskContent == '') {
                            ShowToast('处理说明不能为空！');
                            return;
                        }
                        let params = {
                            "DGIMN": SentencedToEmpty(this.props, ['route', 'params', 'params', 'DGIMN'], ''),
                            "operationEntCode": SentencedToEmpty(this.props, ['route', 'params', 'params', 'operationEntCode'], ''),
                            "Attachments": this.state.uuid,
                            "OperationFlag": SentencedToEmpty(this.props, ['route', 'params', 'params', 'OperationFlag'], ''),
                            "RecordType": SentencedToEmpty(this.props, ['route', 'params', 'params', 'recordType'], ''),
                            "Description": this.state.TaskContent
                        };
                        if ('missData' in SentencedToEmpty(this.props, ['route', 'params', 'params'], {})) {
                            params.missData = 1;
                        }
                        /**
                         * 接口中增加 时间记录
                         * this.props.alarmRecordsListData
                         * beginTime、endTime
                         */
                        const innerParams = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
                        if ('beginTime' in innerParams && 'endTime' in innerParams) {
                            params.beginTime = innerParams.beginTime;
                            params.endTime = innerParams.endTime;
                        }
                        params.alarmID = innerParams.alarmID;
                        this.props.dispatch(
                            createAction('taskModel/CreateAndFinishTask')({
                                params,
                                callback: () => {
                                    // 刷新报警详情
                                    this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsIndex: 1, alarmRecordsTotal: 0, alarmRecordsListDataSelected: [], alarmRecordsListResult: { status: -1 } }));
                                    this.props.dispatch(createAction('pointDetails/getAlarmRecords')({}));
                                    // 刷新报警一级列表
                                    if ('missData' in SentencedToEmpty(this.props, ['route', 'params', 'params'], {})) {
                                        // 缺失报警回调
                                        this.props.dispatch(createAction('alarm/updateState')({ monitorAlarmIndex: 1, monitorAlarmTotal: 0, monitorAlarmResult: { status: -1 } }));
                                        this.props.dispatch(
                                            createAction('alarm/getAlarmRecords')({
                                                params: {
                                                    BeginTime: moment()
                                                        .format('YYYY-MM-DD 00:00:00'),
                                                    EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                    AlarmType: '2',
                                                    PageIndex: 1,
                                                    PageSize: 20
                                                },
                                            })
                                        );
                                    } else {
                                        // 异常报警回调
                                        // 刷新tabview的数字
                                        this.props.dispatch(createAction('alarm/getAlarmCount')({
                                            params: {
                                                alarmType: 'WorkbenchException'
                                            }
                                        }));
                                        // 重制列表 pageindex
                                        this.props.dispatch(
                                            createAction('alarm/updateState')({
                                                sourceType: 'WorkbenchException'
                                                , monitorAlarmIndex: 1, monitorAlarmTotal: 0
                                                , monitorAlarmResult: { status: -1 }
                                            })
                                        );
                                        this.props.dispatch(
                                            createAction('pointDetails/updateState')({
                                                sourceType: 'WorkbenchException'
                                            })
                                        );
                                        this.props.dispatch(
                                            createAction('alarm/getAlarmRecords')({
                                                params: {
                                                    BeginTime: moment()
                                                        .format('YYYY-MM-DD 00:00:00'),
                                                    EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                    AlarmType: '2',
                                                    PageIndex: 1,
                                                    PageSize: 20
                                                },
                                            })
                                        );
                                    }
                                }
                            })
                        );
                    }}
                    style={[
                        {
                            width: SCREEN_WIDTH - 26
                            , marginTop: 10
                            , height: 56
                            , marginLeft: 13
                            , borderRadius: 4
                            , backgroundColor: '#339afe'
                            , justifyContent: 'center'
                            , alignItems: 'center'
                            , marginBottom: 10
                        }
                    ]}>
                    <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                        {'提交'}
                    </SDLText>
                </TouchableOpacity>
                {SentencedToEmpty(this.props, ['remoteAlarmHandleResult', 'status'], 200) == -1 ? <SimpleLoadingComponent message={'提交中'} /> : null}
            </View>
        )
    }
}
