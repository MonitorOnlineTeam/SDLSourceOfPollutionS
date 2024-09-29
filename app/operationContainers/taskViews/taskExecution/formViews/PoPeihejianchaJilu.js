/*
 * @Description: 配合检查记录表
 * @LastEditors: hxf
 * @Date: 2021-11-24 15:50:19
 * @LastEditTime: 2024-09-24 18:51:53
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/PoPeihejianchaJilu.js
 */

import React, { Component } from 'react'
import {
    Text, View, TouchableOpacity, Image, Platform, StyleSheet
    , TextInput, DeviceEventEmitter,
    ScrollView
} from 'react-native'
import { connect } from 'react-redux';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { NavigationActions, createAction, StackActions, SentencedToEmpty, createNavigationOptions, ShowToast, utf8Decode } from '../../../../utils';
import { StatusPage, AlertDialog, SimpleLoadingComponent } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import CommonList from '../components/CommonList';
import FormDatePicker from '../components/FormDatePicker';
import FormPicker from '../components/FormPicker';
import FormInput from '../components/FormInput';
import FormTextArea from '../components/FormTextArea';
import FormImagePicker from '../components/FormImagePicker';
import FormFilePicker from '../components/FormFilePicker';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { getDefinedId } from '../../../../utils';

/**
 *  model 位置  app/pOperationModels/taskModel.js dataConsistencyModel
 */
@connect(({ peiHeJianChaModel }) => ({
    editstatus: peiHeJianChaModel.editstatus,// 提交状态
    cooperationInsParametersResult: peiHeJianChaModel.cooperationInsParametersResult,
    cooperationInspectionRecordResult: peiHeJianChaModel.cooperationInspectionRecordResult
}))
export default class PoPeihejianchaJilu extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '配合检查记录表',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    /**
     * 
*       CooperationDate 检查日期,
        CooperationCompany 检查属性,
        CooperationMember 检查成员,
        CooperationCompanyRemark 检查属性其他说明,
        ProblemLevel 问题等级
        ProjectNumber 项目,
        Solution 解决方式
        CooperationTheme 检查主题,
        DiscoverProblems 发现的问题,
        CooperationContent 检查内容,
        RemainingProblems 遗留问题,
        MajorProblemReport 重大问题汇报,
        PictureFiles 图片文件,
        EnclosureFiles 附件文件,
        Rectification 整改措施,
     */

    constructor(props) {
        super(props);
        this.state = {
            files: [],// 上传文件列表
            images: [],// 上传图片列表
            CooperationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            organizer: { Name: "环保部巡视组" },// 检查属性
            organizerOption: { // 检查属性
                codeKey: 'code',
                nameKey: 'name',
                defaultCode: '',
                test: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
            CooperationCompanyRemark: '',// 检查属性其他说明
            InspectionUnit: '',// 检查单位
            CooperationMember: '',// 检查成员
            CooperationTheme: '', // 检查主题
            CooperationContent: '', // 检查内容
            DiscoverProblems: '', // 发现的问题
            solutionItem: { Name: '' },// 解决方式
            whetherToReportItem: { Name: '' },
            solutionOption: { // 解决方式
                codeKey: 'code',
                nameKey: 'name',
                defaultCode: '',
                test: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
            whetherToReportOption: { // 是否上报主管领导
                codeKey: 'Name',
                nameKey: 'Name',
                defaultCode: '',
                test: '',
                dataArr: [
                    { 'code': '是', Name: '是' },
                    { 'code': '否', Name: '否' },
                ],
                onSelectListener: item => {
                    // console.log(item);
                    this.setState({ whetherToReportItem: item });
                }
            },
            problemLevelItem: { Name: '' },// 问题等级
            problemLevelOption: { // 问题等级
                codeKey: 'code',
                nameKey: 'name',
                defaultCode: '',
                test: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
            RemainingProblems: '',// 遗留问题
            MajorProblemReport: '', // 重大问题汇报
            projectNumberItem: { Name: '' },// 行业类型
            projectNumberOption: { // 行业类型
                codeKey: 'code',
                nameKey: 'name',
                defaultCode: '',
                test: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
        };
        _me = this;
        this.imageId = getDefinedId();// localId
        this.fileId = getDefinedId();
    }

    componentDidMount() {
        this.onRefresh()
    }

    onRefresh = () => {
        const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        this.props.dispatch(createAction('peiHeJianChaModel/getCooperationInspectionRecordList')({
            TypeID: `${ID}`,
            callback: (result) => {
                const record = SentencedToEmpty(result, ['data', 'Datas', 'Record', 'RecordList', 0], {})
                this.fileId = record.EnclosureFiles ? record.EnclosureFiles : getDefinedId();// localId
                this.imageId = record.PictureFiles ? record.PictureFiles : getDefinedId();
                // const ImgList = SentencedToEmpty(record, ['PictureFilesList', 'ImgList'], []);
                const ImgList = SentencedToEmpty(record, ['PictureFilesList', 'ImgNameList'], []);
                const Images = [];
                if (ImgList && ImgList.length > 0) {
                    ImgList.map(item => {
                        Images.push({ AttachID: item });
                    });
                }
                const FileList = SentencedToEmpty(record, ['EnclosureFilesList', 'ImgList'], []);
                // const FileNameList = SentencedToEmpty(record, ['EnclosureFilesList', 'ImgNameList'], []);
                const FileNameList = SentencedToEmpty(record, ['EnclosureFilesList', 'NameList'], []);
                const File = [];
                if (FileList && FileList.length > 0) {
                    FileList.map((item, index) => {
                        File.push({ AttachID: item, showName: FileNameList[index] });
                    });
                }
                this.setState({
                    InspectionUnit: record.InspectionUnit, // 检查单位
                    whetherToReportItem: { code: record.IsReportLeader, Name: record.IsReportLeader },
                    images: Images,
                    files: File,// 上传文件列表
                    CooperationDate: record.CooperationDate ? moment(record.CooperationDate).format('YYYY-MM-DD HH:mm:ss')
                        : moment().format('YYYY-MM-DD HH:mm:ss'),
                    organizer: { Name: record.CooperationCompany ? record.CooperationCompany : '' },// 检查属性
                    CooperationCompanyRemark: record.CooperationCompanyRemark ? record.CooperationCompanyRemark : '',// 检查属性其他说明
                    CooperationMember: record.CooperationMember ? record.CooperationMember : '',// 检查成员
                    CooperationTheme: record.CooperationTheme ? record.CooperationTheme : '', // 检查主题
                    CooperationContent: record.CooperationContent ? record.CooperationContent : '', // 检查内容
                    DiscoverProblems: record.DiscoverProblems ? record.DiscoverProblems : '', // 发现的问题
                    solutionItem: { Name: record.Solution ? record.Solution : '' },// 解决方式
                    problemLevelItem: { Name: record.ProblemLevel ? record.ProblemLevel : '' },// 问题等级
                    RemainingProblems: record.RemainingProblems ? record.RemainingProblems : '',// 遗留问题
                    MajorProblemReport: record.MajorProblemReport ? record.MajorProblemReport : '', // 重大问题汇报
                    projectNumberItem: { Name: record.ProjectNumber ? record.ProjectNumber : '' },// 行业类型
                    Rectification: record.Rectification ? record.Rectification : '', //整改措施,
                });
            }
        }));
        /**
         * CooperationCompanyList(检查单位),
         * SolutionList(解决方式),
         * ProblemLevelList(问题等级),
         * ProjectNumberList(被检查对象对应项目 行业类型)
         */
        this.props.dispatch(createAction('peiHeJianChaModel/getCooperationInsParameters')({
            callback: (result) => {
                this.setState({
                    organizerOption: {
                        codeKey: 'Name',
                        nameKey: 'Name',
                        defaultCode: SentencedToEmpty(this.state.organizer, ['Name'], ''),
                        dataArr: SentencedToEmpty(result, ['data', 'Datas', 'CooperationCompanyList'], []),
                        onSelectListener: item => {
                            this.setState({ organizer: item });
                        }
                    },
                    solutionOption: {
                        codeKey: 'Name',
                        nameKey: 'Name',
                        defaultCode: SentencedToEmpty(this.state.solutionItem, ['Name'], ''),
                        dataArr: SentencedToEmpty(result, ['data', 'Datas', 'SolutionList'], []),
                        onSelectListener: item => {
                            this.setState({ solutionItem: item });
                        }
                    },
                    problemLevelOption: {
                        codeKey: 'Name',
                        nameKey: 'Name',
                        defaultCode: SentencedToEmpty(this.state.problemLevelItem, ['Name'], ''),
                        dataArr: SentencedToEmpty(result, ['data', 'Datas', 'ProblemLevelList'], []),
                        onSelectListener: item => {
                            console.log('item = ', item);
                            if (item.Name != "重大问题") {
                                this.setState({
                                    problemLevelItem: item,
                                    whetherToReportItem: { Name: '' },
                                });
                            } else {
                                this.setState({ problemLevelItem: item });
                            }

                        }
                    },
                    projectNumberOption: {
                        codeKey: 'Name',
                        nameKey: 'Name',
                        defaultCode: SentencedToEmpty(this.state.projectNumberItem, ['Name'], ''),
                        dataArr: SentencedToEmpty(result, ['data', 'Datas', 'ProjectNumberList'], []),
                        onSelectListener: item => {
                            this.setState({ projectNumberItem: item });
                        }
                    },
                })
            }
        }));
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    getInspectDateOption = () => {
        return {
            defaultTime: this.state.CooperationDate,
            type: 'day',
            onSureClickListener: time => {
                this.setState({
                    CooperationDate: moment(time).format('YYYY-MM-DD HH:mm:ss'),
                });
            }
        };
    };

    getInitStatus = () => {
        /**
         * cooperationInsParametersResult
         * cooperationInspectionRecordResult
         */
        let cooperationInsParametersResult = this.props.cooperationInsParametersResult;
        let cooperationInspectionRecordResult = this.props.cooperationInspectionRecordResult;
        if (cooperationInsParametersResult.status == -1
            || cooperationInspectionRecordResult.status == -1) {
            return -1;
        }
        if (cooperationInsParametersResult.status != 200) {
            return cooperationInsParametersResult.status;
        }
        if (cooperationInspectionRecordResult.status != 200) {
            return cooperationInsParametersResult.status;
        }
        if (cooperationInsParametersResult.status == 200
            || cooperationInspectionRecordResult.status == 200) {
            return 200;
        }
    }

    commitForm = () => {
        const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        let params = {
            InspectionUnit: this.state.InspectionUnit, // 检查单位
            CooperationDate: this.state.CooperationDate, //检查日期,
            CooperationCompany: SentencedToEmpty(this.state.organizer, ['Name'], ''), // 检查属性,
            CooperationMember: this.state.CooperationMember, // 检查成员,
            CooperationCompanyRemark: this.state.CooperationCompanyRemark, // 检查属性其他说明,
            ProblemLevel: SentencedToEmpty(this.state.problemLevelItem, ['Name'], ''), // 问题等级
            ProjectNumber: SentencedToEmpty(this.state.projectNumberItem, ['Name'], ''), // 行业类型,
            Solution: SentencedToEmpty(this.state.solutionItem, ['Name'], ''), // 解决方式
            CooperationTheme: this.state.CooperationTheme, // 检查主题,
            DiscoverProblems: this.state.DiscoverProblems, // 发现的问题,
            CooperationContent: this.state.CooperationContent, // 检查内容,
            RemainingProblems: this.state.RemainingProblems, // 遗留问题,
            MajorProblemReport: this.state.MajorProblemReport, // 重大问题汇报,
            PictureFiles: this.imageId, // 图片文件,
            EnclosureFiles: this.fileId, // 附件文件
            // EnclosureFiles 附件文件,
            Rectification: this.state.Rectification //整改措施,
        };
        if (SentencedToEmpty(this.state.problemLevelItem, ['Name'], '') == '重大问题') {
            params.IsReportLeader = SentencedToEmpty(this.state.whetherToReportItem, ['Name'], '');
        }
        this.props.dispatch(
            createAction('peiHeJianChaModel/addCooperationInspectionRecord')({
                TypeID: ID,
                record: params,
                callback: () => {
                    ShowToast('配合检查记录提交成功！');
                    this.props.dispatch(NavigationActions.back());
                    this.props.dispatch(createAction('peiHeJianChaModel/getCooperationInspectionRecordList')({ TypeID: ID, }));
                }
            })
        );
    }

    /**
     * 确认删除配合检查表单
     */
    confirm = () => {
        const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        this.props.dispatch(
            createAction('peiHeJianChaModel/deleteCooperationInspectionRecord')({
                TypeID: ID,
                callback: () => { }
            })
        );
    }

    cancelButton = () => { }

    render() {
        let options = {
            headTitle: '提示',
            messText: '确认删除该配合检查记录吗？',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        return (
            <StatusPage
                status={this.getInitStatus()}
                style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: globalcolor.backgroundGrey }}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.onRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onRefresh();
                }}
            >
                {/* <KeyboardAwareScrollView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}> */}
                <ScrollView
                    style={[{ width: SCREEN_WIDTH, flex: 1 }]}
                >
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center', marginVertical: 22, justifyContent: 'center' }]}>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 24,
                                    paddingHorizontal: 24,
                                    borderRadius: 2,
                                    backgroundColor: globalcolor.white
                                }
                            ]}
                        >
                            <FormDatePicker
                                required={true}
                                getPickerOption={this.getInspectDateOption}
                                label={'检查日期'}
                                timeString={moment(this.state.CooperationDate).format('YYYY-MM-DD')}
                            />
                            <FormPicker
                                required={true}
                                label='行业类型'
                                defaultCode={SentencedToEmpty(this.state.projectNumberItem, ['Name'], '')}
                                option={this.state.projectNumberOption}
                                showText={SentencedToEmpty(this.state.projectNumberItem, ['Name'], '')}
                                placeHolder='请选择'
                            />
                            <FormPicker
                                // label='检查单位'
                                required={true}
                                label='检查属性'
                                defaultCode={SentencedToEmpty(this.state.organizer, ['Name'], '')}
                                option={{
                                    codeKey: 'Name',
                                    nameKey: 'Name',
                                    defaultCode: SentencedToEmpty(this.state.organizer, ['Name'], ''),
                                    dataArr: SentencedToEmpty(this.props.cooperationInsParametersResult, ['data', 'Datas', 'CooperationCompanyList'], []),
                                    onSelectListener: item => {
                                        this.setState({ organizer: item });
                                    }
                                }}
                                showText={SentencedToEmpty(this.state.organizer, ['Name'], '')}
                                placeHolder='请选择'
                            />
                            <FormInput
                                // label='检查单位备注'
                                label='检查属性其他说明'
                                placeholder='请输入'
                                keyboardType='default'
                                value={this.state.CooperationCompanyRemark}
                                onChangeText={
                                    (text) => {
                                        this.setState({ CooperationCompanyRemark: text })
                                    }
                                }
                            />
                            <FormInput
                                required={true}
                                label='检查单位'
                                placeholder='请输入'
                                keyboardType='default'
                                value={this.state.InspectionUnit}
                                onChangeText={
                                    (text) => {
                                        this.setState({ InspectionUnit: text })
                                    }
                                }
                            />
                            <FormInput
                                required={true}
                                label='检查成员'
                                placeholder='请记录检查成员'
                                keyboardType='default'
                                value={this.state.CooperationMember}
                                onChangeText={
                                    (text) => {
                                        this.setState({ CooperationMember: text })
                                    }
                                }
                            />
                            <FormTextArea
                                required={true}
                                label='检查主题'
                                placeholder=''
                                value={this.state.CooperationTheme}
                                onChangeText={(text) => {
                                    this.setState({ CooperationTheme: text });
                                }}
                            />
                            <FormTextArea
                                required={true}
                                label='检查内容'
                                placeholder=''
                                value={this.state.CooperationContent}
                                onChangeText={(text) => {
                                    this.setState({ CooperationContent: text });
                                }}
                            />
                            <FormTextArea
                                required={true}
                                label='检查发现问题'
                                placeholder=''
                                value={this.state.DiscoverProblems}
                                onChangeText={(text) => {
                                    this.setState({ DiscoverProblems: text });
                                }}
                            />
                            <FormPicker
                                required={true}
                                label='问题等级'
                                defaultCode={SentencedToEmpty(this.state.problemLevelItem, ['Name'], '')}
                                option={this.state.problemLevelOption}
                                showText={SentencedToEmpty(this.state.problemLevelItem, ['Name'], '')}
                                placeHolder='请选择'
                            />
                            <FormPicker
                                required={true}
                                label='解决方式'
                                defaultCode={SentencedToEmpty(this.state.solutionItem, ['Name'], '')}
                                option={this.state.solutionOption}
                                showText={SentencedToEmpty(this.state.solutionItem, ['Name'], '')}
                                placeHolder='请选择'
                            />
                            <FormTextArea
                                required={true}
                                label='遗留问题'
                                placeholder=''
                                value={this.state.RemainingProblems}
                                onChangeText={(text) => {
                                    this.setState({ RemainingProblems: text });
                                }}
                            />
                            <FormTextArea
                                required={true}
                                label='整改措施'
                                placeholder=''
                                value={this.state.Rectification}
                                onChangeText={(text) => {
                                    this.setState({ Rectification: text });
                                }}
                            />
                            {SentencedToEmpty(this.state.problemLevelItem, ['Name'], '')
                                == '重大问题' ? <FormPicker
                                required={true}
                                label='是否上报主管领导'
                                defaultCode={SentencedToEmpty(this.state.whetherToReportItem, ['Name'], '')}
                                option={this.state.whetherToReportOption}
                                showText={SentencedToEmpty(this.state.whetherToReportItem, ['Name'], '')}
                                placeHolder='请选择'
                            /> : null}
                            {/* <FormPicker
                                label='问题等级'
                                defaultCode={SentencedToEmpty(this.state.problemLevelItem, ['Name'], '')}
                                option={this.state.problemLevelOption}
                                showText={SentencedToEmpty(this.state.problemLevelItem, ['Name'], '')}
                                placeHolder='请选择'
                            /> */}

                            <FormTextArea
                                required={true}
                                label='重大问题汇报'
                                placeholder=''
                                value={this.state.MajorProblemReport}
                                onChangeText={(text) => {
                                    this.setState({ MajorProblemReport: text });
                                }}
                            />
                            {/* <FormPicker
                                required={true}
                                label='被检查对象对应项目'
                                defaultCode={SentencedToEmpty(this.state.projectNumberItem, ['Name'], '')}
                                option={this.state.projectNumberOption}
                                showText={SentencedToEmpty(this.state.projectNumberItem, ['Name'], '')}
                                placeHolder='请选择'
                            /> */}
                            {/* <FormImagePicker
                                localId={this.imageId}
                                Imgs={this.state.images}
                            />
                            <FormFilePicker
                                last={true}
                                callback={(item) => {
                                    let temp = [].concat(this.state.files);
                                    item.showName = item.name;
                                    temp.push(item);
                                    this.setState({ files: temp });
                                }}
                                delCallback={(index) => {
                                    let files = [...this.state.files];
                                    files.splice(index, 1);
                                    this.setState({ files: files });
                                }}
                                files={this.state.files}
                                label='附件' localId={this.fileId} /> */}
                        </View>
                    </View>
                </ScrollView>
                {/* </KeyboardAwareScrollView> */}
                {SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'FormMainID'], '') != '' ? (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: globalcolor.orange }, { marginVertical: 10 }]}
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    >
                        <View style={styles.button}>
                            <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                            <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>删除记录</Text>
                        </View>
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: globalcolor.blue }, { marginVertical: 20 }]}
                    onPress={() => {
                        /**
                            CooperationDate: '', //检查日期,
                            ProjectNumber: '', // 行业类型,
                            CooperationCompany: '', // 检查属性,
                            CooperationCompanyRemark: this.state.CooperationCompanyRemark, // 检查属性其他说明,
                            InspectionUnit: this.state.InspectionUnit, // 检查单位
                            CooperationMember: this.state.CooperationMember, // 检查成员,
                            CooperationTheme: this.state.CooperationTheme, // 检查主题,
                            CooperationContent: this.state.CooperationContent, // 检查内容,
                            DiscoverProblems: this.state.DiscoverProblems, // 发现的问题,
                            ProblemLevel: SentencedToEmpty(this.state.problemLevelItem, ['Name'], ''), // 问题等级
                            Solution: SentencedToEmpty(this.state.solutionItem, ['Name'], ''), // 解决方式
                            RemainingProblems: this.state.RemainingProblems, // 遗留问题,
                            Rectification: this.state.Rectification //整改措施,
                            IsReportLeader:'', // 是否上报领导
                            MajorProblemReport: this.state.MajorProblemReport, // 重大问题汇报,

                            PictureFiles: this.imageId, // 图片文件,
                            EnclosureFiles: this.fileId, // 附件文件
                         */
                        if (this.state.CooperationDate == '') {
                            ShowToast('检查日期不能为空！');
                        } else if (SentencedToEmpty(this.state.projectNumberItem, ['Name'], '') == '') {
                            // 行业内行
                            ShowToast('行业类型不能为空！');
                            // } else if (!this.state.organizer) {
                        } else if (SentencedToEmpty(this.state.organizer, ['Name'], '') == '') {
                            ShowToast('检查属性不能为空！');
                        } else if (SentencedToEmpty(this.state, ['InspectionUnit'], '') == '') {
                            ShowToast('检查单位不能为空！');
                        } else if (this.state.CooperationMember == '') {
                            ShowToast('检查成员不能为空！');
                        } else if (this.state.CooperationTheme == '') {
                            // 检查主题
                            ShowToast('检查主题不能为空！');
                        } else if (this.state.CooperationContent == '') {
                            // 检查内容
                            ShowToast('检查内容不能为空！');
                        } else if (this.state.DiscoverProblems == '') {
                            // 检查发现问题
                            ShowToast('检查发现问题不能为空！');
                        } else if (SentencedToEmpty(this.state.problemLevelItem, ['Name'], '')
                            == '') {
                            // 问题等级
                            ShowToast('问题等级不能为空！');
                            // 存在发现问题，一定需要解决
                        } else if (SentencedToEmpty(this.state.solutionItem, ['Name'], '')
                            == '') {
                            // 解决方式
                            ShowToast('解决方式不能为空！');
                        } else if (this.state.RemainingProblems == '') {
                            // 遗留问题 
                            ShowToast('遗留问题不能为空！');
                        } else if (this.state.Rectification == '') {
                            // 整改措施
                            ShowToast('整改措施不能为空！');
                        } else if (SentencedToEmpty(this.state.problemLevelItem, ['Name'], '')
                            == '重大问题'
                            && SentencedToEmpty(this.state.whetherToReportItem, ['Name'], '')
                            == '') {
                            // 是否上报主管领导
                            ShowToast('是否上报主管领导不能为空！');
                        } else if (this.state.MajorProblemReport == '') {
                            // 重大问题汇报
                            ShowToast('重大问题汇报不能为空！');
                        } else {
                            // 允许提交
                            this.commitForm()
                        }
                    }}
                >
                    <View style={styles.button}>
                        <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                        <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>确定提交</Text>
                    </View>
                </TouchableOpacity>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.editstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.editstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </StatusPage>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flex: 1,
    },
    layoutWithBottomBorder: {
        flexDirection: 'row',
        height: 45,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
        alignItems: 'center'
    },
    labelStyle: {
        fontSize: 15,
        color: globalcolor.textBlack
    },
    touchable: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 15,
        color: globalcolor.datepickerGreyText,
        flex: 1,
        textAlign: 'right'
    },
    timeIcon: {
        tintColor: globalcolor.blue,
        height: 16,
        width: 18,
        marginLeft: 16
    },
    button: {
        flexDirection: 'row',
        height: 46,
        width: 282,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    }
});