import moment from 'moment';
import React, { Component } from 'react'
import { Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, SDLText, StatusPage } from '../../components';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions, ShowToast } from '../../utils';

@connect(({ BWModel })=>({
    pickerSearchStr:BWModel.pickerSearchStr,
    uploadData:BWModel.uploadData,

    openationTaskTypeResult:BWModel.openationTaskTypeResult,// 运维任务类别 
    openationTaskTypeData:BWModel.openationTaskTypeData,// 运维任务类别 数据
    openationTaskTypeSelectedItems:BWModel.openationTaskTypeSelectedItems,// 运维任务类别 选中数据

    getOperationDetailListResult:BWModel.getOperationDetailListResult, // 运维内容
    getOperationDetailListData:BWModel.getOperationDetailListData, // 运维内容 数据
    originalOperationDetailListData:BWModel.originalOperationDetailListData,// 运维内容 原数据
    getOperationDetailSelectedItems:BWModel.getOperationDetailSelectedItems,// 运维内容 选中数据

    getALLWorkersListResult:BWModel.getALLWorkersListResult, // 人员信息
    getALLWorkersListData:BWModel.getALLWorkersListData, // 人员信息 数据
    originalWorkersListData:BWModel.originalWorkersListData,// 人员信息 原数据
    getALLWorkersSelectedItems:BWModel.getALLWorkersSelectedItems,// 人员信息 选中数据
    
    getALLDevicesListResult:BWModel.getALLDevicesListResult, // 设备信息
    getALLDevicesListData:BWModel.getALLDevicesListData, // 设备信息 数据
    originalDevicesListData:BWModel.originalDevicesListData,// 设备信息 原数据
    getALLDevicesSelectedItems:BWModel.getALLDevicesSelectedItems,// 设备信息 选中数据

    


}))
export default class SHPicker extends Component {

    static navigationOptions = ({ navigation }) =>{
        const pickerType = SentencedToEmpty(navigation
            ,['state','params','pickerType'],'');
        let title = '运维类别'
        if (pickerType == 'operationContentType') {
            title = '运维内容';
        } else if (pickerType == 'operationWorkers') {
            title = '运维人员';
        } else if (pickerType == 'operationDevices') {
            title = '运维设备';
        }
        return createNavigationOptions({
            title: title,
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    }
        

    /**
     * type
     * operationType 运维类别
     * operationContentType 运维内容
     * operationWorkers 运维人员
     * operationDevices 运维设备
     */

    // ✅
    componentWillUnmount() {
        const pickerType = SentencedToEmpty(this.props
            ,['navigation','state','params','pickerType'],'');
        let originalDataParams = [];
        let selectedListName = ''
            , dataName = '';
        if (pickerType == 'operationType') {
            originalDataParams = ['openationTaskTypeResult','data','Datas'
                ,'soap:Envelope', 'soap:Body', 'M_OpenationTaskTypeResponse'
                , 'M_OpenationTaskTypeResult', 'Items', 'Item'
            ]
            selectedListName = 'openationTaskTypeSelectedItems';
            dataName = 'openationTaskTypeData';
        } else if (pickerType == 'operationContentType') {
            originalDataParams = ['originalOperationDetailListData'];
            selectedListName = 'getOperationDetailSelectedItems';
            dataName = 'getOperationDetailListData';
        } else if (pickerType == 'operationWorkers') {
            originalDataParams = ['originalWorkersListData'];
            selectedListName = 'getALLWorkersSelectedItems';
            dataName = 'getALLWorkersListData';
        } else if (pickerType == 'operationDevices') {
            originalDataParams = ['originalDevicesListData'];
            selectedListName = 'getALLDevicesSelectedItems';
            dataName = 'getALLDevicesListData';
        }

        let originalData = SentencedToEmpty(this.props
            ,originalDataParams,[]   
        );
        let newData = [].concat(originalData);
        let Items = SentencedToEmpty(this.props
            , [selectedListName],[]
        )
        let selectedIndex = -1;
        newData.map((item,index)=>{
            selectedIndex = Items.findIndex(
                (selectedItem)=>{
                    return item.ID == selectedItem.ID;
                }
            );
            if (selectedIndex != -1) {
                item.selectedStatus = true;
            } else {
                item.selectedStatus = false;
            }
        });
        let updataParams = {
            pickerSearchStr:'',
        };
        updataParams[dataName] = newData;
        this.props.dispatch(createAction('BWModel/updateState')(updataParams));
    }

    // ✅
    _onItemClick = (item,absoluteIndex) => {
        const pickerType = SentencedToEmpty(this.props
            ,['navigation','state','params','pickerType'],'');
        let dataPropertyName = ''
            , listDataName = '';
        if (pickerType == 'operationType') {
            dataPropertyName = 'openationTaskTypeSelectedItems';
            listDataName = 'openationTaskTypeData';
        } else if (pickerType == 'operationContentType') {
            dataPropertyName = 'getOperationDetailSelectedItems';
            listDataName = 'getOperationDetailListData';
        } else if (pickerType == 'operationWorkers') {
            dataPropertyName = 'getALLWorkersSelectedItems';
            listDataName = 'getALLWorkersListData';
        } else if (pickerType == 'operationDevices') {
            dataPropertyName = 'getALLDevicesSelectedItems';
            listDataName = 'getALLDevicesListData';
        }

        let selectedData =  [].concat(SentencedToEmpty(this.props,[dataPropertyName],[]));
        let selectedIndex = selectedData.findIndex((selectedItem,index)=>{
            return selectedItem.ID == item.ID;
        });

        
        let updataParams = {};
        if (pickerType != 'operationContentType') {
            if ( selectedIndex == -1 ) {
                selectedData.push(item);
            } else {
                selectedData.splice(selectedIndex,1);
            }
            /**
             * 运维内容选项可能选择失败
             * 两个运维内容不属于同一个运维计划时选中失败
             * 进行特殊处理
             */
            let newListData =  [].concat(SentencedToEmpty(this.props,[listDataName],[]));
            newListData[absoluteIndex].selectedStatus = !newListData[absoluteIndex].selectedStatus;
            updataParams[listDataName] = newListData;
        } else {
            let newListData =  [].concat(SentencedToEmpty(this.props,[listDataName],[]));
            if ( selectedIndex == -1 ) {
                if (selectedData.length>0) {
                    if (selectedData[0].plan.ID == item.plan.ID) {
                        selectedData.push(item);
                        newListData[absoluteIndex].selectedStatus = !newListData[absoluteIndex].selectedStatus;
                    } else {
                        ShowToast('两条任务内容需要属于同一个任务计划a');
                        return;
                    }
                } else {
                    selectedData.push(item);
                    newListData[absoluteIndex].selectedStatus = !newListData[absoluteIndex].selectedStatus;
                }
            } else {
                selectedData.splice(selectedIndex,1);
                newListData[absoluteIndex].selectedStatus = !newListData[absoluteIndex].selectedStatus;
            }
            updataParams[listDataName] = newListData;
        }
        updataParams[dataPropertyName] = selectedData;
        
        const newUploadData =  {...SentencedToEmpty(this.props,['uploadData'],{})};
        
        let dataStr = '',oneOPTPID;
        // 判断多任务内容是否在同一任务计划中
        // 只针对 任务内容
        let isOnePlan = true;
        if ('xmlParamList' in newUploadData) {
            if (pickerType == 'operationType') {
                // 错误逻辑
                selectedData.map((item,index)=>{
                    if (index == 0) {
                        dataStr = ''+item.ID;
                    } else {
                        dataStr = dataStr+`,${item.ID}`
                    }
                });
                // 运维计划 ID
                newUploadData.xmlParamList[0].OPTPID = dataStr;
            } else if (pickerType == 'operationContentType') {
                let OTIDStr = '', // 弃用
                    hasIndex = -1,OPTPID = '';
                selectedData.map((item,index)=>{
                    hasIndex = OTIDStr.indexOf(item.OTID)
                    oneOPTPID = SentencedToEmpty(item,['plan','ID'],'');
                    if (index == 0) {
                        dataStr = ''+item.ID;
                        OPTPID = OPTPID+oneOPTPID;
                    } else {
                        dataStr = dataStr+`,${item.ID}`
                        if (OPTPID != oneOPTPID) {
                            isOnePlan = false;
                            ShowToast('两条任务内容需要属于同一个任务计划');
                            return;
                        }
                    }
                });
                newUploadData.xmlParamList[0].ODID = dataStr; // 运维内容 ID
                /**
                 * 运维计划 ID
                 * 需要与 M_GetOperationTaskPlanList 匹配过滤后的结果，选出来
                 */
                newUploadData.xmlParamList[0].OPTPID = OPTPID; // 运维计划由运维内容反推而来
            } else if (pickerType == 'operationWorkers') {
                selectedData.map((item,index)=>{
                    if (index == 0) {
                        dataStr = ''+item.ID;
                    } else {
                        dataStr = dataStr+`,${item.ID}`
                    }
                });
                newUploadData.xmlParamList[0].YWRY = dataStr;
            } else if (pickerType == 'operationDevices') {
                selectedData.map((item,index)=>{
                    if (index == 0) {
                        dataStr = ''+item.ID;
                    } else {
                        dataStr = dataStr+`,${item.ID}`
                    }
                });
                newUploadData.xmlParamList[0].YWSB = dataStr;
            }
        } else {
            newUploadData.xmlParamList = [{
                YWMS:'', // 必填 异常说明（异常情况补录必填）
                OPTPID:'', // 运维计划 ID 是不是运维类别?
                OTSID:'', // 运维点位 ID
                YWSJ:'', // 运维记录保存时间
                // YWDATE:moment().format('YYYY-MM-DD HH:mm:ss'), // 运维时间
                YWDATE:'',
                ODID:'', // 运维内容 ID
                OPCID:'', // 运维计划周期 ID
                YWRY:'', // 运维人员（逗号分隔如：128634,128635）
                YWSB:'', // 运维设备（逗号分隔如：128634,128635）
                // YWMS:'', // 异常说明（异常情况补录必填）
                
                PATH1:'', // 图片名称（调用附件上传接口产生图片名）
                PATH1_UPLOADTIME:'', //图片上传时间（真实时间）
                PATH2:'', // 图片名称（调用附件上传接口产生图片名）
                PATH2_UPLOADTIME:'', //图片上传时间（真实时间）
                PATH3:'', // 图片名称（调用附件上传接口产生图片名）
                PATH3_UPLOADTIME:'', //图片上传时间（真实时间）
                PATH4:'', // 图片名称（调用附件上传接口产生图片名）
                PATH4_UPLOADTIME:'', //图片上传时间（真实时间）
                // PATH5:'', // 图片名称（调用附件上传接口产生图片名）
                // PATH5_UPLOADTIME:'', //图片上传时间（真实时间）
                // PATH6:'', // 图片名称（调用附件上传接口产生图片名）
                // PATH6_UPLOADTIME:'', //图片上传时间（真实时间）
                // PATH7:'', // 图片名称（调用附件上传接口产生图片名）
                // PATH7_UPLOADTIME:'', //图片上传时间（真实时间）
                // PATH8:'', // 图片名称（调用附件上传接口产生图片名）
                // PATH8_UPLOADTIME:'', //图片上传时间（真实时间）

                X:item.LONGITUDE, // 经度
                Y:item.LATITUDE, // 维度
                IS_SPECIAL:0, // 是否异常补录（0 正常 1 补录）
            }];
            if (pickerType == 'operationType') {
                selectedData.map((item,index)=>{
                    if (index == 0) {
                        dataStr = ''+item.ID;
                    } else {
                        dataStr = dataStr+`,${item.ID}`
                    }
                });
                newUploadData.xmlParamList[0].OPTPID = dataStr;
            } else if (pickerType == 'operationContentType') {
                let OTIDStr = '',  // 弃用
                    hasIndex = -1,OPTPID = '';
                selectedData.map((item,index)=>{
                    hasIndex = OTIDStr.indexOf(item.OTID)
                    oneOPTPID = SentencedToEmpty(item,['plan','ID'],'');
                    if (index == 0) {
                        dataStr = ''+item.ID;
                        OPTPID = OPTPID+oneOPTPID;
                    } else {
                        dataStr = dataStr+`,${item.ID}`
                        // OPTPID = OPTPID+`,${oneOPTPID}`;
                        if (OPTPID != oneOPTPID) {
                            isOnePlan = false;
                            ShowToast('两条任务内容需要属于同一个任务计划');
                            return;
                        }
                    }
                });
                newUploadData.xmlParamList[0].ODID = dataStr;//ODID OTID 
                newUploadData.xmlParamList[0].OPTPID = OPTPID;
            } else if (pickerType == 'operationWorkers') {
                selectedData.map((item,index)=>{
                    if (index == 0) {
                        dataStr = ''+item.ID;
                    } else {
                        dataStr = dataStr+`,${item.ID}`
                    }
                });
                newUploadData.xmlParamList[0].YWRY = dataStr;
            } else if (pickerType == 'operationDevices') {
                selectedData.map((item,index)=>{
                    if (index == 0) {
                        dataStr = ''+item.ID;
                    } else {
                        dataStr = dataStr+`,${item.ID}`
                    }
                });
                newUploadData.xmlParamList[0].YWSB = dataStr;
            }
        }
        updataParams['uploadData'] = newUploadData;
        if (pickerType == 'operationContentType') {
            if (isOnePlan) {
                updataParams.uploadOpenationTime = '';
                this.props.dispatch(createAction('BWModel/updateState')(updataParams));
                this.props.dispatch(createAction('BWModel/filterCycleData')({}));
            }
        } else {
            this.props.dispatch(createAction('BWModel/updateState')(updataParams));
        }
    }

    /**
     * type
     * operationType 运维类别
     * operationContentType 运维内容
     * operationWorkers 运维人员
     * operationDevices 运维设备
     */
    // ✅
    renderItem = ({item,index}) => {
        const pickerType = SentencedToEmpty(this.props
            ,['navigation','state','params','pickerType'],'');
        let showText = '';
        if (pickerType == 'operationType') {
            showText = SentencedToEmpty(item,['NAME'],'----');
        } else if (pickerType == 'operationContentType') {
            showText = SentencedToEmpty(item,['DETAILNAME'],'----');
        } else if (pickerType == 'operationWorkers') {
            showText = SentencedToEmpty(item,['XM'],'----');
        } else if (pickerType == 'operationDevices') {
            showText = `${SentencedToEmpty(item,['SBMC'],'----')}\\${
                SentencedToEmpty(item,['SBBH'],'----')
            }\\${
                SentencedToEmpty(item,['CCBH'],'无')
            }`;
        }
        if (pickerType == 'operationContentType') {
            const planText = SentencedToEmpty(item,['plan','JHBT'],'未知计划');
            return(<TouchableOpacity onPress={() => this._onItemClick(item,index)}>
                <View style={[{ height: 70, width: SCREEN_WIDTH, backgroundColor: 'white'
                    , flexDirection:'row', alignItems:'center', paddingHorizontal:16
                }]} >
                    <Image
                        style={{ width: 15, height: 15, marginRight:8 }}
                        source={item.selectedStatus ? require('../../images/duoxuanxuanzhong.png') : require('../../images/duoxuankuang.png')}
                    />
                    <View >
                        <Text style={[{ fontSize:13, color:'#333333' }]}>{showText}</Text>
                        <Text style={[{ fontSize:13, color:'#333333', marginTop:8 }]}>{planText}</Text>
                    </View>
                </View>
            </TouchableOpacity>);
        } else {
            return(<TouchableOpacity onPress={() => this._onItemClick(item,index)}>
                <View style={[{ height: 45, width: SCREEN_WIDTH, backgroundColor: 'white'
                    , flexDirection:'row', alignItems:'center', paddingHorizontal:16
                }]} >
                    <Image
                        style={{ width: 15, height: 15, marginRight:8 }}
                        source={item.selectedStatus ? require('../../images/duoxuanxuanzhong.png') : require('../../images/duoxuankuang.png')}
                    />
                    <Text style={[{ fontSize:13, color:'#333333' }]}>{showText}</Text>
                </View>
            </TouchableOpacity>);
        }
        
    }

    // ✅
    showSelectedStr = () => {
        const pickerType = SentencedToEmpty(this.props
            ,['navigation','state','params','pickerType'],'');
        let dataPropertyName = ''
            , listDataName = '';
        if (pickerType == 'operationType') {
            dataPropertyName = 'openationTaskTypeSelectedItems';
            listDataName = 'openationTaskTypeData';
        } else if (pickerType == 'operationContentType') {
            dataPropertyName = 'getOperationDetailSelectedItems';
            listDataName = 'getOperationDetailListData';
        } else if (pickerType == 'operationWorkers') {
            dataPropertyName = 'getALLWorkersSelectedItems';
            listDataName = 'getALLWorkersListData';
        } else if (pickerType == 'operationDevices') {
            dataPropertyName = 'getALLDevicesSelectedItems';
            listDataName = 'getALLDevicesListData';
        }

        const selectedData = SentencedToEmpty(this.props,[dataPropertyName],[])
        console.log(dataPropertyName,' = ',selectedData);
        if (selectedData.length == 0) {
            return `未选中`;
        } else if (selectedData.length == 1) {
            if (pickerType == 'operationType') {
                return `选中：${SentencedToEmpty(selectedData,[0,'NAME'],'---')}`;
            } else if (pickerType == 'operationContentType') {
                return `选中：${SentencedToEmpty(selectedData,[0,'DETAILNAME'],'---')}`;
            } else if (pickerType == 'operationWorkers') {
                return `选中：${SentencedToEmpty(selectedData,[0,'XM'],'---')}`;
            } else if (pickerType == 'operationDevices') {
                return `选中：${SentencedToEmpty(selectedData,[0,'SBMC'],'---')}`;
            } else {
                return `选中：('1')项`;
            }
        } else {
            return `选中：(${selectedData.length})项`;
        }
    }

    /* 渲染底部按钮 */
    renderBottomBtn = () => {
        return (
            <View style={{ width: SCREEN_WIDTH, height: 56, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 13, paddingRight: 13, paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff' }}>
                {/* <TouchableOpacity
                    style={{ backgroundColor: '#339afe', borderRadius: 4, height: '100%', width: SCREEN_WIDTH / 2 - 13 - 13, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        
                    }}
                >
                    <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                        {'取消'}
                    </SDLText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ backgroundColor: '#339afe', borderRadius: 4, height: '100%', width: SCREEN_WIDTH / 2 - 13 - 13, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        
                    }}
                >
                    <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                        {'确定'}
                    </SDLText>
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={{ backgroundColor: '#339afe', borderRadius: 4, height: '100%', width: SCREEN_WIDTH - 13 - 13, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.props.dispatch(NavigationActions.back());
                        this.props.dispatch(createAction('BWModel/updateState')({pickerSearchStr:''}));
                    }}
                >
                    <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                        {'确定'}
                    </SDLText>
                </TouchableOpacity>
            </View>
        );
    };

    // ✅
    search = () => {
        // 只过滤，不刷新
        const pickerType = SentencedToEmpty(this.props
            ,['navigation','state','params','pickerType'],'');
        const pickerSearchStr = this.props.pickerSearchStr;
        let originalData = []
            , newData = [];
        let updataParams = {};
        
        let originalDataParams = [];
        let selectedListName = ''
            , dataName = '';
        if (pickerType == 'operationType') { // 停用
            originalDataParams = ['openationTaskTypeResult','data','Datas'
                ,'soap:Envelope', 'soap:Body', 'M_OpenationTaskTypeResponse'
                , 'M_OpenationTaskTypeResult', 'Items', 'Item'
            ]
            selectedListName = 'openationTaskTypeSelectedItems';
            dataName = 'openationTaskTypeData';
        } else if (pickerType == 'operationContentType') {
            originalDataParams = ['originalOperationDetailListData'];
            selectedListName = 'getOperationDetailSelectedItems';
            dataName = 'getOperationDetailListData';
        } else if (pickerType == 'operationWorkers') {
            originalDataParams = ['originalWorkersListData'];
            selectedListName = 'getALLWorkersSelectedItems';
            dataName = 'getALLWorkersListData';
        } else if (pickerType == 'operationDevices') {
            originalDataParams = ['originalDevicesListData'];
            selectedListName = 'getALLDevicesSelectedItems';
            dataName = 'getALLDevicesListData';
        }

        originalData = SentencedToEmpty(this.props
            ,originalDataParams,[]  
        );
        originalData.map((item,index)=>{
            if (pickerType == 'operationType') {
                if (item.NAME.indexOf(pickerSearchStr)!=-1
                    ||`${item.ID}`.indexOf(pickerSearchStr)!=-1
                ) {
                    newData.push(item);
                }
            } else if (pickerType == 'operationContentType') {
                if (item.DETAILNAME.indexOf(pickerSearchStr)!=-1
                    ||`${item.ID}`.indexOf(pickerSearchStr)!=-1) {
                    newData.push(item);
                }
            } else if (pickerType == 'operationWorkers') {
                if (item.XM.indexOf(pickerSearchStr)!=-1) {
                    newData.push(item);
                }
            } else if (pickerType == 'operationDevices') {
                if (item.SBMC.indexOf(pickerSearchStr)!=-1
                    ||item.SBBH.indexOf(pickerSearchStr)!=-1
                ) {
                    newData.push(item);
                }
            }
            
        });
        let selectedItems = SentencedToEmpty(this.props
            , [selectedListName],[]
        )
        let selectedIndex = -1;
        newData.map((item,index)=>{
            selectedIndex = selectedItems.findIndex(
                (selectedItem)=>{
                    return item.ID == selectedItem.ID;
                }
            );
            if (selectedIndex != -1) {
                item.selectedStatus = true;
            } else {
                item.selectedStatus = false;
            }
        });
        updataParams[dataName] = newData;
        this.props.dispatch(createAction('BWModel/updateState')(updataParams));
    }

    statusPageOnRefresh = (hascallback=false) => {
        console.log('statusPageOnRefresh');
        const pickerType = SentencedToEmpty(this.props
            ,['navigation','state','params','pickerType'],'');
        if (pickerType == 'operationType') {
            this.props.dispatch(createAction('BWModel/openationTaskType')({
                setListData: hascallback?this.list.setListData:()=>{},
            }));
        } else if (pickerType == 'operationContentType') {
            this.props.dispatch(createAction('BWModel/getOperationDetailList')({
                setListData: hascallback?this.list.setListData:()=>{},
            }));
        } else if (pickerType == 'operationWorkers') {
            this.props.dispatch(createAction('BWModel/getALLWorkersList')({
                setListData: hascallback?this.list.setListData:()=>{},
            }));
        } else if (pickerType == 'operationDevices') {
            this.props.dispatch(createAction('BWModel/getALLDevicesList')({
                setListData: hascallback?this.list.setListData:()=>{},
            }));
        }
        
    }

    /**
     * type
     * operationType 运维类别
     * operationContentType 运维内容
     * operationWorkers 运维人员
     * operationDevices 运维设备
     */

    render() {
        const pickerType = SentencedToEmpty(this.props
            ,['navigation','state','params','pickerType'],'');
        let listStatus = {status:200}
        , listData = [];
        if (pickerType == 'operationType') {
            listStatus = this.props.openationTaskTypeResult;
            listData = SentencedToEmpty(this.props,['openationTaskTypeData'],[]);
        } else if (pickerType == 'operationContentType') {
            listStatus = this.props.getOperationDetailListResult;
            listData = SentencedToEmpty(this.props,['getOperationDetailListData'],[]);
        } else if (pickerType == 'operationWorkers') {
            listStatus = this.props.getALLWorkersListResult;
            listData = SentencedToEmpty(this.props,['getALLWorkersListData'],[]);
        } else if (pickerType == 'operationDevices') {
            listStatus = this.props.getALLDevicesListResult;
            listData = SentencedToEmpty(this.props,['getALLDevicesListResult'],[]);
            listData = SentencedToEmpty(this.props,['getALLDevicesListData'],[]);
        }
        return (<View style={[{width:SCREEN_WIDTH, flex:1}]}>
            <View style={{height:48,width:SCREEN_WIDTH
            , justifyContent:'center', alignItems:'center'
            , backgroundColor:'#ffffff', borderBottomWidth:1, borderBottomColor:'#f2f2f2'}}>
                <View style={{height:29,width:SCREEN_WIDTH-27
                , borderRadius:5, backgroundColor:'#F4F4F4'
                , flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <Image source={require('../../images/ic_search_help_center.png')}
                        style={{width:14, height:14, marginLeft:10}}
                    />
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={'请输入搜索关键字'}
                        style={{
                            flex:1,color:'#999999',fontSize:14, marginLeft:5,
                            padding:0
                        }}
                        value={this.props.pickerSearchStr}
                        onChangeText={text => {
                            // this.setState({
                            //     QuestionName:text
                            // });
                            this.props.dispatch(createAction('BWModel/updateState')({ pickerSearchStr:text }))
                        }}
                        clearButtonMode="while-editing"
                        ref="keyWordInput"
                        placeholderTextColor={'#999999'}
                    />
                    {/* <Text style={{flex:1,color:'#999999',fontSize:14, marginLeft:5}}>{'请输入问题或关键字'}</Text> */}
                    <View style={{height:22, width:0.5, backgroundColor:'#E7E7E7'}}></View>
                    <TouchableOpacity
                        onPress={()=>{
                            // this.props.dispatch(createAction('BWModel/updateState')({ openationTaskTypeResult:{status:-1} }))
                            // this.refresh();
                            this.search();
                        }}
                    >
                        <Text style={{color:'#666666',fontSize:14, marginHorizontal: 10}}>{'搜索'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{height:48,width:SCREEN_WIDTH
            , justifyContent:'center', alignItems:'center'
            , backgroundColor:'#ffffff', borderBottomWidth:1, borderBottomColor:'#f2f2f2'
            , marginBottom:8 }}>
                <Text>{`${this.showSelectedStr()}`}</Text>
            </View>
            <StatusPage
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('重新刷新');
                    this.statusPageOnRefresh();
                }}
                status={SentencedToEmpty(listStatus
                    ,['status'],200)}
                // status={200}
            >
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 1, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={20}
                    hasMore={() => {
                        return false;
                    }}
                    onRefresh={index => {
                        this.statusPageOnRefresh(true);
                        // this.refresh(this.list.setListData);
                    }}
                    onEndReached={index => {
                        // this.nextPage(index);
                    }}
                    renderItem={this.renderItem}
                    data={listData}
                />
                {
                    this.renderBottomBtn()
                }
            </StatusPage>
        </View>)
    }
}
