import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, Platform, StyleSheet, TextInput, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { NavigationActions, createAction, StackActions, SentencedToEmpty, createNavigationOptions, ShowToast } from '../../../utils';
import { StatusPage, AlertDialog, SimpleLoadingComponent } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import FormDatePicker from '../../../operationContainers/taskViews/taskExecution/components/FormDatePicker';
import FormPicker from '../../../operationContainers/taskViews/taskExecution/components/FormPicker';
import FormInput from '../../../operationContainers/taskViews/taskExecution/components/FormInput';
import FormTextArea from '../../../operationContainers/taskViews/taskExecution/components/FormTextArea';
import FormImagePicker from '../../../operationContainers/taskViews/taskExecution/components/FormImagePicker';
import FormFilePicker from '../../../operationContainers/taskViews/taskExecution/components/FormFilePicker';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { getDefinedId } from '../../../utils';
import ImageGrid from '../../../components/form/images/ImageGrid';

/**
 *  model 位置  app/pOperationModels/taskModel.js dataConsistencyModel
 */
@connect(({ CTPeiHeJianCha, CTModel, CTRepair }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    editstatus: CTPeiHeJianCha.editstatus, // 提交状态
    cooperationInsParametersResult: CTPeiHeJianCha.cooperationInsParametersResult,
    cooperationInspectionRecordResult: CTPeiHeJianCha.cooperationInspectionRecordResult,
    dispatchId: CTModel.dispatchId,
    ProjectID: CTModel.ProjectID,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    selectEnt: CTRepair.selectEnt,
    repairEntAndPoint: CTRepair.repairEntAndPoint,
    selectEnt: CTPeiHeJianCha.selectEnt,
    selectPoint: CTPeiHeJianCha.selectPoint
}))
export default class CTPeiHeJianChaSubmitForm extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '第三方检查汇报',// 配合检查记录表
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    /**
     * 
*       CooperationDate 核查日期,
        CooperationCompany 核查单位,
        CooperationMember 核查成员,
        CooperationCompanyRemark 核查单位备注,
        ProblemLevel 问题等级
        ProjectNumber 项目,
        Solution 解决方式
        CooperationTheme 核查主题,
        DiscoverProblems 发现的问题,
        CooperationContent 核查内容,
        RemainingProblems 遗留问题,
        MajorProblemReport 重大问题汇报,
        PictureFiles 图片文件,
        EnclosureFiles 附件文件,
        Rectification 整改措施,
     */

    constructor(props) {
        super(props);
        this.state = {
            noCommitImages: [],
            noCommitFiles: [],
            noCommitFilesName: [],
            files: [], // 上传文件列表
            images: [], // 上传图片列表
            CooperationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            organizer: { Name: '环保部巡视组' }, // 核查单位

            CooperationCompanyRemark: '', // 核查单位备注
            CooperationMember: '', // 核查成员
            CooperationTheme: '', // 核查主题
            CooperationContent: '', // 核查内容
            DiscoverProblems: '', // 发现的问题
            solutionItem: { Name: '' }, // 解决方式
            solutionOption: {
                // 解决方式
                codeKey: 'ChildID',
                nameKey: 'Name',
                defaultCode: '',
                test: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
            problemLevelItem: { Name: '' }, // 问题等级
            problemLevelOption: {
                // 问题等级
                codeKey: 'ChildID',
                nameKey: 'Name',
                defaultCode: '',
                test: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
            RemainingProblems: '', // 遗留问题
            MajorProblemReport: '', // 重大问题汇报
            projectNumberItem: { Name: '' }, // 核查对象对应项目
            projectNumberOption: {
                // 核查对象对应项目
                codeKey: 'ChildID',
                nameKey: 'Name',
                defaultCode: '',
                test: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            }
        };
        _me = this;
        this.imageId = getDefinedId(); // localId
        this.fileId = getDefinedId();
    }

    componentDidMount() {
        this.onRefresh();
    }

    onRefresh = () => {
        const record = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'currentItem'], {});

        this.fileId = record.EnclosureFiles ? record.EnclosureFiles : getDefinedId(); // localId
        this.imageId = record.PictureFiles ? record.PictureFiles : getDefinedId();
        const ImgList = SentencedToEmpty(record, ['PictureFilesList', 'ImgList'], []);
        const Images = [];
        if (ImgList && ImgList.length > 0) {
            ImgList.map(item => {
                Images.push({ url: item, AttachID: item.split('/')[item.split('/').length - 1] });
            });
        }
        const FileList = SentencedToEmpty(record, ['EnclosureFilesList', 'ImgList'], []);
        // const FileNameList = SentencedToEmpty(record, ['EnclosureFilesList', 'ImgNameList'], []); 
        const FileNameList = SentencedToEmpty(record, ['EnclosureFilesList', 'NameList'], []);
        const File = [];
        if (FileList && FileList.length > 0) {
            FileList.map((item, index) => {
                File.push({ AttachID: item.split('/')[item.split('/').length - 1], showName: FileNameList[index] });
            });
        }
        this.setState(
            {
                noCommitImages: ImgList,
                noCommitFiles: FileList,
                noCommitFilesName: FileNameList,
                images: Images,
                files: File, // 上传文件列表
                CooperationDate: record.CooperationDate ? moment(record.CooperationDate).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
                organizer: { ChildID: record.CooperationCompany ? record.CooperationCompany : '', Name: record.CooperationCompanyName }, // 核查单位
                CooperationCompanyRemark: record.CooperationCompanyRemark ? record.CooperationCompanyRemark : '', // 核查单位备注
                CooperationMember: record.CooperationMember ? record.CooperationMember : '', // 核查成员
                CooperationTheme: record.CooperationTheme ? record.CooperationTheme : '', // 核查主题
                CooperationContent: record.CooperationContent ? record.CooperationContent : '', // 核查内容
                DiscoverProblems: record.DiscoverProblems ? record.DiscoverProblems : '', // 发现的问题
                solutionItem: { ChildID: record.Solution ? record.Solution : '', Name: record.SolutionName ? record.SolutionName : '' }, // 解决方式
                problemLevelItem: { ChildID: record.ProblemLevel ? record.ProblemLevel : '', Name: record.ProblemLevelName }, // 问题等级
                RemainingProblems: record.RemainingProblems ? record.RemainingProblems : '', // 遗留问题
                MajorProblemReport: record.MajorProblemReport ? record.MajorProblemReport : '', // 重大问题汇报
                projectNumberItem: { ChildID: record.ProjectNumber ? record.ProjectNumber : '', Name: record.ProjectNumberName }, // 核查对象对应项目
                Rectification: record.Rectification ? record.Rectification : '' //整改措施,
            },
            () => {
                let self = this;

                this.props.dispatch(
                    createAction('CTPeiHeJianCha/updateState')({
                        selectEnt: { EntId: record.EntId, EntName: record.EntName },
                        selectPoint: { PointId: record.PointId, PointName: record.PointName }
                    })
                );
                this.props.dispatch(
                    createAction('CTRepair/GetProjectEntPointSysModel')({
                        projectId: this.props.ProjectID
                    })
                );
                /**
                 * CooperationCompanyList(核查单位),
                 * SolutionList(解决方式),
                 * ProblemLevelList(问题等级),
                 * ProjectNumberList(被核查对象对应项目)
                 */
                const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
                const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
                this.props.dispatch(
                    createAction('CTPeiHeJianCha/GetCooperationInsParameters')({
                        mainId: this.props.dispatchId,
                        serviceId: serviceId,
                        recordId: recordId,
                        callback: result => {
                            self.setState({
                                solutionOption: {
                                    codeKey: 'ChildID',
                                    nameKey: 'Name',
                                    defaultCode: SentencedToEmpty(self.state.solutionItem, ['ChildID'], ''),
                                    dataArr: SentencedToEmpty(result, ['data', 'Datas', 'SolutionList'], []),
                                    onSelectListener: item => {
                                        self.setState({ solutionItem: item });
                                    }
                                },
                                problemLevelOption: {
                                    codeKey: 'ChildID',
                                    nameKey: 'Name',
                                    defaultCode: SentencedToEmpty(self.state.problemLevelItem, ['ChildID'], ''),
                                    dataArr: SentencedToEmpty(result, ['data', 'Datas', 'ProblemLevelList'], []),
                                    onSelectListener: item => {
                                        self.setState({ problemLevelItem: item });
                                    }
                                },
                                projectNumberOption: {
                                    codeKey: 'ChildID',
                                    nameKey: 'Name',
                                    defaultCode: SentencedToEmpty(self.state.projectNumberItem, ['ChildID'], ''),
                                    dataArr: SentencedToEmpty(result, ['data', 'Datas', 'ProjectNumberList'], []),
                                    onSelectListener: item => {
                                        self.setState({ projectNumberItem: item });
                                    }
                                }
                            });
                        }
                    })
                );
            }
        );
    };

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
                    CooperationDate: moment(time).format('YYYY-MM-DD HH:mm:ss')
                });
            }
        };
    };

    getInitStatus = () => {
        let repairRecordDetailResult = this.props.repairEntAndPoint;
        let cooperationInsParametersResult = this.props.cooperationInsParametersResult;
        if (repairRecordDetailResult.status == -1 || cooperationInsParametersResult.status == -1) {
            return -1;
        }
        if (repairRecordDetailResult.status != 200) {
            return repairRecordDetailResult.status;
        }
        if (cooperationInsParametersResult.status != 200) {
            return cooperationInsParametersResult.status;
        }
        if (repairRecordDetailResult.status == 200 && cooperationInsParametersResult.status == 200) {
            return 200;
        }
    };

    commitForm = () => {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        let currentItem = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'currentItem'], {});
        let commitData = {
            CooperationDate: this.state.CooperationDate, //核查日期,
            CooperationCompany: SentencedToEmpty(this.state.organizer, ['ChildID'], ''), // 核查单位,
            CooperationCompanyName: SentencedToEmpty(this.state.organizer, ['Name'], ''),
            CooperationMember: this.state.CooperationMember, // 核查成员,
            CooperationCompanyRemark: this.state.CooperationCompanyRemark, // 核查单位备注,
            ProblemLevel: SentencedToEmpty(this.state.problemLevelItem, ['ChildID'], ''), // 问题等级
            ProblemLevelName: SentencedToEmpty(this.state.problemLevelItem, ['Name'], ''),
            ProjectNumber: SentencedToEmpty(this.state.projectNumberItem, ['ChildID'], ''), // 项目,
            ProjectNumberName: SentencedToEmpty(this.state.projectNumberItem, ['Name'], ''),
            Solution: SentencedToEmpty(this.state.solutionItem, ['ChildID'], ''), // 解决方式
            SolutionName: SentencedToEmpty(this.state.solutionItem, ['Name'], ''),
            CooperationTheme: this.state.CooperationTheme, // 核查主题,
            DiscoverProblems: this.state.DiscoverProblems, // 发现的问题,
            CooperationContent: this.state.CooperationContent, // 核查内容,
            RemainingProblems: this.state.RemainingProblems, // 遗留问题,
            MajorProblemReport: this.state.MajorProblemReport, // 重大问题汇报,
            PictureFiles: this.imageId, // 图片文件,
            EnclosureFiles: this.fileId, // 附件文件
            // EnclosureFiles 附件文件,
            Rectification: this.state.Rectification, //整改措施,
            PictureFilesList: { ImgList: this.state.noCommitImages },
            EnclosureFilesList: { ImgList: this.state.noCommitFiles, ImgNameList: this.state.noCommitFilesName }
        };
        commitData.mainId = this.props.dispatchId;
        commitData.recordId = recordId;
        commitData.serviceId = serviceId;
        commitData.EntName = this.props.selectEnt.EntName;
        commitData.EntId = this.props.selectEnt.EntId;
        commitData.PointId = this.props.selectPoint.PointId;
        commitData.PointName = this.props.selectPoint.PointName;
        commitData.index = currentItem.index;
        this.props.navigation.state.params.callback(commitData);
        this.props.navigation.goBack();
    };

    /**
     * 确认删除配合检查表单
     */
    confirm = () => {
        let commitData = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'currentItem'], {});

        this.props.navigation.state.params.callback({ index: commitData.index });
        this.props.navigation.goBack();
    };

    cancelButton = () => { };

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

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
                <KeyboardAwareScrollView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
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
                                editable={this.isEdit()}
                                required={true} getPickerOption={this.getInspectDateOption} label={'核查日期'} timeString={moment(this.state.CooperationDate).format('YYYY-MM-DD')} />
                            <FormPicker
                                editable={this.isEdit()}
                                label="核查单位"
                                defaultCode={SentencedToEmpty(this.state.organizer, ['ChildID'], '')}
                                option={{
                                    codeKey: 'ChildID',
                                    nameKey: 'Name',
                                    defaultCode: SentencedToEmpty(this.state.organizer, ['ChildID'], ''),
                                    dataArr: SentencedToEmpty(this.props.cooperationInsParametersResult, ['data', 'Datas', 'CooperationCompanyList'], []),
                                    onSelectListener: item => {
                                        this.setState({ organizer: item });
                                    }
                                }}
                                showText={SentencedToEmpty(this.state.organizer, ['Name'], '')}
                                placeHolder="请选择"
                            />
                            <FormPicker
                                editable={this.isEdit()}
                                required={true}
                                label="企业名称"
                                defaultCode={SentencedToEmpty(this.props.selectEnt, ['EntId'], '')}
                                option={{
                                    codeKey: 'EntId',
                                    nameKey: 'EntName',
                                    defaultCode: SentencedToEmpty(this.props.selectEnt, ['EntId'], ''),
                                    dataArr: SentencedToEmpty(this.props.repairEntAndPoint, ['data', 'Datas'], []),
                                    onSelectListener: callBackItem => {
                                        this.props.dispatch(createAction('CTPeiHeJianCha/updateState')({ selectEnt: callBackItem }));
                                    }
                                }}
                                showText={SentencedToEmpty(this.props.selectEnt, ['EntName'], '')}
                                placeHolder="请选择"
                            />
                            {this.props.selectEnt.EntId ? (
                                <FormPicker
                                    editable={this.isEdit()}
                                    required={true}
                                    label="监测点名称"
                                    defaultCode={SentencedToEmpty(this.props.selectPoint, ['PointId'], '')}
                                    option={{
                                        codeKey: 'PointId',
                                        nameKey: 'PointName',
                                        defaultCode: SentencedToEmpty(this.props.selectPoint, ['PointId'], ''),
                                        dataArr: SentencedToEmpty(
                                            this.props.repairEntAndPoint,
                                            [
                                                'data',
                                                'Datas',
                                                SentencedToEmpty(this.props.repairEntAndPoint, ['data', 'Datas'], []).findIndex((item, index) => {
                                                    if (item['EntId'] == SentencedToEmpty(this.props.selectEnt, ['EntId'], '')) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }),
                                                'PointList'
                                            ],
                                            []
                                        ),
                                        onSelectListener: callBackItem => {
                                            this.props.dispatch(createAction('CTPeiHeJianCha/updateState')({ selectPoint: callBackItem }));
                                        }
                                    }}
                                    showText={SentencedToEmpty(this.props.selectPoint, ['PointName'], '')}
                                    placeHolder="请选择"
                                />
                            ) : null}
                            <FormInput
                                editable={this.isEdit()}
                                label="核查单位备注"
                                placeholder="请输入"
                                keyboardType="default"
                                value={this.state.CooperationCompanyRemark}
                                onChangeText={text => {
                                    this.setState({ CooperationCompanyRemark: text });
                                }}
                            />
                            <FormInput
                                editable={this.isEdit()}
                                label="核查成员"
                                placeholder="请记录核查成员"
                                keyboardType="default"
                                value={this.state.CooperationMember}
                                onChangeText={text => {
                                    this.setState({ CooperationMember: text });
                                }}
                            />
                            <FormTextArea
                                editable={this.isEdit()}
                                required={true}
                                label="核查主题"
                                placeholder=""
                                value={this.state.CooperationTheme}
                                onChangeText={text => {
                                    this.setState({ CooperationTheme: text });
                                }}
                            />
                            <FormTextArea
                                editable={this.isEdit()}
                                required={true}
                                label="核查内容"
                                placeholder=""
                                value={this.state.CooperationContent}
                                onChangeText={text => {
                                    this.setState({ CooperationContent: text });
                                }}
                            />
                            <FormTextArea
                                editable={this.isEdit()}
                                label="核查发现问题"
                                placeholder=""
                                value={this.state.DiscoverProblems}
                                onChangeText={text => {
                                    this.setState({ DiscoverProblems: text });
                                }}
                            />
                            <FormPicker
                                editable={this.isEdit()}
                                label="解决方式"
                                defaultCode={SentencedToEmpty(this.state.solutionItem, ['ChildID'], '')}
                                option={this.state.solutionOption}
                                showText={SentencedToEmpty(this.state.solutionItem, ['Name'], '')}
                                placeHolder="请选择"
                            />
                            <FormTextArea
                                editable={this.isEdit()}
                                label="整改措施"
                                placeholder=""
                                value={this.state.Rectification}
                                onChangeText={text => {
                                    this.setState({ Rectification: text });
                                }}
                            />
                            <FormPicker
                                editable={this.isEdit()}
                                label="问题等级"
                                defaultCode={SentencedToEmpty(this.state.problemLevelItem, ['ChildID'], '')}
                                option={this.state.problemLevelOption}
                                showText={SentencedToEmpty(this.state.problemLevelItem, ['Name'], '')}
                                placeHolder="请选择"
                            />
                            <FormTextArea
                                editable={this.isEdit()}
                                label="遗留问题"
                                placeholder=""
                                value={this.state.RemainingProblems}
                                onChangeText={text => {
                                    this.setState({ RemainingProblems: text });
                                }}
                            />
                            <FormTextArea
                                editable={this.isEdit()}
                                label="重大问题汇报"
                                placeholder=""
                                value={this.state.MajorProblemReport}
                                onChangeText={text => {
                                    this.setState({ MajorProblemReport: text });
                                }}
                            />
                            <FormPicker
                                editable={this.isEdit()}
                                required={true}
                                label="被核查对象对应项目"
                                defaultCode={SentencedToEmpty(this.state.projectNumberItem, ['ChildID'], '')}
                                option={this.state.projectNumberOption}
                                showText={SentencedToEmpty(this.state.projectNumberItem, ['Name'], '')}
                                placeHolder="请选择"
                            />
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 63,
                                        minHeight: 154,
                                        backgroundColor: 'white'
                                    }
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            height: 44,

                                            justifyContent: 'center'
                                        }
                                    ]}
                                >
                                    <Text style={{ fontSize: 15 }}>{'图片'}</Text>
                                </View>

                                <ImageGrid
                                    buttonPosition={'behind'}
                                    interfaceName={'netCore'}
                                    style={{ width: SCREEN_WIDTH - 63, paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                                    Imgs={this.state.images}
                                    isUpload={this.isEdit()}
                                    isDel={this.isEdit()}
                                    UUID={this.imageId}
                                    uploadCallback={items => {
                                        console.log('items = ', items);
                                        let newImageList = [...this.state.noCommitImages];
                                        items.map((item, index) => {
                                            newImageList.push(item.url);
                                        });
                                        this.setState({ noCommitImages: newImageList });
                                    }}
                                    delCallback={index => {
                                        let newImageList = [...this.state.noCommitImages];

                                        newImageList.splice(index, 1);
                                        this.setState({ noCommitImages: newImageList });
                                    }}
                                />
                            </View>
                            {/* <FormImagePicker localId={this.imageId} Imgs={this.state.images} /> */}
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 38,
                                        marginLeft: 19,
                                        height: 1,
                                        backgroundColor: '#EAEAEA'
                                    }
                                ]}
                            />
                            <FormFilePicker
                                isUpload={this.isEdit()}
                                isDel={this.isEdit()}
                                last={true}
                                interfaceName={'netCore'}
                                callback={item => {
                                    let temp = [].concat(this.state.files);
                                    item.showName = item.name;
                                    temp.push(item);

                                    let newImageList = [...this.state.noCommitFiles];

                                    // newImageList.push(item);
                                    newImageList.push(item.url);

                                    let newImageList2 = [...this.state.noCommitFilesName];

                                    newImageList2.push(item.name);

                                    this.setState({ noCommitFiles: newImageList, noCommitFilesName: newImageList2, files: temp });
                                }}
                                delCallback={index => {
                                    let files = [...this.state.files];
                                    files.splice(index, 1);
                                    let newImageList = [...this.state.noCommitFiles];

                                    newImageList.splice(index, 1);

                                    let newImageList2 = [...this.state.noCommitFilesName];

                                    newImageList2.splice(index, 1);
                                    this.setState({ files: files, noCommitFiles: newImageList, noCommitFilesName: newImageList2 });
                                }}
                                files={this.state.files}
                                label="附件"
                                localId={this.fileId}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>

                {this.isEdit() && SentencedToEmpty(this.props.selectPoint, ['PointId'], '').length > 0 ? (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: globalcolor.orange }, { marginVertical: 10 }]}
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    >
                        <View style={styles.button}>
                            <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../images/icon_submit.png')} />
                            <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>删除记录</Text>
                        </View>
                    </TouchableOpacity>
                ) : null}

                {this.isEdit() ? <TouchableOpacity
                    style={[styles.button, { backgroundColor: globalcolor.blue }, { marginVertical: 20 }]}
                    onPress={() => {
                        /**
                            files:[],// 上传文件列表
                            CooperationDate:moment().format('YYYY-MM-DD HH:mm:ss'),
                            organizer:{Name:"环保部巡视组"},// 核查单位
                            CooperationCompanyRemark:'',// 核查单位备注
                            CooperationMember:'',// 核查成员
                            CooperationTheme:'', // 核查主题
                            CooperationContent:'', // 核查内容
                            DiscoverProblems:'', // 发现的问题
                            solutionItem:{Name:''},// 解决方式
                            problemLevelItem:{Name:''},// 问题等级
                            RemainingProblems:'' ,// 遗留问题
                            MajorProblemReport:'', // 重大问题汇报
                            projectNumberItem:{Name:''},// 核查对象对应项目
                         */
                        if (!this.props.selectPoint.PointId) {
                            ShowToast('请选择企业和监测点！');
                            return;
                        }
                        if (!this.state.organizer) {
                            ShowToast('核查单位不能为空！');
                        } else if (this.state.CooperationTheme == '') {
                            // 核查主题
                            ShowToast('核查主题不能为空！');
                        } else if (this.state.CooperationContent == '') {
                            // 核查内容
                            ShowToast('核查内容不能为空！');
                        } else if (this.state.projectNumberItem.ChildID == '') {
                            // 核查对象对应项目 对象
                            ShowToast('核查对象对应项目不能为空！');
                        } else if (this.state.DiscoverProblems != '') {
                            // 存在发现问题，一定需要解决
                            if (!this.state.solutionItem) {
                                // 解决方式
                                ShowToast('解决方式不能为空！');
                            } else if (!this.state.problemLevelItem) {
                                // 问题等级
                                ShowToast('问题等级不能为空！');
                            } else {
                                // 允许提交
                                this.commitForm();
                            }
                        } else {
                            // 允许提交
                            this.commitForm();
                        }
                    }}
                >
                    <View style={styles.button}>
                        <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../images/icon_submit.png')} />
                        <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>添加</Text>
                    </View>
                </TouchableOpacity> : null}
                <AlertDialog options={options} ref="doAlert" />
                {this.props.editstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.editstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </StatusPage>
        );
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
        flex: 1
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
