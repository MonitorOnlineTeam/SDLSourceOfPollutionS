// export { NavigationActions, StackActions } from 'react-navigation';
import { HeaderBackButton } from '@react-navigation/elements';
import { MessageBarManager } from 'react-native-message-bar';
import LoadingManager from '../framework/LoadingManager';
export const createAction = type => payload => ({ type, payload });

const NavigationActions = {
    navigate: (params = {}) => {
        return createAction('sdlNavigate/navigate')(params);
    },
    reset: (params = {}) => {
        return createAction('sdlNavigate/reset')(params);
    },
    back: (params = {}) => {
        return createAction('sdlNavigate/back')({});
    }
}
const StackActions = () => { }
export { NavigationActions, StackActions };
import { Platform, Linking, StatusBar, Dimensions, AsyncStorage } from 'react-native';
import moment from 'moment';
// import OpenFile from 'react-native-doc-viewer';
// import RNFS from 'react-native-fs';
// import Intent from 'react-native-android-intent';

// import { Toast } from 'antd-mobile-rn';
// import ImagePicker from 'react-native-image-picker';
import globalcolor from '../config/globalcolor';
import { getEncryptData, getRootUrl } from '../dvapack/storage';
import { SCREEN_WIDTH } from '../config/globalsize';
import Actions from './RouterUtils';

// export { default as Storage } from './storage';

// export * from './timeutil';

// export * from './strutil';
export * from './logutil';
export * from './numutil';
export * from './colorutil';
// export * from './coordinate';
export * from './webSocketUtil';

export const delay = time => new Promise(resolve => setTimeout(resolve, time));

export const fast = (time = 5000) =>
    new Promise(resolve =>
        setTimeout(() => {
            if (!__DEV__) {
                resolve({ requstresult: 5, reason: '服务器响应超时' });
            }
        }, time)
    );

export const ShowToast = msgOption => {
    // MessageBarManager.showAlert({
    //     message: '请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空',
    //     alertType: 'info',
    // })
    // MessageBarManager.showAlert({
    //     message: '请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空',
    //     alertType: 'warning',
    // })
    // MessageBarManager.showAlert({
    //     message: '请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空',
    //     alertType: 'success',
    // })
    // MessageBarManager.showAlert({
    //     message: '请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空',
    //     alertType: 'error',
    // })
    // console.log('ShowToast 被调用');
    CloseToast();
    console.log('ShowToast 被调用', msgOption);
    // Toast.info(msg, 1);
    if (typeof msgOption == 'string') {
        msgOption = { message: msgOption, alertType: 'info' };
    }
    MessageBarManager.showAlert(msgOption);
};

export const SentencedToEmpty = (obj, keys, emptyValue) => {
    let temp = obj,
        tempResult;
    if (typeof temp != 'undefined'
        && (temp || (typeof temp == 'number' && temp == 0)
            || (typeof temp == 'boolean' && temp == false))) {
        for (let i = 0; i < keys.length; i++) {
            temp = temp[keys[i]];
            if (typeof temp != 'undefined'
                && (temp || (typeof temp == 'number' && temp == 0) || (typeof temp == 'boolean' && temp == false))) {
                tempResult = temp;
            } else {
                // tempResult = temp = emptyValue;
                tempResult = emptyValue;
                return tempResult;
            }
        }
    } else {
        // tempResult = temp = emptyValue;
        tempResult = emptyValue;
    }
    return tempResult;
};

export const SentencedToEmptyTimeString = (obj, keys, emptyValue, formatStr) => {
    let temp = obj,
        tempResult,
        msg = 'SentencedToEmptyTimeString';
    if (typeof temp != 'undefined' && temp) {
        for (let i = 0; i < keys.length; i++) {
            temp = temp[keys[i]];
            if (typeof temp != 'undefined' && temp) {
                msg = msg + '.' + keys[i];
                tempResult = temp;
            } else {
                tempResult = temp = emptyValue;
                return tempResult;
            }
        }
    } else {
        tempResult = temp = emptyValue;
    }
    let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
    let regExp = new RegExp(reg);
    if (regExp.test(tempResult)) {
        return moment(tempResult).format(formatStr);
    } else {
        console.log(msg + ' is not date.');
        return emptyValue;
    }
};

export const secondlevelDataHandle = tabDataItem => {
    let firstlevel = {},
        secondlevel = [],
        menuList = [],
        editWorkBenchData = [];
    SentencedToEmpty(tabDataItem, ['children'], []).map(item => {
        firstlevel = { ...item };
        secondlevel = [];

        SentencedToEmpty(item, ['children'], []).map((innerItem, innerIndex) => {

            switch (innerItem.id) {
                case '9e9bd943-1d5b-46c1-a0a9-c53bea71b552':
                    // 服务提醒
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '服务提醒'), img: require('../images/renwujilu.png'), numkey: 'ServiceReminderCalendar' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '服务提醒'), img: require('../images/renwujilu.png'), numkey: 'ServiceReminderCalendar' });
                    break;
                case 'be671aa8-f21f-4230-87d6-6c12d2912d6c':
                    // 备件更换
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '备件更换'), img: require('../images/renwujilu.png'), numkey: 'SparePartsChangeEditor' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '备件更换'), img: require('../images/renwujilu.png'), numkey: 'SparePartsChangeEditor' });
                    break;
                case '834900f4-4820-4143-87d2-1116377a46e3':
                    // 服务报告整改
                    secondlevel.push({ ...innerItem, dcountkey: 'serviceStatusNum', label: SentencedToEmpty(innerItem, ['name'], '服务报告整改'), img: require('../images/renwujilu.png'), numkey: 'ServiceReportRectificationList' });
                    menuList.push({ ...innerItem, dcountkey: 'serviceStatusNum', label: SentencedToEmpty(innerItem, ['name'], '服务报告整改'), img: require('../images/renwujilu.png'), numkey: 'ServiceReportRectificationList' });
                    break;
                case '2273c00d-7594-4f85-8174-b46903a93ff7':
                    //  "任务记录"
                    secondlevel.push({ ...innerItem, dcountkey: 'checkTaskCount', label: SentencedToEmpty(innerItem, ['name'], '任务记录'), img: require('../images/ic_ct_sign_in.png'), numkey: 'TaskToBeVerifiedList' });
                    menuList.push({ ...innerItem, dcountkey: 'checkTaskCount', label: SentencedToEmpty(innerItem, ['name'], '任务记录'), img: require('../images/ic_ct_sign_in.png'), numkey: 'TaskToBeVerifiedList' });

                    // 测试 异常识别2.0整改
                    // secondlevel.push({ ...innerItem, id: 123, dcountkey: 'checkedRectificationListCount', name: '异常整改', label: '异常整改', img: require('../images/ic_ct_sign_in.png'), numkey: 'MissionVerificationRectificationList', params: { role: 'expert' } });
                    // menuList.push({ ...innerItem, id: 123, dcountkey: 'checkedRectificationListCount', name: '异常整改', label: '异常整改', img: require('../images/ic_ct_sign_in.png'), numkey: 'MissionVerificationRectificationList', params: { role: 'expert' } });
                    // secondlevel.push({ ...innerItem, id: 123, dcountkey: 'checkedRectificationListCount', name: '异常整改', label: '异常整改', img: require('../images/ic_ct_sign_in.png'), numkey: 'MissionVerificationRectificationList', params: { role: 'operationStaff' } });
                    // menuList.push({ ...innerItem, id: 123, dcountkey: 'checkedRectificationListCount', name: '异常整改', label: '异常整改', img: require('../images/ic_ct_sign_in.png'), numkey: 'MissionVerificationRectificationList', params: { role: 'operationStaff' } });
                    // secondlevel.push({ ...innerItem, id: 123, dcountkey: 'checkedRectificationListCount', name: '异常整改', label: '异常整改', img: require('../images/ic_ct_sign_in.png'), numkey: 'MissionVerificationRectificationList' });
                    // menuList.push({ ...innerItem, id: 123, dcountkey: 'checkedRectificationListCount', name: '异常整改', label: '异常整改', img: require('../images/ic_ct_sign_in.png'), numkey: 'MissionVerificationRectificationList' });
                    break;
                case '9475d452-e408-43cc-99f8-05237ddeaf38':
                    //  "异常识别2.0整改"
                    secondlevel.push({ ...innerItem, id: 123, dcountkey: 'checkedRectificationListCount', label: SentencedToEmpty(innerItem, ['name'], '异常整改'), img: require('../images/ic_ct_sign_in.png'), numkey: 'MissionVerificationRectificationList' });
                    menuList.push({ ...innerItem, id: 123, dcountkey: 'checkedRectificationListCount', label: SentencedToEmpty(innerItem, ['name'], '异常整改'), img: require('../images/ic_ct_sign_in.png'), numkey: 'MissionVerificationRectificationList' });
                    break;
                case '153aecef-0ca7-470e-8503-b6df1ef592bf':
                    //  "数据报警/异常识别企业列表"
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '异常识别'), img: require('../images/tongzhi.png'), numkey: 'AlarmSectionList' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '异常识别'), img: require('../images/tongzhi.png'), numkey: 'AlarmSectionList' });
                    break;
                case '740171a4-a61d-4c14-bfa8-af32466574cc':
                    //  "数据报警/异常识别企业列表"
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '异常识别'), img: require('../images/tongzhi.png'), numkey: 'AbnormalEnterpriseList' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '异常识别'), img: require('../images/tongzhi.png'), numkey: 'AbnormalEnterpriseList' });
                    // secondlevel.push({ ...innerItem, label: '异常识别', img: require('../images/tongzhi.png'), numkey: 'AlarmSectionList' });
                    // menuList.push({ ...innerItem, label: '异常识别', img: require('../images/tongzhi.png'), numkey: 'AlarmSectionList' });
                    break;
                case '96f4f52d-fc33-4293-b62f-653cc9370288':
                    // "安装照片整改"
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], "安装照片整改"), numkey: 'EquipmentInstallationPicAudit', countkey: 'EquipmentInstallationPicAudit', dcountkey: 'equipmentAuditRectificationNum', img: require('../images/renwujilu.png') });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], "安装照片整改"), numkey: 'EquipmentInstallationPicAudit', countkey: 'EquipmentInstallationPicAudit', dcountkey: 'equipmentAuditRectificationNum', img: require('../images/renwujilu.png') })
                    break;
                case '27d6140f-0acb-4c54-bea1-61ef1ef36ac6':
                    // 运维签到
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '运维签到'), numkey: 'SignInEnter', countkey: 'SignInEnter', dcountkey: '', img: require('../images/ic_ct_sign_in.png') });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '运维签到'), numkey: 'SignInEnter', countkey: 'SignInEnter', dcountkey: '', img: require('../images/ic_ct_sign_in.png') })
                    break;
                case '0fc20ea8-5091-4d03-b964-8aa3e2dda124':
                    // 待办任务
                    // secondlevel.push({ label: '待办任务', numkey: 'GTaskOfEnterprise', countkey: 'TaskCount', dcountkey: '' });
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '待办任务'), numkey: 'GTaskOfEnterprise', countkey: 'TaskCount', dcountkey: '' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '待办任务'), numkey: 'GTaskOfEnterprise', countkey: 'TaskCount', dcountkey: '' })
                    break;
                case '2fa0ef8d-dd69-46a3-b159-5ab105912c0a':
                    // 待我审批
                    // secondlevel.push({ label: '待我审批', numkey: 'PerformApproval', countkey: 'PerformApprovalCount', dcountkey: 'PerformApprovalCount', params: { pageType: 1 }  });
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '待我审批'), numkey: 'PerformApproval', countkey: 'PerformApprovalCount', dcountkey: 'PerformApprovalCount', params: { pageType: 1 } });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '待我审批'), numkey: 'PerformApproval', countkey: 'PerformApprovalCount', dcountkey: 'PerformApprovalCount', params: { pageType: 1 } });
                    break;
                case '401cc92e-7ef3-430f-8dc1-57d64b09c352':
                    // 超标预警
                    // secondlevel.push({ label: '超标预警', numkey: 'OverWarning', countkey: 'OverWarning', dcountkey: 'OverWarningCount' });
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '超标预警'), numkey: 'OverWarning', countkey: 'OverWarning', dcountkey: 'OverWarningCount' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '超标预警'), numkey: 'OverWarning', countkey: 'OverWarning', dcountkey: 'OverWarningCount' });
                    break;
                case 'e976cd64-86e9-4309-a471-41c141d9e15a':
                    // 超标报警
                    // secondlevel.push({ label: '超标报警', numkey: 'OverAlarm', countkey: 'OverCount', dcountkey: 'overAlarmCount' });
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '超标报警'), numkey: 'OverAlarm', countkey: 'OverCount', dcountkey: 'overAlarmCount' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '超标报警'), numkey: 'OverAlarm', countkey: 'OverCount', dcountkey: 'overAlarmCount' });
                    break;
                case 'bad20981-02ca-4063-bddb-69746bb14102':
                    // 异常报警
                    // secondlevel.push({ label: '异常报警', numkey: 'ExceptionAlarm', countkey: 'AlarmCount', dcountkey: 'exceptionAlarmCount' });
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '异常报警'), numkey: 'ExceptionAlarm', countkey: 'AlarmCount', dcountkey: 'exceptionAlarmCount' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '异常报警'), numkey: 'ExceptionAlarm', countkey: 'AlarmCount', dcountkey: 'exceptionAlarmCount' });
                    break;
                case '6d1e3a4b-397c-4c06-983e-a9c2f45176dd':
                    // 缺失报警
                    // secondlevel.push({ label: '缺失报警', numkey: 'MissAlarm', countkey: 'MissAlarm', dcountkey: 'missAlarmCount' });
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '缺失报警'), numkey: 'MissAlarm', countkey: 'MissAlarm', dcountkey: 'missAlarmCount' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '缺失报警'), numkey: 'MissAlarm', countkey: 'MissAlarm', dcountkey: 'missAlarmCount' });
                    break;
                case '735faa4e-4e9c-45cd-8802-f9553126acba':
                    // 故障反馈
                    // secondlevel.push({ label: '故障反馈', img: require('../images/renwujilu.png'), numkey: 'EquipmentFailureFeedbackList' });
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '故障反馈'), img: require('../images/renwujilu.png'), numkey: 'EquipmentFailureFeedbackList' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '故障反馈'), img: require('../images/renwujilu.png'), numkey: 'EquipmentFailureFeedbackList' });
                    break;
                case 'ae4426a8-cdd3-4d5d-b2da-2b5f349373a2':
                    /**
                     * 宝武运维
                     * ae4426a8-cdd3-4d5d-b2da-2b5f349373a2
                     * bwtask
                     */
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '宝武运维'), img: require('../images/renwujilu.png'), numkey: 'SHEnterpriseList' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '宝武运维'), img: require('../images/renwujilu.png'), numkey: 'SHEnterpriseList' });
                    break;
                case 'f8c7b7dc-6441-40bb-bc7a-9bb4da5f211f':
                    // 关键参数核查
                    // secondlevel.push({ label: '关键参数核查', img: require('../images/renwujilu.png'), numkey: 'KeyParameterVerificationList' });
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '关键参数核查'), img: require('../images/renwujilu.png'), numkey: 'KeyParameterVerificationList' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '关键参数核查'), img: require('../images/renwujilu.png'), numkey: 'KeyParameterVerificationList' });
                    break;
                case '4e66e62b-66f1-41fe-a595-37312c549bdb':
                    // 设施核查整改
                    // secondlevel.push({ label: '设施核查整改', img: require('../images/renwujilu.png'), numkey: 'SuperviserRectifyList' });
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '设施核查整改'), img: require('../images/renwujilu.png'), numkey: 'SuperviserRectifyList' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '设施核查整改'), img: require('../images/renwujilu.png'), numkey: 'SuperviserRectifyList' });
                    break;
                case '021d1519-b23d-48fd-8130-0e0bf44bd728':
                    // 宝武领取工单'
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '领取工单'), img: require('../images/renwujilu.png'), numkey: 'ManualClaimTask' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '领取工单'), img: require('../images/renwujilu.png'), numkey: 'ManualClaimTask' });
                    break;

                case '185ef6e1-96b4-48bd-b36f-2949a03fd8f2':
                    //  "成套待办"
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '成套待办'), img: require('../images/ic_ct_sign_in.png'), numkey: 'ChengTaoGTask' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '成套待办'), img: require('../images/ic_ct_sign_in.png'), numkey: 'ChengTaoGTask' });
                    break;
                case 'b8b30732-3dae-46c4-aeaf-2114c0516c06':
                    //  "成套签到"
                    secondlevel.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '成套签到'), img: require('../images/ic_ct_sign_in.png'), numkey: 'ChengTaoSignIn' });
                    menuList.push({ ...innerItem, label: SentencedToEmpty(innerItem, ['name'], '成套签到'), img: require('../images/ic_ct_sign_in.png'), numkey: 'ChengTaoSignIn' });
                    break;
                case 'efbd94a3-e794-457b-91f7-592df4b91af4':
                    //  "模型整改"
                    secondlevel.push({ ...innerItem, label: innerItem.name, img: require('../images/ic_ct_sign_in.png'), numkey: 'AnalysisModelAbnormalRectificationList' });
                    menuList.push({ ...innerItem, label: innerItem.name, img: require('../images/ic_ct_sign_in.png'), numkey: 'AnalysisModelAbnormalRectificationList' });
                    break;
            }
        });

        firstlevel.children = secondlevel;
        editWorkBenchData.push(firstlevel);
    });
    return {
        editWorkBenchDataResult: editWorkBenchData,
        menuListResult: menuList
    };
};

export const Event = {
    // 通过on接口监听事件eventName 如果事件eventName被触发，则执行callback回调函数
    on(eventName, callback) {
        // 你的代码
        if (!this.handles) {
            // this.handles={};
            Object.defineProperty(this, 'handles', {
                value: {},
                enumerable: false,
                configurable: true,
                writable: true
            });
        }

        if (!this.handles[eventName]) {
            this.handles[eventName] = [];
        }
        this.handles[eventName].push(callback);
    },
    // 触发事件 eventName
    emit(eventName) {
        // 你的代码
        if (this.handles[arguments[0]]) {
            for (let i = 0; i < this.handles[arguments[0]].length; i++) {
                this.handles[arguments[0]][i](arguments[1]);
            }
        }
    }
};

export const getCurrentScreen = navigationState => {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
        return getCurrentScreen(route);
    }
    return route.routeName;
};
export const CloseToast = () => {
    console.log('CloseToast 插件未添加');
    // Toast.hide();
    LoadingManager.hide();
};
export const ShowLoadingToast = msg => {
    console.log('Toast 插件未添加');
    // Toast.loading(msg, 10000, () => { });
    LoadingManager.show(msg);
};
export const getCurrentParams = navigationState => {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
        return getCurrentParams(route);
    }
    return route.params;
};

export const selectPic = callback => {
    const options = {
        title: 'Select Avatar',
        quality: 0.5,
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images'
        }
    };
    console.log('ImagePicker插件未添加');
    // ImagePicker.launchCamera(options, response => {
    //     if (response.didCancel) {
    //         // console.log('User cancelled image picker');
    //     } else if (response.error) {
    //         console.log('ImagePicker Error: ', response.error);
    //     } else if (response.customButton) {
    //         // console.log('User tapped custom button: ', response.customButton);
    //     } else {
    //         // const source = { uri: response.uri };

    //         // You can also display the image using data:
    //         // const source = { uri: 'data:image/jpeg;base64,' + response.data };

    //         // this.setState({
    //         //   avatarSource: response.data,
    //         //   path:'file://'+response.path
    //         // });
    //         callback(response);
    //     }
    // });
};

export const createImageUrl = (Attachments, uploadurl) => {
    let ImageArr = [];
    Attachments.ThumbimgList.map((item, key) => {
        ImageArr.push({ url: uploadurl + item, imageId: item.split('/')[1].split('_thumbnail')[0], large: uploadurl + Attachments.ImgList[key] });
    });
    return ImageArr;
};

export function isIphoneX() {
    const SCREEN_WIDTH = Dimensions.get('window').width;

    const SCREEN_HEIGHT = Dimensions.get('window').height;
    const X_WIDTH = 375;

    const X_HEIGHT = 812;
    return Platform.OS === 'ios' && ((SCREEN_WIDTH >= X_WIDTH && SCREEN_HEIGHT >= X_HEIGHT) || (SCREEN_WIDTH >= X_HEIGHT && SCREEN_HEIGHT >= X_WIDTH));
}
export function isIphone14() {
    const SCREEN_WIDTH = Dimensions.get('window').width;

    const SCREEN_HEIGHT = Dimensions.get('window').height;
    const X_WIDTH = 375;

    const X_HEIGHT = 926;
    return Platform.OS === 'ios' && ((SCREEN_WIDTH >= X_WIDTH && SCREEN_HEIGHT >= X_HEIGHT) || (SCREEN_WIDTH >= X_HEIGHT && SCREEN_HEIGHT >= X_WIDTH));
}
// 标题 统一处理
export const createNavigationOptions = ({ title = '标题', headerTintColor, headerTitleStyle = {}, headerStyle = {}, headerRight = null, headerRightContainerStyle = null }) => ({
    title,
    animationEnabled: false,
    headerBackTitle: null,
    headerTintColor: headerTintColor || '#ffffff',
    headerTitleStyle: { marginTop: Platform.OS === 'ios' ? -20 : 0, flex: 1, textAlign: 'center', fontSize: 17, ...headerTitleStyle, width: SCREEN_WIDTH / 3 },
    headerStyle: { backgroundColor: globalcolor.headerBackgroundColor, height: Platform.OS === 'ios' ? 24 : 44, textAlign: 'center', ...headerStyle },
    headerRight: headerRight,
    headerLeftContainerStyle: { marginTop: Platform.OS === 'ios' ? -20 : 0, ...headerRightContainerStyle },
    headerRightContainerStyle: { marginTop: Platform.OS === 'ios' ? -20 : 0, ...headerRightContainerStyle }
});

/**
 * 根据风的名字 获取风向的度数 默认为-1000
 * @param {*} direction
 */
export const getWindRotate = direction => {
    let symbolRotate = -1000;
    switch (direction) {
        case '东风':
            symbolRotate = 180;
            break;
        case '东东北风':
            symbolRotate = 202.5;
            break;
        case '东北风':
            symbolRotate = 225;
            break;
        case '北东北风':
            symbolRotate = 247.5;
            break;
        case '北风':
            symbolRotate = 270;
            break;
        case '北西北风':
            symbolRotate = 292.5;
            break;
        case '西北风':
            symbolRotate = 315;
            break;
        case '西西北风':
            symbolRotate = 337.5;
            break;
        case '西风':
            symbolRotate = 0;
            break;
        case '西西南风':
            symbolRotate = 22.5;
            break;
        case '西南风':
            symbolRotate = 45;
            break;
        case '南西南风':
            symbolRotate = 67.5;
            break;
        case '南风':
            symbolRotate = 90;
            break;
        case '南东南风':
            symbolRotate = 112.5;
            break;
        case '东南风':
            symbolRotate = 135;
            break;
        case '东东南风':
            symbolRotate = 157.5;
            break;
    }
    return symbolRotate;
};

export const makePhone = phoneNumber => {
    if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(phoneNumber) && !/^1[34578]\d{9}$/.test(phoneNumber)) {
        ShowToast('电话号码不正确');
        return;
    }
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
        .then(supported => {
            if (!supported) {
                ShowToast('您的系统不支持电话：' + url);
            } else {
                return Linking.openURL(url);
            }
        })
        .catch(err => ShowToast('号码错误：' + err));
};

export const ShowResult = (type, msg) => {
    if (type) {
        console.log('Toast 插件未添加');
        // Toast.success(msg, 1);
    } else {
        console.log('Toast 插件未添加');
        // Toast.fail(msg, 1);
    }
};

//判断文件类型并返回图片
export const getDocumentIcon = type => {
    switch (type) {
        case 'doc':
        case 'docx':
            return require('../images/ic_doc.png');
        case 'pdf':
            return require('../images/ic_pdf.png');
        case 'xlsx':
        case 'xls':
            return require('../images/ic_xlsx.png');
        case 'txt':
            return require('../images/ic_txt.png');
        case 'ppt':
            return require('../images/resport_head_day.png');
        case 'png':
        case 'jpg':
            return require('../images/ic_pic.png');
        default:
            return require('../images/resport_news.png');
    }
};

//展示附件
export const showAttachment = async option => {
    let { downloadUrl = '', b_local_file = '', fileShowName = '文件名', beginCallBack = () => { }, progressCallBack = res => { }, endCallBack = (res, compliteFun = () => { }) => { }, errorCallBack = err => { } } = option;
    if (__DEV__) console.log('option = ', option);
    let encryData = getEncryptData();
    let rootUrl = getRootUrl();
    if (Platform.OS === 'ios') {
        if (downloadUrl != '' && b_local_file.indexOf('.') != -1) {
            console.log('苹果打开文件插件未添加');
            // OpenFile.openDocBinaryinUrl(
            //     [
            //         {
            //             url: downloadUrl,
            //             fileName: fileShowName,
            //             fileType: b_local_file.split('.')[1]
            //         }
            //     ],
            //     (error, url) => {
            //         if (error) {
            //             // this.setState({ animating: false });
            //         } else {
            //             // this.setState({ animating: false });
            //             //    console.log(url)
            //         }
            //     }
            // );
        } else {
            ShowToast('文件配置信息出错');
        }
    } else {
        let fileExist = false;
        if (b_local_file != '') {
            console.log('文件插件RNFS未添加');
            // fileExist = await RNFS.exists(`${RNFS.ExternalDirectoryPath}/${b_local_file}`);
            // console.log(`${RNFS.ExternalDirectoryPath}/${b_local_file}  fileExist = ${fileExist}`);
            if (fileExist) {
                // 打开该应用
                console.log('打开文件');
                // let filePath = `${RNFS.ExternalDirectoryPath}/${b_local_file}`;
                // Intent.open(filePath, isOpen => {
                //     if (isOpen) {
                //         console.log('Can open');
                //     } else {
                //         console.log("can't open");
                //     }
                // });
                console.log('文件打开插件未添加');
            } else {
                // 下载 并 打开
                console.log('开始下载');
                downloadFile(
                    b_local_file,
                    downloadUrl,
                    fileUri => {
                        console.log('openFileFun fileUri = ', fileUri);
                        Intent.open(fileUri, isOpen => {
                            if (isOpen) {
                                console.log('Can open');
                            } else {
                                console.log("can't open");
                            }
                        });
                    },
                    beginCallBack,
                    progressCallBack,
                    endCallBack,
                    errorCallBack
                );
            }
        }
    }
};

/*下载文件*/
const downloadFile = (fileName, fileUrl, openFileFun = fileUri => { }, beginCallBack = () => { }, progressCallBack = res => { }, endCallBack = (res, compliteFun = () => { }) => { }, errorCallBack = err => { }) => {
    beginCallBack();
    if (Platform.OS == 'ios') {
        //ios利用系统直接下载打开
        Linking.openURL(this.props.DownLoadPath);
        endCallBack(res, () => { });
        return;
    }
    console.log('文件插件RNFS未添加');
    // const downloadDest = `${RNFS.ExternalDirectoryPath}/${fileName}`;
    // let encryData = getEncryptData();
    // const options = {
    //     headers: {
    //         ProxyCode: encryData
    //     },
    //     fromUrl: fileUrl,
    //     toFile: downloadDest,
    //     background: true,
    //     begin: res => { },
    //     progress: res => {
    //         progressCallBack(res);
    //     }
    // };
    // try {
    //     const ret = RNFS.downloadFile(options);
    //     ret.promise
    //         .then(res => {
    //             // 未奔溃，无法访问到文件
    //             endCallBack(res, () => {
    //                 openFileFun(downloadDest);
    //             });
    //             // 打开文件
    //         })
    //         .catch(err => {
    //             errorCallBack(err);
    //         });
    // } catch (e) {
    //     errorCallBack(err);
    //     return;
    // }
};

// 上传图片获取唯一id
export const getDefinedId = () => {
    const time = new Date().getTime();
    let tail = Math.floor(Math.random() * 100000);
    if (tail < 10) {
        tail = `0000${tail}`;
    } else if (tail >= 10 && tail < 100) {
        tail = `000${tail}`;
    } else if (tail >= 100 && tail < 1000) {
        tail = `00${tail}`;
    } else if (tail >= 1000 && tail < 10000) {
        tail = `0${tail}`;
    } else {
        tail = `${tail}`;
    }
    return `${time}${tail}`;
};

export function utf8Decode(inputStr) {
    var outputStr = '';
    var code1, code2, code3, code4;

    for (var i = 0; i < inputStr.length; i++) {
        code1 = inputStr.charCodeAt(i);

        if (code1 < 128) {
            outputStr += String.fromCharCode(code1);
        } else if (code1 < 224) {
            code2 = inputStr.charCodeAt(++i);
            outputStr += String.fromCharCode(((code1 & 31) << 6) | (code2 & 63));
        } else if (code1 < 240) {
            code2 = inputStr.charCodeAt(++i);
            code3 = inputStr.charCodeAt(++i);
            outputStr += String.fromCharCode(((code1 & 15) << 12) | ((code2 & 63) << 6) | (code3 & 63));
        } else {
            code2 = inputStr.charCodeAt(++i);
            code3 = inputStr.charCodeAt(++i);
            code4 = inputStr.charCodeAt(++i);
            outputStr += String.fromCharCode(((code1 & 7) << 18) | ((code2 & 63) << 12) | ((code3 & 63) << 6) | (code2 & 63));
        }
    }

    return outputStr;
}

//--------把中文字符转换成Utf8编码------------------------//
export const EncodeUtf8 = s1 => {
    // 测试用
    // s1 = '平台功1能研发3计划安排-2021你好11nihao15.xlsx';
    var s = escape(s1);
    var sa = s.split('%');
    var retV = '';
    if (sa[0] != '') {
        retV = sa[0];
    }
    for (var i = 1; i < sa.length; i++) {
        if (sa[i].substring(0, 1) == 'u') {
            if (sa[i].length > 5) {
                retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5))) + sa[i].substring(5, sa[i].length);
            } else {
                retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));
            }
        } else retV += '%' + sa[i];
    }

    return retV;
};
function Str2Hex(s) {
    var c = '';
    var n;
    var ss = '0123456789ABCDEF';
    var digS = '';
    for (var i = 0; i < s.length; i++) {
        c = s.charAt(i);
        n = ss.indexOf(c);
        digS += Dec2Dig(eval(n));
    }
    //return value;
    return digS;
}
function Dec2Dig(n1) {
    var s = '';
    var n2 = 0;
    for (var i = 0; i < 4; i++) {
        n2 = Math.pow(2, 3 - i);
        if (n1 >= n2) {
            s += '1';
            n1 = n1 - n2;
        } else s += '0';
    }
    return s;
}
function Dig2Dec(s) {
    var retV = 0;
    if (s.length == 4) {
        for (var i = 0; i < 4; i++) {
            retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
        }
        return retV;
    }
    return -1;
}
function Hex2Utf8(s) {
    var retS = '';
    var tempS = '';
    var ss = '';
    if (s.length == 16) {
        tempS = '1110' + s.substring(0, 4);
        tempS += '10' + s.substring(4, 10);
        tempS += '10' + s.substring(10, 16);
        var sss = '0123456789ABCDEF';
        for (var i = 0; i < 3; i++) {
            retS += '%';
            ss = tempS.substring(i * 8, (eval(i) + 1) * 8);

            retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
            retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
        }
        return retS;
    }
    return '';
}

/**
 * 在字符串制定位置插入数据，形成拼装数据
 * 用逗号分割
 * @param {原字符串} str
 * @param {插入的内容} value
 * @param {插入位置} index
 * @param {字符串包含的数据个数} paramsLength
 * @returns
 */
export const setPlatformValue = (str, value, index, paramsLength = 2) => {
    const arr = str.split(',');
    let resultStr = '';
    if (arr.length == paramsLength) {
        arr.map((item, arrIndex) => {
            if (arrIndex == 0) {
                if (arrIndex == index) {
                    resultStr = value;
                } else {
                    resultStr = item;
                }
            } else {
                if (arrIndex == index) {
                    resultStr = `${resultStr},${value}`;
                } else {
                    resultStr = `${resultStr},${item}`;
                }
            }
        });
        return resultStr;
    } else {
        for (let i = 0; i < paramsLength; i++) {
            if (i == index) {
                if (i == 0) {
                    resultStr = value;
                } else {
                    resultStr = `${resultStr},${value}`;
                }
            } else {
                if (i < arr.length) {
                    if (i == 0) {
                        resultStr = arr[i];
                    } else {
                        resultStr = `${resultStr},${arr[i]}`;
                    }
                } else {
                    if (i == 0) {
                        resultStr = '';
                    } else {
                        resultStr = `${resultStr},${''}`;
                    }
                }
            }
        }
    }
    return resultStr;
};

/**
 * 读取字符串制定位置的数据，用逗号分割
 * @param {数据源} str
 * @param {读取数据的位置} index
 * @param {数据源的长度} paramsLength
 * @returns
 */
export const getPlatformValue = (str, index, paramsLength = 2) => {
    const arr = str.split(',');
    if (arr.length > index) {
        return arr[index];
    } else {
        return '';
    }
};

export const getFriendlyLocationErrorMessage = error => { };

export const bwFormatArray = data => {
    if (typeof data == 'object') {
        if (Array.isArray(data)) {
            return data;
        } else {
            if (data) {
                temp = [];
                temp.push(data.item);
                return temp;
            } else {
                return [];
            }
        }
    } else {
        return [];
    }
};

export const sleep = function (time) {
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while (true) {
        if (new Date().getTime() > endTime) {
            return;
        }
    }
};

export const getCommonHeaderStyle = () => {
    return {
        headerStyle: {
            backgroundColor: globalcolor.headerBackgroundColor,
        },
        headerTitleStyle: {
            color: 'white',
            fontSize: 16
        },
        headerTitleAlign: 'center',
        headerLeft: () => {
            return <HeaderBackButton style={{ marginLeft: -7 }} tintColor={'white'} label="Hello" onPress={() => Actions.back()} />
        }
    };
}

