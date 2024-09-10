import { observable } from 'mobx'; //"jsc-android": "236355.1.1", 0.57.7需要原生支持mbox
import { pushSettingKey, rootUrlKey, routerConfigKey } from '../../config/globalconst';
import Storage from 'react-native-storage';
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import JSEncrypt from 'jsencrypt';

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true
});
global.storage = storage;

const KEY_TOKEN = 'accessToken';
const token = observable.box(null);
const pushSetting = observable.box(null);
const rootUrl = observable.box(null);
const routerConfig = observable.box(null);
const ysToken = observable.box(null);
const websocketToken = observable.box(null);
const switchToken = observable.box(null);
const encryptData = observable.box(null);
const passwordMobx = observable.box(null);

export function getPasswordMobx() {
    return passwordMobx.get();
}
export function setPasswordMobx(password) {
    passwordMobx.set(password);
}

// AsyncStorage;
//取出加密文件
// export async function getEncryptData() {
//     let encryData = '';
//     await AsyncStorage.getItem('encryptData', function(error, result) {
//         if (error) {
//             encryData = '';
//         } else {
//             if (result == null) {
//                 encryData = '';
//             } else {
//                 encryData = result;
//             }
//         }
//     });
//     return encryData;
// }
//取出设备标识
export async function getPhoneUDID() {
    let encryData = '';
    console.log('getPhoneUDID 未实现');
    // await AsyncStorage.getItem('PHONEUDID', function (error, result) {
    //     if (error) {
    //         encryData = '';
    //     } else {
    //         if (result == null) {
    //             encryData = '';
    //         } else {
    //             encryData = result;
    //         }
    //     }
    // });
    return encryData;
}
//数据持久化方法
export function saveStorage(key, obj) {
    console.log('saveStorage 未实现');
    return global.storage.save({ key, data: JSON.stringify(obj) });
}
//持久化数据获取方法
export async function storageload(key) {
    let rtnVal = null;
    await global.storage
        .load({
            key
        })
        .then(ret => {
            rtnVal = ret;
        })
        .catch(err => {
            rtnVal = null;
        });
    console.log('storageload 执行');
    return rtnVal;
}
//持久化数据还原为对象
export async function loadStorage(key) {
    const storageloadst = await storageload(key);
    const storagejson = JSON.parse(storageloadst);
    return storagejson;
}

//websocket
export function getWebsocketToken() {
    return websocketToken.get();
}
export function saveWebsocketToken(_token) {
    websocketToken.set(_token);
    return global.storage.save({ key: 'websocketToken', data: JSON.stringify(_token) });
}
export async function clearWebsocketToken() {
    await global.storage.remove({ key: 'websocketToken' });
    websocketToken.set(null);
}
export async function loadWebsocketToken() {
    // let storagetoken=await global.storage.load({key: KEY_TOKEN}); //await storageload(KEY_TOKEN);
    const storagetoken = await storageload('websocketToken');
    const storagetokenobj = storagetoken ? JSON.parse(storagetoken) : null;
    websocketToken.set(storagetokenobj);
    return websocketToken.get();
}

//切换记录
export function getSwitchToken() {
    return switchToken.get();
}
export function saveSwitchToken(_token) {
    switchToken.set(_token);
    console.log('saveSwitchToken 缺少global.storage');
    return global.storage.save({ key: 'switchToken', data: JSON.stringify(_token) });
}
export async function clearSwitchToken() {
    console.log('clearSwitchToken 缺少global.storage');
    // await global.storage.remove({ key: 'switchToken' });
    switchToken.set(null);
}
export async function loadSwitchToken() {
    const storagetoken = await storageload('switchToken');
    const storagetokenobj = storagetoken ? JSON.parse(storagetoken) : null;
    switchToken.set(storagetokenobj);
    return switchToken.get();
}

//萤石云
export function getYsyToken() {
    return ysToken.get();
}
export function saveYsyToken(_token) {
    console.log('saveYsyToken 缺少global.storage');
    ysToken.set(_token);
    // return global.storage.save({ key: 'ysToken', data: JSON.stringify(_token) });
}
export async function clearYsyToken() {
    console.log('clearYsyToken 缺少global.storage');
    // await global.storage.remove({ key: 'ysToken' });
    ysToken.set(null);
}
export async function loadYsyToken() {
    const storagetoken = await storageload('ysToken');
    const storagetokenobj = storagetoken ? JSON.parse(storagetoken) : null;
    ysToken.set(storagetokenobj);
    return ysToken.get();
}

//用户信息本地存取
export function getToken() {
    return token.get();
}
export function saveToken(_token) {
    console.log('saveToken 缺少global.storage');
    token.set(_token);
    return global.storage.save({ key: KEY_TOKEN, data: JSON.stringify(token) });
}
export async function clearToken() {
    console.log('clearToken 缺少global.storage');
    // await global.storage.remove({ key: KEY_TOKEN });
    token.set(null);
}
export async function loadToken() {
    const storagetoken = await storageload(KEY_TOKEN);
    const storagetokenobj = storagetoken ? JSON.parse(storagetoken) : null;
    token.set(storagetokenobj);
    return token.get();
}
//推送设置本地存取方法
export function getPushSetting() {
    return pushSetting.get();
}
export function savePushSetting(_token) {
    console.log('savePushSetting 缺少global.storage');
    pushSetting.set(_token);
    // return global.storage.save({ key: pushSettingKey, data: JSON.stringify(pushSetting) });
}
export async function loadPushSetting() {
    const storagetoken = await storageload(pushSettingKey);
    const storagetokenobj = storagetoken ? JSON.parse(storagetoken) : null;
    pushSetting.set(storagetokenobj);
    return pushSetting.get();
}
//接口根地址存取方法
export function getRootUrl() {
    return rootUrl.get();
}
export function saveRootUrl(_token) {
    console.log('saveRootUrl 缺少global.storage');
    rootUrl.set(_token);
    return global.storage.save({ key: rootUrlKey, data: JSON.stringify(rootUrl) });
}
export async function clearRootUrl() {
    console.log('clearRootUrl 缺少global.storage');
    // await global.storage.remove({ key: rootUrlKey });
    rootUrl.set(null);
}
export async function loadRootUrl() {
    const storagetoken = await storageload(rootUrlKey);
    const storagetokenobj = storagetoken ? JSON.parse(storagetoken) : null;
    rootUrl.set(storagetokenobj);
    return rootUrl.get();
}
//存取路由信息的方法
export function getRouterConfig() {
    return routerConfig.get();
}
export function saveRouterConfig(_token) {
    console.log('saveRouterConfig 缺少global.storage');
    routerConfig.set(_token);
    return global.storage.save({ key: routerConfigKey, data: JSON.stringify(routerConfig) });
}
export async function loadRouterConfig() {
    const storagetoken = await storageload(routerConfigKey);
    const storagetokenobj = storagetoken ? JSON.parse(storagetoken) : null;
    routerConfig.set(storagetokenobj);
    return rootUrl.get();
}


//EncryptData
export function getEncryptData() {
    return encryptData.get();
}

export function saveEncryptData(_encryptData) {
    console.log('saveEncryptData 缺少global.storage');
    encryptData.set(_encryptData);
    return global.storage.save({ key: 'encryptData', data: _encryptData });
}

export function saveEncryptDataWithData(_encryptData, data) {
    console.log('saveEncryptDataWithData 缺少global.storage');
    encryptData.set(data);
    global.storage.save({ key: 'encryptData', data: _encryptData });
    return encryptData.get();
}

export async function clearEncryptData() {
    console.log('clearEncryptData 缺少global.storage');
    await global.storage.remove({ key: 'encryptData' });
    encryptData.set(null);
}

const PUB_KEY =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxsx1/cEpUmSwUwwPU0SciWcVK\n' +
    'mDORBGwSBjJg8SL2GrCMC1+Rwz81IsBSkhog7O+BiXEOk/5frE8ryZOpOm/3PmdW\n' +
    'imEORkTdS94MilEsk+6Ozd9GnAz6Txyk07yDDwCEmA3DoFY2hfKg5vPoskKA0QBC\n' +
    '894cUqq1aH9h44SwyQIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';
const PRIV_KEY =
    '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICWwIBAAKBgQCxsx1/cEpUmSwUwwPU0SciWcVKmDORBGwSBjJg8SL2GrCMC1+R\n' +
    'wz81IsBSkhog7O+BiXEOk/5frE8ryZOpOm/3PmdWimEORkTdS94MilEsk+6Ozd9G\n' +
    'nAz6Txyk07yDDwCEmA3DoFY2hfKg5vPoskKA0QBC894cUqq1aH9h44SwyQIDAQAB\n' +
    'AoGAEH9Ato9R80MqHr5RGX2WXL/JS2jQZr7qmozFOg9A7+if6cx3gaSG9nOkt7W1\n' +
    'I8fjX1sHajNOmwq36eiDoyMX+EwloEJXmvDJocpObzIGGKcCIkowhdhpcgAE0qmv\n' +
    'FFi2LOK2Z48jcPXmOCHywXQLBs7GGFvWmgAqo8bP9OmdC7UCQQDqSuLEZjgWPS94\n' +
    'BgwzkHD6ZLgaKzOzPH8iXh7EVqReGUXf16owVkuMWLF7hq02fXt7G4kjdztlmfCy\n' +
    '8fZPM02VAkEAwinro2YxG4aGHvtVnizEArHp9YdIW+lBy5vrTgyYG2gpTBMfdore\n' +
    'hElI9eR6vhJMpudx1epcpjmS52cJn7OBZQJAFScvtCW6eJ+Lkp2RKnKnEKRZTtuJ\n' +
    'rmwO2m5+/qEH9Ar6GQyiq/yOk5xKYem1586KgIHq7s3MCg9NAQsBfwMVxQJAKmbN\n' +
    'NtnST5iJIarxf6F3DL+dwCjS/H9sBvL96AWIEjQlEJ/8dv7MqUb3z/sdcvS8GJbi\n' +
    'nTyZDxPzqOUvjNi+oQJAPumO909O6mbqrtDmvz100JMQdILNzc+wynM45hu/Yj5V\n' +
    'qMiC7KMtCE3xaEMd21EzRtusJvGWY3KhLHNCcUx4jg==\n' +
    '-----END RSA PRIVATE KEY-----\n';
export async function loadEncryptData() {
    console.log('loadEncryptData 1');
    const _encryptData = await storageload('encryptData');
    console.log('loadEncryptData 5');
    const encrypt = new JSEncrypt();
    console.log('loadEncryptData 6');
    encrypt.setPublicKey(PUB_KEY);
    encrypt.setPrivateKey(PRIV_KEY);
    console.log('loadEncryptData 3');
    const data = encrypt.decrypt(_encryptData);
    console.log('loadEncryptData 4');
    encryptData.set(data);
    console.log('loadEncryptData 2');
    return encryptData.get();
}
