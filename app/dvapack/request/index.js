import URI from 'urijs';
import { getUseNetConfig, loadToken, loadStorage } from '../storage';
import { ShowToast, delay, fast } from '../../utils';
import api from '../../config/globalapi';

import { getRootUrl } from '../storage';

//超时时间
const timeout = 20000;

async function geturl(url, tooken) {
    const user = await loadToken();
    if (!tooken) {
        if (user != null) {
            url += `?authorCode=${user.User_ID}`;
        }
    } else if (tooken !== 'notooken') {
        url += `?authorCode=${tooken}`;
    }
    return url;
}

const fetchtimeout = (requestPromise, timeout = 30000) => {
    let timeoutAction = null;
    const timerPromise = new Promise((resolve, reject) => {
        timeoutAction = () => {
            reject('请求超时');
        };
    });
    setTimeout(() => {
        timeoutAction();
    }, timeout);
    return Promise.race([requestPromise, timerPromise]);
};

async function request(url, tooken, _options, time = 5000) {
    //部分接口访问特定服务器
    // if (url == api.system.GetEnterpriseByAuth
    // ||url == api.system.OperationIsLogins
    // ||url == api.system.GetEnterpriseByUser
    // ||url.split('?')[0] == api.system.GetEnterpriseList ) {
    //   neturl = enterpriseInformationUrlPrefix;
    // } else {
    //   //获取正常接口的根地址
    //   neturl = getRootUrl().urlPrefix;
    // }
    // //部分接口设置特定用户token 或者清空token
    // if (url.split('?')[0] != api.system.GetEnterpriseList) {
    //   url = await geturl(url, tooken);
    // }
    // let uri = new URI(neturl + url);
    let uri = new URI(url);
    //部分接口访问特定服务器
    if (url.split('?')[0] == api.acount.CheckUpdateUrl) {
        uri = new URI('https://api.chsdl.cn/NewWry/AppConfig/app_config.json');
    }
    //debug时显示请求地址，方便调试
    if (__DEV__) {
        console.log(uri.toString());
    }
    const options = _options || {};
    options.method = options.method || 'GET';
    options.headers = options.headers || {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    };
    //debug时显示请求参数，方便调试
    if (__DEV__) {
        if (options.body) {
            console.log(options.body);
        }
    }
    //使用race实现访问超时
    return Promise.race([
        fast(time),
        new Promise((resolve, reject) => {
            //用于测试
            fetch(uri.toString(), options)
                .then(responseData => {
                    // console.log(responseData.text().then(
                    // console.log(responseData.json().then(
                    //   (info)=>{console.log(info);}));
                    // ShowToast(responseData.status);
                    if (responseData.status == 200) {
                        resolve(responseData.json());
                    } else {
                        // responseData.toString.then(
                        //     (info)=>{console.log(info);});
                        if (__DEV__) {
                            console.log(responseData.status);
                        }
                        resolve({ requstresult: 0, reason: '服务器请求失败' });
                    }
                })
                .catch(error => {
                    // console.log(error);
                    reject({});
                });
        })
    ]);
}
export function test(url, params) {
    const jsonBody = JSON.stringify(params.body);
    const myFetch = fetch(url, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: jsonBody
    });
    return new Promise((resolve, reject) => {
        fetchtimeout(myFetch, 5000)
            .then(response => response.json())
            .then(responseData => {
                resolve(responseData);
                return true;
            })
            .catch(error => {
                reject(error);
                return false;
            });
    });
}

export async function get(url, params, options, tooken) {
    if (params) {
        const paramsArray = [];
        // encodeURIComponent
        Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
        // url = await geturl(url, tooken);
        if (url.indexOf('?') === -1) {
            if (url.search(/\?/) === -1) {
                url += `?${paramsArray.join('&')}`;
            } else {
                url += `&${paramsArray.join('&')}`;
            }
        } else {
            url += `&${paramsArray.join('&')}`;
        }
    }
    return request(url, tooken, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        ...options
    });
}

export async function post(url, data, options, tooken, time = 5000) {
    return request(
        url,
        tooken,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            ...options
        },
        time
    );
}
//post请求地址后附加参数，暂未使用
export async function posturl(url, params, options, tooken) {
    if (params) {
        const paramsArray = [];
        // encodeURIComponent
        Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
        url = await geturl(url, tooken);
        if (url.indexOf('?') === -1) {
            if (url.search(/\?/) === -1) {
                url += `?${paramsArray.join('&')}`;
            } else {
                url += `&${paramsArray.join('&')}`;
            }
        } else {
            url += `&${paramsArray.join('&')}`;
        }
    }
    return request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    });
}
