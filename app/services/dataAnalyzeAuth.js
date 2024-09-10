import { delay, logdebug, ShowToast, SentencedToEmpty, sleep } from '../utils';
import { post, get } from '../dvapack/request';
import { NetPost, NetGet, NetLgoin, GetCustomUrl } from '../dvapack/request/axios';
import { UrlInfo } from '../config/globalconst';
import { loadToken } from '../dvapack/storage';

async function geturl(url, tooken, headers) {
    const user = await loadToken();
    if (user && user.Ticket != null) {
        //使用Ticket不需要authorcode
        if (headers) {
            url += `?${headers}`;
        }
    } else {
        if (headers) {
            url += headers;
        }
    }

    return url;
}

export const axiosPost = async (api, param, headers) => {
    // logdebug(`webapi-->${api}`);
    // logdebug('param-->');
    // logdebug(param);
    api = await geturl(api, null, headers);
    console.log('api = ', api);
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
    logdebug('================');
    logdebug('result-->');
    logdebug(result);
    // console.log('status = ', result.status);
    // console.log('url = ', result.config.url);
    // console.log('params = ', result.config.data);
    // if (typeof result.beforeRequest != 'undefined') {
    //     console.log('beforeRequest = ', result.beforeRequest);
    // }
    // console.log('castTime = ', result.castTime);
    // console.log('method = POST');
    logdebug('================');
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
    logdebug('================');
    logdebug('result-->');
    logdebug(result);
    // console.log('status = ', result.status);
    // console.log('url = ', result.config.url);
    // console.log('params = ', result.config.data);
    // if (typeof result.beforeRequest != 'undefined') {
    //     console.log('beforeRequest = ', result.beforeRequest);
    // }
    // console.log('castTime = ', result.castTime);
    // console.log('method = GET');
    logdebug('================');
    return result;
};

export const axiosAuthPost = async (api, param, headers) => {
    // logdebug(`webapi-->${api}`);
    // logdebug('param-->');
    // logdebug(param);
    api = await geturl(api, null, headers);
    console.log('api = ', api);
    const result = await NetPost(api, param, headers, UrlInfo.DataAnalyze);
    if (result.status == 401) {
        //登录失效跳转登录
        ShowToast('401');
    }
    if (result != undefined) {
    } else {
        result.status = -1;
    }
    logdebug(`应答结果-->${api}`);
    logdebug(result);
    return result;
};

export const axiosAuthGet = async (api, param, headers) => {
    api = await geturl(api, null, headers);
    const result = await NetGet(api, param, headers);

    if (result.status == 200) {
        if (result.data && result.data.IsSuccess != true) {
            result.status = 1000;
        }
    }
    logdebug(`应答结果-->${api}`);
    logdebug(result);
    return result;
};
export const axiosAuthLogin = async (api, param) => {
    const result = await NetLgoin(api, param, null, UrlInfo.DataAnalyze);
    logdebug(`应答结果-->${api}`);
    logdebug(result);
    if (result.status == 200) {
        if (result.data.IsSuccess != true) {
            ShowToast(SentencedToEmpty(result, ['data', 'Message'], ''));
            result.status = 1000;
        }
    }
    // console.log('================');
    // console.log('status = ', result.status);
    // console.log('url = ', result.config.url);
    // console.log('params = ', result.config.data);
    // if (typeof result.beforeRequest != 'undefined') {
    //     console.log('beforeRequest = ', result.beforeRequest);
    // }
    // console.log('castTime = ', result.castTime);
    // console.log('method = POST');
    // console.log('================');
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
        fetch(UrlInfo.UpdateUrl, { headers: { 'Cache-Control': 'no-cache' } }).then(response => {
            if (response.status == 200) {
                resolve(response.text());
            } else {
                resolve('{"requstresult":0,"reason":"请求失败"}');
            }
        });
    });
    const resulta = eval('(' + result + ')');
    return resulta;
};

/**
 * nginx 代理获取配置信息
 */
export const getUrlConfig = async proxyCode => {
    let result = null;
    return new Promise((resolve, reject) => {
        // result = axios.get("http://61.50.135.114:50221/proxyconfig/AppConfig.json", { headers: { 'Cache-Control': 'no-cache', "proxyCode": proxyCode } });
        // result.then(response => {
        //     console.log('getUrlConfig response = ', response);
        //     resolve(response);
        // }).catch(err => {
        //     resolve('{"status":-1,"reason":"请求失败"}');
        // });
        fetch('https://cs.chsdl.com:5017/proxyconfig/AppConfig.json', { headers: { 'Cache-Control': 'no-cache', proxyCode: proxyCode } })
            .then(response => {
                console.log('getUrlConfig response = ', response);
                resolve(response);
            })
            .catch(err => {
                console.log('Request Failed', err);
                resolve('{"status":-1,"reason":"请求失败"}');
            });
    });
    // return result;
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
