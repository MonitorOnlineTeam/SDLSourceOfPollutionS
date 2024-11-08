import { Platform } from 'react-native';

export const CURRENT_PROJECT = 'POLLUTION_ORERATION_PROJECT';

export const AIR_PROJECT = 'AIR_PROJECT'; //大气产品
export const ORERATION = 'ORERATION'; //运维
export const WATER_PROJECT = 'WATER_PROJECT'; //水质产品
export const GRID_PROJECT = 'GRID_PROJECT'; //网格化产品
export const POLLUTION_PROJECT = 'POLLUTION_PROJECT'; //污染源
export const POLLUTION_ORERATION_PROJECT = 'POLLUTION_ORERATION_PROJECT'; //污染源运维
export const GRID_ORERATION_PROJECT = 'GRID_ORERATION_PROJECT'; //网格化运维

export const APPROVE_CODE = 'APPROVE_CODE';
export const TASK_EXECUTION_CODE = 'TASK_EXECUTION_CODE';
export const TASK_RECORD_CODE = 'TASK_RECORD_CODE';

export const DEBUG = true;
export const IMAGE_DEBUG = false;
export const DIRECT_CONNECTION = false;

export const pushSettingKey = 'pushSetting';
export const rootUrlKey = 'rootUrl';
export const routerConfigKey = 'routerConfig';

export const lineColors1 = ['#fe2b00', '#fee101', '#24eeec', '#95d502', '#0084fb', '#c66ffa', '#fc64c4'];
export const lineColors2 = ['#a51919', '#fda100', '#0fddaa', '#4da202', '#033ee0', '#8238e2', '#e10ac0'];
export const lineColorsAll = ['#fe2b00', '#fee101', '#24eeec', '#95d502', '#0084fb', '#c66ffa', '#fc64c4', '#a51919', '#fda100', '#0fddaa', '#4da202', '#033ee0', '#8238e2', '#e10ac0'];

/**
 * 获取版本更新配置
 */
const getVersionInfo = () => {
    if (CURRENT_PROJECT == AIR_PROJECT) {
        if (Platform.OS == 'android') return { app_version_code: 10, app_version_name: '1.1.0' };
        else if (Platform.OS == 'ios') return { app_version_code: 10, app_version_name: '1.1.0' };
    } else if (CURRENT_PROJECT == ORERATION) {
        if (Platform.OS == 'android') return { app_version_code: 12, app_version_name: '1.1.2' };
        else if (Platform.OS == 'ios') return { app_version_code: 12, app_version_name: '1.1.2' };
    } else if (CURRENT_PROJECT == WATER_PROJECT) {
        if (Platform.OS == 'android') return { app_version_code: 20, app_version_name: '1.2.0' };
        else if (Platform.OS == 'ios') return { app_version_code: 20, app_version_name: '1.2.0' };
    } else if (CURRENT_PROJECT == GRID_PROJECT) {
        if (Platform.OS == 'android') return { app_version_code: 40, app_version_name: '2.2.0' };
        else if (Platform.OS == 'ios') return { app_version_code: 40, app_version_name: '2.2.0' };
    } else if (CURRENT_PROJECT == POLLUTION_PROJECT) {
        if (Platform.OS == 'android') return { app_version_code: 50, app_version_name: '1.5.0', version_type: '' };
        else if (Platform.OS == 'ios') return { app_version_code: 48, app_version_name: '1.4.8', version_type: '' };
    } else if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT) {
        // 公司运维  智慧运维
        if (Platform.OS == 'android') return { app_version_code: 73, app_version_name: '1.7.3', version_type: 'xinjiangbingtuan' };
        else if (Platform.OS == 'ios') return { app_version_code: 33, app_version_name: '1.3.3', version_type: 'xinjiangbingtuan' };
        // 新疆
        // if (Platform.OS == 'android') return { app_version_code: 36, app_version_name: '1.3.6', version_type: 'xinjiangbingtuan' };
        // else if (Platform.OS == 'ios') return { app_version_code: 33, app_version_name: '1.3.3', version_type: 'xinjiangbingtuan' };
    } else if (CURRENT_PROJECT == GRID_ORERATION_PROJECT) {
        if (Platform.OS == 'android') return { app_version_code: 11, app_version_name: '1.1.1' };
        else if (Platform.OS == 'ios') return { app_version_code: 11, app_version_name: '1.1.1' };
    }
};
export const VersionInfo = getVersionInfo();

/**
 * 获取IP配置
 */
export const IconUrl = 'https://api.chsdl.net/PhoneManager/PollutionManager/image/';
const getUrlConfig = () => {
    if (CURRENT_PROJECT == POLLUTION_PROJECT) {
        if (typeof DIRECT_CONNECTION != 'undefined' && DIRECT_CONNECTION) {
            return {
                // BaseUrl: 'http://220.171.32.30:8180/',
                // ImageUrl: 'http://220.171.32.30:8180/upload/',
                // ReportUrl: 'http://220.171.32.30:8180/',
                // UpdateUrl: 'https://api.chsdl.net/PhoneManager/PollutionManager/app_update_config.json',
                // enterpriseInformationUrlPrefix: 'https://api.chsdl.net/NewWryWebProxy/'

                BaseUrl: 'http://172.16.9.53:8036/',
                ImageUrl: 'http://172.16.9.53:8036/upload/',
                ReportUrl: 'http://172.16.9.53:8036/',
                UpdateUrl: 'https://api.chsdl.net/PhoneManager/PollutionManager/app_update_config.json',
                enterpriseInformationUrlPrefix: 'https://api.chsdl.net/NewWryWebProxy/'
            };
        } else {
            return {
                // BaseUrl: 'https://cs.chsdl.com/NewWryWebProxy/',
                // ImageUrl: 'https://cs.chsdl.com/NewWryWebProxy/upload/',
                // ReportUrl: 'https://cs.chsdl.com/NewWryWebProxy/',
                // UpdateUrl: 'https://api.chsdl.net/PhoneManager/PollutionManager/app_update_config.json',
                // enterpriseInformationUrlPrefix: 'https://cs.chsdl.com/NewWryWebProxy/'

                BaseUrl: 'https://api.chsdl.net/NewWryWebProxy/',
                ImageUrl: 'https://api.chsdl.net/NewWryWebProxy/upload/',
                ReportUrl: 'https://api.chsdl.net/NewWryWebProxy/',
                UpdateUrl: 'https://api.chsdl.net/PhoneManager/PollutionManager/app_update_config.json',
                enterpriseInformationUrlPrefix: 'https://api.chsdl.net/NewWryWebProxy/'
            };
        }

    } else if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT) {
        if (typeof DIRECT_CONNECTION != 'undefined' && DIRECT_CONNECTION) {
            return {
                // BaseUrl: 'http://220.171.32.30:8180/',
                // ImageUrl: 'http://220.171.32.30:8180/upload/',
                // ReportUrl: 'http://220.171.32.30:8180/',
                // UpdateUrl: 'https://api.chsdl.net/PhoneManager/PollutionOperation/app_update_config.json',
                // enterpriseInformationUrlPrefix: 'https://api.chsdl.net/NewWryWebProxy/'

                BaseUrl: 'http://172.16.9.53:8036/',
                ImageUrl: 'http://172.16.9.53:8036/upload/',
                ReportUrl: 'http://172.16.9.53:8036/',
                UpdateUrl: 'https://api.chsdl.net/PhoneManager/PollutionManager/app_update_config.json',
                enterpriseInformationUrlPrefix: 'https://api.chsdl.net/NewWryWebProxy/'
            };
        } else {
            return {
                // 新疆
                // UpdateUrl: 'https://api.chsdl.net/PhoneManager/PollutionOperation/app_update_config.json',
                // 公司运维  智慧运维
                // UpdateUrl: 'https://api.chsdl.net/PhoneManager/IntelligenceOperations/app_update_config.json',
                UpdateUrl: 'https://api.chsdl.net/PhoneManager/IntelligenceOperationsNetcore/app_update_config.json', //智慧运维Netcore
                AndroidUpdateWebPage: 'http://api.chsdl.net/phonemanager/IntelligenceOperationsNetcore/app_download/Download.html', //智慧运维Netcore
                // BaseUrl: 'https://cs.chsdl.com/NewWryWebProxy/',
                // ImageUrl: 'https://cs.chsdl.com/NewWryWebProxy/upload/',
                // ReportUrl: 'https://cs.chsdl.com/NewWryWebProxy/',
                // enterpriseInformationUrlPrefix: 'https://cs.chsdl.com/NewWryWebProxy/'

                // BaseUrl: 'http://220.171.32.30:8180/',
                // ImageUrl: 'http://220.171.32.30:8180/upload/',
                // ReportUrl: 'http://220.171.32.30:8180/',

                // BaseUrl: 'https://api.chsdl.net/NewWryWebProxy/',
                // ImageUrl: 'https://api.chsdl.net/NewWryWebProxy/upload/',
                // ReportUrl: 'https://api.chsdl.net/NewWryWebProxy/',
                // enterpriseInformationUrlPrefix: 'https://api.chsdl.net/NewWryWebProxy/'

                // nginx代理
                BaseUrl: 'https://cs.chsdl.com:5017/',
                // BaseUrl: 'http://172.16.12.98:5018/',
                // BaseUrl: 'https://61.50.135.115:5017/',
                // DataAnalyze: 'http://61.50.135.114:63002',
                // DataAnalyze: 'http://172.16.12.234:60061',
                // DataAnalyze: 'http://172.16.12.234:61003/newApi', 
                DataAnalyze: 'https://cs.chsdl.com:5017',
                // DataAnalyze: 'https://cs.chsdl.com:5017/newApi',
                ImageUrl: 'https://cs.chsdl.com:5017/upload/',
                ReportUrl: 'https://cs.chsdl.com:5017/',
                enterpriseInformationUrlPrefix: 'https://cs.chsdl.com:5017/'
            };
        }
    }
};
export const UrlInfo = getUrlConfig();

/**
 * 获取登录图片
 */
const getLoginImage = () => {
    if (CURRENT_PROJECT == AIR_PROJECT) {
        return require('../images/login_air.png');
    } else if (CURRENT_PROJECT == ORERATION) {
        return require('../images/login_operation.png');
    } else if (CURRENT_PROJECT == WATER_PROJECT) {
        return require('../images/login_water.png');
    } else if (CURRENT_PROJECT == GRID_PROJECT) {
        return require('../images/login_air_grid.png');
    } else if (CURRENT_PROJECT == POLLUTION_PROJECT) {
        return require('../images/login_pollution.png');
    } else if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT) {
        return require('../images/login_pollution.png');
    } else if (CURRENT_PROJECT == GRID_ORERATION_PROJECT) {
        return require('../images/login_operation.png');
    }
};

export const LoginImage = getLoginImage();

/**
 * 获取个人中心配置
 */
const getAccountConfig = () => {
    if (CURRENT_PROJECT == AIR_PROJECT) {
        return [
            { title: '账户与安全', routeName: 'AccountSecurity', params: {} },
            { title: '推送设置', routeName: 'PushSetting', params: {} },
            { title: '报警消息', routeName: 'Alarm', params: {} },
            {
                title: `版本更新 (v${getVersionInfo().app_version_name})`,
                routeName: 'update',
                params: {}
            },
            { title: '退出登录', routeName: 'logout', params: {} }
        ];
    } else if (CURRENT_PROJECT == ORERATION) {
        return [
            { title: '账户与安全', routeName: 'AccountSecurity', params: {} },
            { title: '推送设置', routeName: 'PushSetting', params: {} },
            {
                title: `版本更新 (v${getVersionInfo().app_version_name})`,
                routeName: 'update',
                params: {}
            },
            { title: '退出登录', routeName: 'logout', params: {} }
        ];
    } else if (CURRENT_PROJECT == WATER_PROJECT) {
        return [
            { title: '账户与安全', routeName: 'AccountSecurity', params: {} },
            { title: '推送设置', routeName: 'PushSetting', params: {} },
            {
                title: `版本更新 (v${getVersionInfo().app_version_name})`,
                routeName: 'update',
                params: {}
            },
            { title: '退出登录', routeName: 'logout', params: {} }
        ];
    } else if (CURRENT_PROJECT == GRID_PROJECT) {
        return [
            { title: '推送设置', routeName: 'PushSetting', params: {} },
            {
                title: `版本更新 (v${getVersionInfo().app_version_name})`,
                routeName: 'update',
                params: {}
            },
            { title: '退出登录', routeName: 'logout', params: {} }
        ];
    } else if (CURRENT_PROJECT == POLLUTION_PROJECT) {
        return [
            { title: '消息中心', routeName: 'Notice', params: {} },
            { title: '账户与安全', routeName: 'AccountSecurity', params: {} },
            { title: '推送设置', routeName: 'PushSetting', params: {} },
            {
                title: `版本更新 (v${getVersionInfo().app_version_name})`,
                routeName: 'update',
                params: {}
            },
            { title: '退出登录', routeName: 'logout', params: {} }
        ];
    } else if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT) {
        return [
            // { title: '报警记录', routeName: 'AlarmAnalyList', params: {} },
            { title: '帮助中心', routeName: 'HelpCenter', params: {} },
            { title: '下载应用', routeName: 'DownLoadAPP', params: {} },
            { title: '我的证书', routeName: 'OperaStaffInfo', params: {} },
            { title: '账户与安全', routeName: 'AccountSecurity', params: {} },
            { title: '推送设置', routeName: 'PushSetting', params: {} },
            { title: '微信公众号绑定', routeName: 'wxPushBinding', params: {} },
            // { title: '离线图片上传', routeName: 'OfflineImageUploadList', params: {} },
            {
                title: `版本更新 (v${getVersionInfo().app_version_name})`,
                routeName: 'update',
                params: {}
            },
            { title: '退出登录', routeName: 'logout', params: {} }
        ];
    } else if (CURRENT_PROJECT == GRID_ORERATION_PROJECT) {
        return [
            { title: '账户与安全', routeName: 'AccountSecurity', params: {} },
            {
                title: `版本更新 (v${getVersionInfo().app_version_name})`,
                routeName: 'update',
                params: {}
            },
            { title: '退出登录', routeName: 'logout', params: {} }
        ];
    }
};

export const AccountConfig = getAccountConfig();
export const RSAPubSecret = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCC0hrRIjb3noDWNtbDpANbjt5Iwu2NFeDwU16Ec87ToqeoIm2KI+cOs81JP9aTDk/jkAlU97mN8wZkEMDr5utAZtMVht7GLX33Wx9XjqxUsDfsGkqNL8dXJklWDu9Zh80Ui2Ug+340d5dZtKtd+nv09QZqGjdnSp9PTfFDBY133QIDAQAB';

const internalNetPrefix = 'http://172.16.9.53:6777/api61002';
// const outerNetPrefix = 'http://61.50.135.114:6777/api61002';
// const outerNetPrefix = 'https://cs.chsdl.com:5017/api62545';
const outerNetPrefix = 'https://cs.chsdl.com:5017/api';
export const ImageUrlPrefix = outerNetPrefix;
// export const ImageUrlPrefix = internalNetPrefix;