/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-04-26 11:47:43
 * @LastEditTime: 2024-05-16 14:48:05
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/SparePartsChange/SparePartsChangeEditor.js
 */
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../../utils';
import Popover from 'react-native-popover';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import Form2Switch from '../../../../operationContainers/taskViews/taskExecution/components/Form2Switch';
import FormDatePicker from '../../../../operationContainers/taskViews/taskExecution/components/FormDatePicker';
import FormPicker from '../../../../operationContainers/taskViews/taskExecution/components/FormPicker';
import FormInput from '../../../../operationContainers/taskViews/taskExecution/components/FormInput';
import globalcolor from '../../../../config/globalcolor';
import { connect } from 'react-redux';
import moment from 'moment';
import { OperationAlertDialog, StatusPage } from '../../../../components';
import { getToken } from '../../../../dvapack/storage';

@connect(({ CTModel, CTSparePartsChangeModel }) => ({
    dispatchId: CTModel.dispatchId,
    projectEntPointSysModelResult: CTModel.projectEntPointSysModelResult,
    cemsSystemModelInventoryResult: CTSparePartsChangeModel.cemsSystemModelInventoryResult, // 获取所有的系统型号参数 结果
    cisPartsListResult: CTSparePartsChangeModel.cisPartsListResult, // 获取CIs申请单列表 结果

    equipmentInstalled: CTSparePartsChangeModel.equipmentInstalled, // 点位情况
    failureCause: CTSparePartsChangeModel.failureCause, // 故障原因列表
}))
export default class SparePartsChangeEditor extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '备件更换',
            // headerTitleStyle: { marginRight: 0 },
            headerRight: (
                <View>
                    <TouchableOpacity
                        style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
                        onPress={(e) => {
                            const {
                                nativeEvent: { pageX, pageY }
                            } = e;
                            navigation.state.params.navigateRightPress(pageX, pageY);
                        }}
                    >
                        <Image source={require('../../../../images/ic_more_option.png')} style={{ width: 18, height: 18, marginRight: 16, tintColor: '#fff' }} />
                    </TouchableOpacity>
                </View>
            )
        });
    };

    constructor(props) {
        super(props);
        console.log('constructor props = ', props);
        const user = getToken();
        const from = SentencedToEmpty(props
            , ['navigation', 'state', 'params', 'form'], '');

        let comiteParams = {
            "recordType": 2, //1.派单备件更换2.工作台备件更换
            "cList": [
                {
                    // "id": "string", // 主表ID
                    // "mainId": "string", // 派单iD
                    "projectId": "", // 项目iD
                    "entId": "", // 企业iD
                    "pointId": "", // 监测点ID
                    "projectCode": "", // 合同号
                    "projectName": "", // 项目名称
                    "systemModeId": "", // 系统型号ID
                    "cisPartId": "", // cis申请单ID
                    "replacementNum": "", // 更换数量
                    "failureCause": "", // 故障原因
                    "replacementUser": user.UserName, // 更换人
                    "replacementTime": monent().format('YYYY-MM-DD'), // 更换日期
                    // "updateUser": "",
                    // "createUser": "",
                    // "createTime": "2024-05-09T10:41:26.590Z",
                    // "updateTime": "2024-05-09T10:41:26.590Z",
                    // "serviceId": "string", // 服务属性ID
                    // "recordId": "string", // 表单ID
                    // "col1": "string",
                    // "col2": "string"
                }
            ]
        }
        if (from == 'ChengTaoTaskDetail') {
            const recordId = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'firstItem', 'ItemId'], '');
            comiteParams = {
                "recordType": 2, //1.派单备件更换2.工作台备件更换
                "cList": [
                    {
                        MainId: dispatchId, // 如果是服务属性的单子传
                        ServiceId: serviceId, // 如果是服务属性的单子传
                        RecordId: recordId, // 如果是服务属性的单子传
                        // "id": "string", // 主表ID
                        // "mainId": "string", // 派单iD
                        "projectId": "", // 项目iD
                        "entId": "", // 企业iD
                        "pointId": "", // 监测点ID
                        "projectCode": "", // 合同号
                        "projectName": "", // 项目名称
                        "systemModeId": "", // 系统型号ID
                        "cisPartId": "", // cis申请单ID
                        "replacementNum": "", // 更换数量
                        "failureCause": "", // 故障原因
                        "replacementUser": user.UserName, // 更换人
                        "replacementTime": monent().format('YYYY-MM-DD'), // 更换日期
                        // "updateUser": "",
                        // "createUser": "",
                        // "createTime": "2024-05-09T10:41:26.590Z",
                        // "updateTime": "2024-05-09T10:41:26.590Z",
                        // "serviceId": "string", // 服务属性ID
                        // "recordId": "string", // 表单ID
                        // "col1": "string",
                        // "col2": "string"
                    }
                ]
            }
        }


        this.state = {
            isVisible: false,
            spinnerRect: {},
            data: { Status: 1 },
            projectList: [], // 项目列表
            entList: [], // 企业列表
            pointList: [], // 点位列表
            systemModleList: [], // 系统型号列表
            // 提交参数
            comiteParams: comiteParams,
        };
        this.props.navigation.setParams({
            navigateRightPress: (pageX, pageY) => {
                this.showSpinner(pageX, pageY);
            }
        });
    }

    componentDidMount() {
        this.props.dispatch(createAction('CTModel/updateState')({
            projectEntPointSysModelResult: { status: -1 }
        }));
        this.props.dispatch(createAction('CTSparePartsChangeModel/updateState')({
            cemsSystemModelInventoryResult: { status: -1 },
            cisPartsListResult: { status: -1 },
            equipmentInstalled: -1
        }))


        this.props.dispatch(createAction('CTSparePartsChangeModel/getCemsSystemModelInventory')({}));
        this.props.dispatch(createAction('CTSparePartsChangeModel/getCisPartsList')({}));

        this.props.dispatch(createAction('CTModel/getProjectEntPointSysModel')({
            params: {
            }
            , callback: (result) => {
                this.setState({
                    //     stateDatas,
                    // entList: SentencedToEmpty(result, ['data', 'Datas'], [])
                    projectList: SentencedToEmpty(result, ['data', 'Datas'], [])
                }, () => {
                    this.props.dispatch(createAction('CTModel/updateState')({
                        projectEntPointSysModelResult: result
                    }))
                });
                return true;
            }
        }));
    }

    //显示下拉列表
    showSpinner = (pageX, pageY) => {
        pageY = 35;
        const width = 44,
            height = 44;
        const placement = 'bottom';
        this.setState({
            isVisible: true,
            spinnerRect: { x: pageX - width / 2, y: placement == 'bottom' ? pageY - 80 : pageY - 50, width: width, height: height }
        });
    };

    //隐藏下拉列表
    closeSpinner() {
        this.setState({
            isVisible: false
        });
    }

    getDDateOption = () => {
        return {
            defaultTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: 'day',
            onSureClickListener: (time, setTime) => {
                // replacementTime
                this.upDateComiteData([{
                    key: 'replacementTime', value: time
                }])
            },
        };
    };

    getReplacementTimeStr = () => {
        const comiteParamsData = SentencedToEmpty(this.state
            , ['comiteParams', 'cList', 0], {});
        const replacementTime = SentencedToEmpty(comiteParamsData, ['replacementTime'], '')
        if (replacementTime == '') {
            return '请选择更换时间'
        }
        const momentTime = moment(replacementTime);
        if (momentTime.isValid()) {
            return momentTime.format('YYYY-MM-DD')
        } else {
            return '更换时间错误'
        }
    }

    onItemClick = (item) => {
        // '历史记录', '功能说明'
        if (item == '功能说明') {
            this.refs.doAlert.show();
            this.setState({
                isVisible: false
            });
        } else if (item == '历史记录') {
            // SparePartsChangeRecords
            this.props.dispatch(createAction('CTSparePartsChangeModel/updateState')({
                SpareReplacementRecordKeyVal: ''
            }));
            this.props.dispatch(NavigationActions.navigate({
                routeName: 'SparePartsChangeRecords',
                params: {

                }
            }));
            this.setState({
                isVisible: false
            });
        } else {
            this.setState({
                isVisible: false
            });
        }
    }

    getPageStatus = () => {
        console.log('projectEntPointSysModelResult = ', this.props.projectEntPointSysModelResult);
        const projectEntPointSysModelStatus = SentencedToEmpty(this.props
            , ['projectEntPointSysModelResult', 'status'], 1000
        );
        const cemsSystemModelInventoryStatus = SentencedToEmpty(this.props
            , ['cemsSystemModelInventoryResult', 'status'], 1000
        );
        const cisPartsListStatus = SentencedToEmpty(this.props
            , ['cisPartsListResult', 'status'], 1000
        );
        console.log('projectEntPointSysModelStatus = ', projectEntPointSysModelStatus);
        console.log('cemsSystemModelInventoryStatus = ', cemsSystemModelInventoryStatus);
        console.log('cisPartsListStatus = ', cisPartsListStatus);
        if (projectEntPointSysModelStatus == 200
            && cemsSystemModelInventoryStatus == 200
            // && cisPartsListStatus == 200
        ) {
            return 200;
        } if (projectEntPointSysModelStatus == -1
            || cemsSystemModelInventoryStatus == -1
            // || cisPartsListStatus == -1
        ) {
            return -1;
        } else {
            return 1000;
        }

    }

    upDateComiteData = (params = [], otherParams = {}) => {
        let newData = { ...this.state.comiteParams };
        let innerData = SentencedToEmpty(newData
            , ['cList', 0], {}
        );
        params.map((item, index) => {
            innerData[item.key] = item.value;
        });

        newData.cList[0] = innerData;
        this.setState({
            comiteParams: newData,
            ...otherParams
        });
    }

    getCISApplyTime = () => {
        const comiteParamsData = SentencedToEmpty(this.state
            , ['comiteParams', 'cList', 0], {});
        const ApplicationDate = SentencedToEmpty(comiteParamsData, ['ApplicationDate'], '')
        if (ApplicationDate == '') {
            return 'CIS申请时间为空'
        }
        const momentTime = moment(ApplicationDate);
        if (momentTime.isValid()) {
            return momentTime.format('YYYY-MM-DD')
        } else {
            return 'CIS申请时间错误'
        }
    }

    isEdit = () => {
        return true;
    }

    checkParams = () => {
        // { checkStatus: true, params }
        // const comiteParams = this.state.comiteParams;
        const comiteParamsData = SentencedToEmpty(this.state
            , ['comiteParams', 'cList', 0], {});
        if (this.props.equipmentInstalled != 1
            && this.props.equipmentInstalled != 2
        ) {
            ShowToast('填写信息不完整，不允许提交！');
            return { checkStatus: false, params: {} };
        }
        if (SentencedToEmpty(comiteParamsData, ['projectId'], '') == ''
        ) {
            ShowToast('您没有选择正确的项目信息');
            return { checkStatus: false, params: {} };
        }

        if (SentencedToEmpty(comiteParamsData, ['projectCode'], '') == ''
        ) {
            ShowToast('项目编号错误');
            return { checkStatus: false, params: {} };
        }
        if (SentencedToEmpty(comiteParamsData, ['projectName'], '') == ''
        ) {
            ShowToast('项目名称错误');
            return { checkStatus: false, params: {} };
        }
        if (SentencedToEmpty(comiteParamsData, ['entId'], '') == ''
        ) {
            ShowToast('您选择的企业信息错误');
            return { checkStatus: false, params: {} };
        }
        if (
            this.props.equipmentInstalled == 1
            && SentencedToEmpty(comiteParamsData, ['pointId'], '') == ''
        ) {
            ShowToast('您选择的点位信息错误');
            return { checkStatus: false, params: {} };
        }
        if (SentencedToEmpty(comiteParamsData, ['systemModeId'], '') == ''
        ) {
            ShowToast('您选择的系统型号信息错误');
            return { checkStatus: false, params: {} };
        }
        if (SentencedToEmpty(comiteParamsData, ['cisPartId'], '') == ''
        ) {
            ShowToast('您选择的部件申请信息错误');
            return { checkStatus: false, params: {} };
        }
        if (SentencedToEmpty(comiteParamsData, ['replacementNum'], '') == ''
        ) {
            ShowToast('更换数量不能为空');
            return { checkStatus: false, params: {} };
        }
        if (SentencedToEmpty(comiteParamsData, ['failureCause'], '') == ''
        ) {
            ShowToast('故障原因不能为空');
            return { checkStatus: false, params: {} };
        }
        if (SentencedToEmpty(comiteParamsData, ['replacementUser'], '') == ''
        ) {
            ShowToast('更换人不能为空');
            return { checkStatus: false, params: {} };
        }
        if (SentencedToEmpty(comiteParamsData, ['replacementTime'], '') == ''
        ) {
            ShowToast('更换时间不能为空');
            return { checkStatus: false, params: {} };
        }
        return { checkStatus: true, params: this.state.comiteParams };
    }

    render() {
        const options = {
            headTitle: '说明',
            innersHeight: 180,
            messText: `1、点位情况为有监测点时，则用服务档案中关联点位的信息。
2、点位情况为设备未安装时，则用服务档案关联企业的信息。`,
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '知道了',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: this.confirm
                }
            ]
        };
        const comiteParamsData = SentencedToEmpty(this.state
            , ['comiteParams', 'cList', 0], {});
        return (<StatusPage
            status={this.getPageStatus()}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                // this.onRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                // this.onRefresh();
            }}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <ScrollView
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                    }]}
                >
                    <ItemOutLayout >
                        <Form2Switch
                            required={true}
                            label='点位情况'
                            data={[{ name: '有监测点', value: 1 }, { name: '设备未安装', value: 2 }]}
                            value={this.props.equipmentInstalled}
                            onChange={(value) => {
                                this.props.dispatch(createAction('CTSparePartsChangeModel/updateState')({
                                    equipmentInstalled: value
                                }));
                                // 如果选中2，则清掉点位选项
                                if (value == 1) {
                                    this.upDateComiteData([
                                        { key: 'systemModeId', value: '' }
                                        , { key: 'systemModel', value: '' }
                                    ]);
                                } else if (value == 2) {
                                    this.upDateComiteData([
                                        { key: 'systemModeId', value: '' }
                                        , { key: 'systemModel', value: '' }
                                        , { key: 'pointId', value: '' }
                                        , { key: 'pointName', value: '' }
                                    ]);
                                }
                            }}
                        />
                    </ItemOutLayout>
                    <ItemOutLayout >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 40
                                , flexDirection: 'row', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                            <Text style={[{ fontSize: 14, color: '#333333' }]}>{`项目编号`}</Text>
                            <TouchableOpacity
                                style={[{
                                    flex: 1, height: 44
                                    , flexDirection: 'row'
                                }]}
                                onPress={
                                    () => {
                                        this.props.dispatch(NavigationActions.navigate({
                                            routeName: 'GeneralLocalSearchList',
                                            params: {
                                                title: '项目列表',
                                                data: SentencedToEmpty(this.props
                                                    , ['projectEntPointSysModelResult'
                                                        , 'data', 'Datas'], []
                                                ),
                                                searchPlaceHolder: '企业名称、合同编号、立项号',
                                                renderItem: (item, index, that) => {
                                                    return (<TouchableOpacity
                                                        onPress={() => {
                                                            console.log('item = ', item);
                                                            let paramsList = [
                                                                {
                                                                    key: 'projectCode',
                                                                    value: item.ProjectCode
                                                                }
                                                                , {
                                                                    key: 'projectName',
                                                                    value: item.ProjectName
                                                                }
                                                                , {
                                                                    key: 'projectId',
                                                                    value: item.ProjectId
                                                                }

                                                                , { key: 'entId', value: '' }
                                                                , { key: 'entName', value: '' }
                                                                , { key: 'pointId', value: '' }
                                                                , { key: 'pointName', value: '' }
                                                                , { key: 'systemModeId', value: '' }
                                                                , { key: 'systemModel', value: '' }
                                                            ];
                                                            this.upDateComiteData(paramsList, { entList: item.EntList, pointList: [], systemModleList: [] });
                                                            that.props.dispatch(NavigationActions.back());
                                                        }}
                                                    >
                                                        <View
                                                            style={[{
                                                                width: SCREEN_WIDTH, height: 64
                                                                , backgroundColor: '#FFFFFF'
                                                                , paddingHorizontal: 20
                                                                , justifyContent: 'space-around'
                                                            }]}
                                                        >
                                                            {/* ItemCode 立项号  ProjectCode 项目号  ProjectName 项目名称 */}
                                                            <Text
                                                                style={[{
                                                                    fontSize: 14, color: '#333333'
                                                                }]}
                                                            >{`项目号：${SentencedToEmpty(item, ['ProjectCode'], '')}`}</Text>
                                                            <Text
                                                                numberOfLines={2}
                                                                style={[{
                                                                    fontSize: 11, color: '#999999'
                                                                }]}
                                                            >{`项目名称：${SentencedToEmpty(item, ['ProjectName'], '')}`}</Text>
                                                            <Text
                                                                style={[{
                                                                    fontSize: 11, color: '#999999'
                                                                }]}
                                                            >{`立项号：${SentencedToEmpty(item, ['ItemCode'], '')}`}</Text>
                                                        </View>
                                                    </TouchableOpacity>);
                                                },
                                                callback: (item) => {
                                                    // this.setState({

                                                    // });
                                                }
                                            }
                                        }));
                                    }
                                }
                            >
                                <View style={[{
                                    flex: 1, height: 44
                                    , flexDirection: 'row'
                                    , justifyContent: 'flex-end', alignItems: 'center'
                                }]}>
                                    <Text>{`${SentencedToEmpty(comiteParamsData, ['projectCode'], '')}`}</Text>
                                    <Image
                                        resizeMode={'contain'}
                                        style={[{ height: 16, tintColor: globalcolor.blue }]}
                                        source={require('../../../../images/right.png')} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 40
                                , height: 1, backgroundColor: '#EAEAEA'
                            }]}
                        />
                    </ItemOutLayout>
                    <ItemOutLayout>
                        <FormInput
                            required={true}
                            // last={true}
                            label="项目名称"
                            placeholder="请填写项目名称"
                            // keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={SentencedToEmpty(comiteParamsData, ['projectName'], '')}
                            onChangeText={text => {
                                this.upDateComiteData([{
                                    key: 'projectName', value: text
                                }])
                            }}
                        />
                    </ItemOutLayout>
                    <CurrentPicker
                        label={'企业名称'}
                        codeKey={'EntId'}
                        nameKey={'EntName'}
                        dataArr={SentencedToEmpty(this.state
                            , ['entList'], [])}
                        onSelectListener={item => {
                            this.upDateComiteData([{
                                key: 'entId', value: item.EntId
                            }
                                , {
                                key: 'entName', value: item.EntName
                            }
                                , { key: 'pointId', value: '' }
                                , { key: 'pointName', value: '' }
                                , { key: 'systemModeId', value: '' }
                                , { key: 'systemModel', value: '' }
                            ], {
                                'pointList': SentencedToEmpty(item, ['PointList'], [])
                                , systemModleList: []
                            })
                        }}
                        showText={SentencedToEmpty(comiteParamsData, ['entName'], '')}
                    />
                    {this.props.equipmentInstalled == 1 ?
                        <CurrentPicker
                            label={'点位名称'}
                            codeKey={'PointId'}
                            nameKey={'PointName'}
                            dataArr={SentencedToEmpty(this.state
                                , ['pointList'], [])}
                            onSelectListener={item => {
                                this.upDateComiteData([{
                                    key: 'pointId', value: item.PointId
                                }
                                    , {
                                    key: 'pointName', value: item.PointName
                                }], {
                                    'systemModleList': SentencedToEmpty(item, ['systemModleList'], [])
                                })
                            }}
                            showText={SentencedToEmpty(comiteParamsData, ['pointName'], '')}
                        /> : null}
                    {
                        this.props.equipmentInstalled == 1 ?
                            <CurrentPicker
                                key={new Date().getTime()}
                                label={'系统型号'}
                                codeKey={'SystemModelID'}
                                nameKey={'SystemModel'}
                                defaultCode={SentencedToEmpty(comiteParamsData, ['systemModeId'], '')}
                                dataArr={SentencedToEmpty(this.state, ['systemModleList'], [])}
                                onSelectListener={item => {
                                    this.upDateComiteData([{
                                        key: 'systemModeId', value: item.SystemModelID
                                    }
                                        , {
                                        key: 'systemModel', value: item.SystemModel
                                    }])
                                }}
                                showText={SentencedToEmpty(comiteParamsData, ['systemModel'], '')}
                            />
                            : this.props.equipmentInstalled == 2 ?
                                <CurrentPicker
                                    key={new Date().getTime()}
                                    label={'系统型号'}
                                    codeKey={'ID'}
                                    nameKey={'SystemModel'}
                                    defaultCode={SentencedToEmpty(comiteParamsData, ['systemModeId'], '')}
                                    dataArr={SentencedToEmpty(this.props
                                        , ['cemsSystemModelInventoryResult', 'data'
                                            , 'Datas', 'rtnlist'], [])}
                                    onSelectListener={item => {
                                        this.upDateComiteData([{
                                            key: 'systemModeId', value: item.ID
                                        }
                                            , {
                                            key: 'systemModel', value: item.SystemModel
                                        }])
                                    }}
                                    showText={SentencedToEmpty(comiteParamsData, ['systemModel'], '')}
                                /> : null

                    }
                    {/* <ItemOutLayout >
                        <FormPicker
                            required={true}
                            // last={true}
                            label="系统型号"
                            defaultCode={''}
                            option={{
                                codeKey: 'SystemModelID',
                                nameKey: 'SystemModel',
                                defaultCode: '',
                                dataArr: SentencedToEmpty(this.state, ['systemModleList'], []),
                                onSelectListener: item => {
                                    this.upDateComiteData([{
                                        key: 'systemModeId', value: item.SystemModelID
                                    }
                                        , {
                                        key: 'systemModel', value: item.SystemModel
                                    }])
                                }
                            }}
                            showText={SentencedToEmpty(comiteParamsData, ['systemModel'], '')}
                            placeHolder="请选择"
                        />
                    </ItemOutLayout> */}

                    {/* 0 */}
                    <ItemOutLayout >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 40
                                , flexDirection: 'row', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                            <Text style={[{ fontSize: 14, color: '#333333' }]}>{`申请人`}</Text>
                            <TouchableOpacity
                                style={[{
                                    flex: 1, height: 44
                                    , flexDirection: 'row'
                                }]}
                                onPress={
                                    () => {
                                        this.props.dispatch(createAction('GeneralSearchModel/updateState')({
                                            dataList: [],
                                        }));
                                        this.props.dispatch(NavigationActions.navigate({
                                            routeName: 'GeneralRemoteSearchList',
                                            params: {
                                                title: 'CIS成套部件申请单',
                                                searchPlaceHolder: '项目编号、项目名称、物料编码、部件名称、申请人',
                                                doRemoteSearch: () => {
                                                    this.props.dispatch(createAction('CTSparePartsChangeModel/getCisPartsList')({}));
                                                },
                                                renderItem: (item, index, that) => {
                                                    return (<TouchableOpacity
                                                        onPress={() => {
                                                            console.log('item = ', item);
                                                            this.upDateComiteData([
                                                                {
                                                                    // 申请人   申请人
                                                                    key: 'ApplicationUser', value: item.ApplicationUser
                                                                }
                                                                , {
                                                                    // 申请时间     申请时间
                                                                    key: 'ApplicationDate', value: item.ApplicationDate
                                                                }
                                                                , {
                                                                    // 物料编码     物料编码
                                                                    key: 'U8Code', value: item.U8Code
                                                                }
                                                                , {
                                                                    // 部件名称     部件名称
                                                                    key: 'PartsName', value: item.PartsName
                                                                }
                                                                , {
                                                                    // 规格型号     规格型号
                                                                    key: 'ModelType', value: item.ModelType
                                                                }
                                                                , {
                                                                    // 规格型号     规格型号
                                                                    key: 'CISreplacementNum', value: item.Count
                                                                }
                                                                , {
                                                                    // cis申请单ID     cis申请单ID
                                                                    key: 'cisPartId', value: item.CisPartId
                                                                }
                                                            ])
                                                            that.props.dispatch(NavigationActions.back());
                                                        }}
                                                    >
                                                        <View
                                                            style={[{
                                                                width: SCREEN_WIDTH, height: 113
                                                                // , backgroundColor: index % 2 == 0 ? '#F7F7F7' : '#FFFFFF'
                                                                , backgroundColor: '#FFFFFF'
                                                                , paddingHorizontal: 20
                                                                , justifyContent: 'space-around'
                                                            }]}
                                                        >
                                                            {/* ItemCode 立项号  ProjectCode 项目号  ProjectName 项目名称 */}
                                                            <View
                                                                style={[{
                                                                    width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center'
                                                                }]}
                                                            >
                                                                <TextStyle1>{`项目编号：${SentencedToEmpty(item, ['ProjectCode'], '')}`}</TextStyle1>
                                                                <View style={[{ width: 4 }]} />
                                                                <TextStyle1>{`物料编码：${SentencedToEmpty(item, ['U8Code'], '')}`}</TextStyle1>
                                                            </View>
                                                            <View
                                                                style={[{
                                                                    width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center'
                                                                }]}
                                                            >
                                                                <TextStyle1>{`项目名称：${SentencedToEmpty(item, ['ProjectName'], '')}`}</TextStyle1>
                                                            </View>
                                                            <View
                                                                style={[{
                                                                    width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center'
                                                                }]}
                                                            >
                                                                <TextStyle1>{`部件名称：${SentencedToEmpty(item, ['PartsName'], '')}`}</TextStyle1>
                                                                <View style={[{ width: 4 }]} />
                                                                <TextStyle1>{`更换数量：${SentencedToEmpty(item, ['Count'], '')}`}</TextStyle1>
                                                            </View>
                                                            <View style={[{ width: SCREEN_WIDTH - 40, height: 1, backgroundColor: '#E6E6E6' }]} />
                                                            <View
                                                                style={[{
                                                                    width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center'
                                                                }]}
                                                            >
                                                                <TextStyle2>{`申请人：${SentencedToEmpty(item, ['ApplicationUser'], '')}`}</TextStyle2>
                                                                <View style={[{ width: 4 }]} />
                                                                <TextStyle2>{`申请时间：${SentencedToEmpty(item, ['ApplicationDate'], '')}`}</TextStyle2>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>);
                                                },
                                                callback: (item) => {
                                                    // this.setState({

                                                    // });
                                                }
                                            }
                                        }));
                                    }
                                }
                            >
                                <View style={[{
                                    flex: 1, height: 44
                                    , flexDirection: 'row'
                                    , justifyContent: 'flex-end', alignItems: 'center'
                                }]}>
                                    <Text
                                        numberOfLines={1}
                                        style={[{
                                            width: SCREEN_WIDTH - 164, textAlign: 'right'
                                            , marginRight: 4
                                        }]}
                                    >{`${SentencedToEmpty(comiteParamsData, ['ApplicationUser'], '')}`}</Text>

                                    <View
                                        style={[{
                                            width: 64, height: 32,
                                            justifyContent: 'center', alignItems: 'center'
                                            , backgroundColor: '#4AA0FF'
                                            , borderRadius: 4
                                        }]}
                                    >
                                        <Text
                                            style={[{ fontSize: 12, color: 'white' }]}
                                        >{'查询'}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 40
                                , height: 1, backgroundColor: '#EAEAEA'
                            }]}
                        />
                    </ItemOutLayout>
                    {/* 0 */}

                    <ItemOutLayout>
                        <FormDatePicker
                            required={true}
                            editable={false}
                            showRightIcon={false}
                            getPickerOption={this.getDDateOption}
                            label={'CIS申请时间'}
                            timeString={this.getCISApplyTime()}
                        />
                    </ItemOutLayout>
                    <ItemOutLayout>
                        <FormInput
                            required={true}
                            editable={false}
                            // last={true}
                            label="物料编码"
                            placeholder="未填写物料编码"
                            // keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={SentencedToEmpty(comiteParamsData, ['U8Code'], '')}
                            onChangeText={text => {
                            }}
                        />
                    </ItemOutLayout>
                    <ItemOutLayout>
                        <FormInput
                            required={true}
                            editable={false}
                            // last={true}
                            label="部件名称"
                            placeholder="未填写部件名称"
                            // keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={SentencedToEmpty(comiteParamsData, ['PartsName'], '')}
                            onChangeText={text => {
                            }}
                        />
                    </ItemOutLayout>
                    <ItemOutLayout>
                        <FormInput
                            required={true}
                            editable={false}
                            // last={true}
                            label="规格型号"
                            placeholder="未填写规格型号"
                            // keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={SentencedToEmpty(comiteParamsData, ['ModelType'], '')}
                            onChangeText={text => {
                            }}
                        />
                    </ItemOutLayout>
                    <ItemOutLayout>
                        <FormInput
                            required={true}
                            editable={false}
                            // last={true}
                            label="CIS更换数量"
                            placeholder="未填写CIS更换数量"
                            // keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={SentencedToEmpty(comiteParamsData, ['CISreplacementNum'], '')}
                            onChangeText={text => {
                            }}
                        />
                    </ItemOutLayout>
                    <ItemOutLayout>
                        <FormInput
                            required={true}
                            // last={true}
                            label="更换数量"
                            placeholder="请填写更换数量"
                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={SentencedToEmpty(comiteParamsData, ['replacementNum'], '')}
                            onChangeText={text => {
                                this.upDateComiteData([{
                                    key: 'replacementNum', value: text
                                }
                                ])
                            }}
                        />
                    </ItemOutLayout>
                    <ItemOutLayout >
                        <FormPicker
                            required={true}
                            // last={true}
                            label="故障原因"
                            defaultCode={SentencedToEmpty(comiteParamsData, ['failureCause'], '')}
                            option={{
                                codeKey: 'ChildID',
                                nameKey: 'Name',
                                defaultCode: SentencedToEmpty(comiteParamsData, ['failureCause'], ''),
                                dataArr: SentencedToEmpty(this.props, ['failureCause'], []),
                                onSelectListener: item => {
                                    this.upDateComiteData([{
                                        key: 'failureCause', value: item.ChildID
                                    }
                                        , {
                                        key: 'failureCauseName', value: item.Name
                                    }])
                                }
                            }}
                            showText={SentencedToEmpty(comiteParamsData, ['failureCauseName'], '')}
                            placeHolder="请选择"
                        />
                    </ItemOutLayout>
                    {/* <ItemOutLayout >
                        <FormPicker
                            required={true}
                            label="原因分析"
                            defaultCode={''}
                            option={{
                                codeKey: 'Name',
                                nameKey: 'Name',
                                defaultCode: '',
                                dataArr: [],
                                onSelectListener: item => {
                                    
                                }
                            }}
                            showText={''}
                            placeHolder="请选择"
                        />
                    </ItemOutLayout> */}
                    <ItemOutLayout>
                        <FormInput
                            required={true}
                            // last={true}
                            label="更换人"
                            placeholder="请填写更换人"
                            value={SentencedToEmpty(comiteParamsData, ['replacementUser'], '')}
                            onChangeText={text => {
                                this.upDateComiteData([{
                                    key: 'replacementUser', value: text
                                }])
                            }}
                        />
                    </ItemOutLayout>
                    <ItemOutLayout>
                        <FormDatePicker
                            required={true}
                            getPickerOption={this.getDDateOption}
                            label={'更换时间'}
                            timeString={this.getReplacementTimeStr()}
                        />
                    </ItemOutLayout>
                </ScrollView>
                {
                    (this.isEdit())
                        ? <View
                            style={[{
                                width: SCREEN_WIDTH, height: 75
                                , justifyContent: 'space-around', flexDirection: 'row'
                                , alignItems: 'center'
                            }]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    ShowLoadingToast('正在提交');
                                    const comiteParams = this.state.comiteParams;
                                    console.log('comiteParams = ', comiteParams);
                                    const checkResult = this.checkParams();
                                    if (checkResult.checkStatus) {
                                        this.props.dispatch(createAction('CTSparePartsChangeModel/updateState')({
                                            addSpareReplacementRecordResult: { status: -1 }
                                        }));
                                        this.props.dispatch(createAction('CTSparePartsChangeModel/addSpareReplacementRecord')({
                                            params: checkResult.params,
                                            successCallback: () => {
                                                const user = getToken();
                                                this.setState({
                                                    comiteParams: {
                                                        "recordType": 2, //1.派单备件更换2.工作台备件更换
                                                        "cList": [
                                                            {
                                                                "projectId": "", // 项目iD
                                                                "entId": "", // 企业iD
                                                                "pointId": "", // 监测点ID
                                                                "projectCode": "", // 合同号
                                                                "projectName": "", // 项目名称
                                                                "systemModeId": "", // 系统型号ID
                                                                "cisPartId": "", // cis申请单ID
                                                                "replacementNum": "", // 更换数量
                                                                "failureCause": "", // 故障原因
                                                                "replacementUser": user.UserName, // 更换人
                                                                "replacementTime": monent().format('YYYY-MM-DD'), // 更换日期
                                                            }
                                                        ]
                                                    },
                                                    entList: [], pointList: [],
                                                    systemModleList: []
                                                });
                                            }
                                        }))
                                    }

                                }}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 40), height: 45
                                        , justifyContent: 'center', alignItems: 'center'
                                        , backgroundColor: '#4AA0FF'
                                    }]}
                                >
                                    <Text
                                        style={[{
                                            fontSize: 17, color: '#FFFFFF'
                                        }]}
                                    >{'提交'}</Text>
                                </View>
                            </TouchableOpacity >
                        </View >
                        : null
                }
                <Popover
                    //设置可见性
                    isVisible={this.state.isVisible}
                    //设置下拉位置
                    fromRect={this.state.spinnerRect}
                    placement="bottom"
                    //点击下拉框外范围关闭下拉框
                    onClose={() => this.closeSpinner()}
                    //设置内容样式
                    contentStyle={{ opacity: 0.82, backgroundColor: '#343434' }}
                    style={{ backgroundColor: 'red' }}
                >
                    <View style={{ alignItems: 'center' }}>
                        {['历史记录', '功能说明'].map((result, i, arr) => {
                            return (
                                <TouchableOpacity key={i} onPress={() => this.onItemClick(arr[i])} underlayColor="transparent">
                                    <Text style={{ fontSize: 16, color: 'white', padding: 8, fontWeight: '400' }}>{arr[i]}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Popover>
                <OperationAlertDialog options={options} ref="doAlert" />
            </View>
        </StatusPage >)
    }
}



class TextStyle1 extends Component {
    render() {
        return (
            <Text
                numberOfLines={1}
                style={[{
                    fontSize: 13, color: '#333333'
                    , flex: 1
                }]}
            >{this.props.children}</Text>
        )
    }
}

class TextStyle2 extends Component {
    render() {
        return (
            <Text
                numberOfLines={1}
                style={[{
                    fontSize: 12, color: '#999999'
                    , maxWidth: SCREEN_WIDTH / 2 - 20,
                }]}
            >
                {this.props.children}
            </Text>
        )
    }
}

class CurrentPicker extends Component {

    static defaultProps = {
        label: '标题',
        codeKey: 'id',
        nameKey: 'name',
        dataArr: [],
        defaultCode: '',
        onSelectListener: item => { console.log('item = ', item); },
        showText: '',
        placeHolder: "请选择"
    }

    render() {
        return (< ItemOutLayout >
            <FormPicker
                required={true}
                // last={true}
                label={this.props.label}
                defaultCode={this.props.defaultCode}
                option={{
                    // codeKey: 'PointId',
                    // nameKey: 'PointName',
                    codeKey: this.props.codeKey,
                    nameKey: this.props.nameKey,
                    defaultCode: this.props.defaultCode,
                    // dataArr: SentencedToEmpty(this.state, ['pointList'], []),
                    dataArr: this.props.dataArr,
                    onSelectListener: this.props.onSelectListener
                }}
                showText={this.props.showText}
                placeHolder={this.props.placeHolder}
            />
        </ItemOutLayout>);
    }
}

class ItemOutLayout extends Component {
    render() {
        return (
            <View style={[{
                width: SCREEN_WIDTH, height: 44
                , paddingHorizontal: 20
                , justifyContent: 'center', alignItems: 'center'
                , backgroundColor: '#fff'
            }]}
            >{this.props.children}</View>)
    }
}

/**
 * 完整参数模板
 * {
                "id": "string",
                "pointId": "string",
                "mainId": "string",
                "serviceId": "string",
                "recordId": "string",
                "recordType": "string", //1.派单备件更换2.工作台备件更换
                "cList": [
                    {
                        "id": "string", // 主表ID
                        "mainId": "string", // 派单iD
                        "projectId": "string", // 项目iD
                        "entId": "string", // 企业iD
                        "pointId": "string", // 监测点ID
                        "projectCode": "string", // 合同号
                        "projectName": "string", // 项目名称
                        "systemModeId": "string", // 系统型号ID
                        "cisPartId": "string", // cis申请单ID
                        "replacementNum": "string", // 更换数量
                        "failureCause": "string", // 故障原因
                        "replacementUser": "string", // 更换人
                        "replacementTime": "2024-05-09T10:41:26.590Z", // 更换日期
                        "updateUser": "string",
                        "createUser": "string",
                        "createTime": "2024-05-09T10:41:26.590Z",
                        "updateTime": "2024-05-09T10:41:26.590Z",
                        "serviceId": "string", // 服务属性ID
                        "recordId": "string", // 表单ID
                        "col1": "string",
                        "col2": "string"
                    }
                ]
            }
 */