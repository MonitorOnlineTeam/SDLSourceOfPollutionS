import axios from 'axios';

import { delay, logdebug, SentencedToEmpty, ShowToast } from '../utils';
import { post, get } from '../dvapack/request';
import { NetPost, NetGet, NetLgoin, GetCustomUrl } from '../dvapack/request/axios';
import { UrlInfo } from '../config/globalconst';
import { loadToken } from '../dvapack/storage';
import moment from 'moment';

async function geturl(url, tooken, headers) {
    const user = await loadToken();
    // if (user && user.Ticket != null) {
    // console.log('user = ', user);
    if (user && user.dataAnalyzeTicket != null) {
        //使用Ticket不需要authorcode
        if (headers) {
            url += `?${headers}`;
        }
    } else {
        // console.log('tooken = ', tooken);
        if (!tooken) {
            if (user != null) {
                // url += `?authorCode=${user.User_ID}`;
                url += `?authorCode=${user.UserId}`;
            } else {
                //目前的get请求 需要确保user不为空 暂不处理else
            }
        } else if (tooken !== 'notooken') {
            url += `?authorCode=${tooken}`;
        }
        if (headers) {
            url += headers;
        }
    }

    return url;
}

export const axiosPost = async (api, param, headers) => {
    logdebug(`webapi-->${api}`);
    logdebug('param-->');
    logdebug(param);
    api = await geturl(api, null, headers);
    const result = await NetPost(api, param, headers);

    if (result != undefined) {
        if (result.status == 200) {
            if (result.data.requstresult != '1') {
                ShowToast(result.data.reason);
                result.status = 1000;
            }
        }
    } else {
        result.status = -1;
    }
    logdebug('result-->' + api);
    logdebug(result);
    return result;
};
export const customGet = async (api, param) => {
    const result = await GetCustomUrl(api, param);

    if (result.status == 200) {
        if (result.data.status != '1') {
            result.status = 1000;
        }
    }
    return result;
};
export const axiosGet = async (api, param, headers) => {
    api = await geturl(api, null, headers);
    const result = await NetGet(api, param, headers);
    if (result.status == 200) {
        if (result.data.requstresult != '1') {
            result.status = 1000;
        }
    }
    logdebug('result-->' + api);
    logdebug(result);
    return result;
};

export const axiosAuthPost = async (api, param, urlParam = '', headers) => {
    logdebug(`webapi-->${api}-->${moment().format('HH:mm:ss')}`);
    logdebug('param-->');
    logdebug(param);
    if (urlParam != '') {
        api = await geturl(api, null, urlParam);
    }
    const result = await NetPost(api, param, headers);

    if (result.status == 401) {
        //登录失效跳转登录
        ShowToast('401');
    }
    if (result != undefined) {
        if (result.status == 200) {
            // 禅道 7223
            if (typeof result.data == 'undefined' || !result.data) {
                ShowToast('网络断开');
                result.status = 404;
            } else if (result.data.IsSuccess != true) {
                ShowToast(result.data.Message);
                result.status = 1000;
            }
        }
    } else {
        result.status = -1;
    }
    logdebug('result-->' + api);
    logdebug(result);
    return result;
};

export const axiosAuthGet = async (api, param, headers) => {
    logdebug(`webapi-->${api}-->${moment().format('HH:mm:ss')}`);
    logdebug('param-->');
    logdebug(param);
    console.log('param-->' + param);
    api = await geturl(api, null, headers);
    console.log('api-->' + api);
    const result = await NetGet(api, param, headers);

    if (result.status == 200) {
        if (typeof result.data == 'undefined' || !result.data) {
            ShowToast('网络断开');
            result.status = 404;
        } else if (result.data && result.data.IsSuccess != true) {
            result.status = 1000;
        }
    }
    logdebug('result-->' + api);
    logdebug(result);
    return result;
};
export const axiosAuthLogin = async (api, param) => {
    const result = await NetLgoin(api, param);
    console.log(result);
    if (result.status == 200) {
        if (typeof result.data == 'undefined' || !result.data) {
            ShowToast('网络断开');
            result.status = 404;
        } else if (result.data.IsSuccess != true) {
            ShowToast(SentencedToEmpty(result, ['data', 'Message'], '登录失败'));
            result.status = 1000;
        }
    } else {
    }
    return result;
};
export const axiosLogin = async (api, param) => {
    const result = await NetLgoin(api, param);
    console.log(result);
    if (result.status == 200) {
        if (result.data.requstresult != '1') {
            ShowToast(result.data.reason);
            result.status = 1000;
        }
    }
    return result;
};

export const checkUpdateUrl = async param => {
    const result = await new Promise((resolve, reject) => {
        fetch(UrlInfo.UpdateUrl, { headers: { 'Cache-Control': 'no-cache' } })
            .then(response => {
                console.log('response = ', response);
                if (response.status == 200) {
                    resolve(response.text());
                } else {
                    resolve('{"requstresult":0,"reason":"请求失败"}');
                }
            })
            .catch(error => {
                console.log('error = ', error);
                resolve('{"requstresult":0,"reason":"请求失败"}');
            });
    });
    const resulta = eval('(' + result + ')');
    return resulta;
};

/**
 * 假登录
 */
export const login = async () => {
    await delay(2000);
    return true;
};

//get测试
export const postTest = async param => {
    const body = {
        name: 'aa'
    };
    const result = await post('https://api.chsdl.net' + '/Permission/UserOperation/GetEnterpriseList', body, null);
    return result;
};

//post测试
export const getTset = async param => {
    const body = {};
    const result = await get('http://www.weather.com.cn/data/cityinfo/101010100.html', body, null);
    return result;
};

/**
 * nginx 代理获取配置信息
 */
export const getUrlConfig = async proxyCode => {
    let result = null;
    // const url = `https://cs.chsdl.com:5017/api${proxyCode}/AppConfig.json`;
    const timestamp = Date.now();
    const url = `${UrlInfo.BaseUrl}api${proxyCode}/AppConfig.json?timestamp=${timestamp}`;
    console.log('url = ', url);
    return new Promise((resolve, reject) => {
        // result = axios.get('https://cs.chsdl.com:5017/proxyconfig/AppConfig.json', { headers: { 'Cache-Control': 'no-cache', proxyCode: proxyCode } });
        result = axios.get(url, { headers: { 'Cache-Control': 'no-cache', proxyCode: proxyCode } });
        result
            .then(response => {
                console.log('getUrlConfig response = ', response);
                resolve(response);
            })
            .catch(err => {
                console.log('getUrlConfig err = ', err);
                resolve('{"status":-1,"reason":"请求失败"}');
                ShowToast(`授权码验证失败3:${err}`);
            });
    });
};

/**
 * nginx 代理获取配置信息
 */
export const testRequest = async (url, method, params = {}) => {
    let result = null;
    // const url = `https://cs.chsdl.com:5017/api${proxyCode}/AppConfig.json`;
    // const url = `${UrlInfo.BaseUrl}api${proxyCode}/AppConfig.json`;
    // console.log('url = ', url);
    return new Promise((resolve, reject) => {
        // result = axios.get('https://cs.chsdl.com:5017/proxyconfig/AppConfig.json', { headers: { 'Cache-Control': 'no-cache', proxyCode: proxyCode } });
        if (method == 'get') {
            result = axios.get(url
                , {
                    headers: {
                        'Cache-Control': 'no-cache'
                        // , proxyCode: proxyCode
                    }
                });
        } else if (method == 'post') {
            result = axios.post(url
                , {
                    data: params,
                    headers: {
                        'Cache-Control': 'no-cache',
                        // proxyCode: proxyCode
                    }
                });
        } else {
            ShowToast('method error');
        }
        result
            .then(response => {
                console.log('getUrlConfig response = ', response);
                resolve(response);
            })
            .catch(err => {
                console.log('getUrlConfig err = ', err);
                // resolve('{"status":-1,"reason":"请求失败"}');
                resolve(err);
                ShowToast(`授权码验证失败3:${err}`);
            });
    });
};
