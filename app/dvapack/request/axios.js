import { DeviceEventEmitter, Platform, AsyncStorage, NativeModules } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { UrlInfo } from '../../config/globalconst';
import { loadToken, getToken, getRootUrl, getEncryptData, getPhoneUDID } from '../storage';
import { ShowToast, NavigationActions, Storage, StackActions, SentencedToEmpty } from '../../utils';

let axiosSource = axios.CancelToken.source();
let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = config => {
    for (let p in pending) {
        if (pending[p].u === config.url + '&' + config.method) {
            //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //把这条记录从数组中移除
        }
    }
};

// js创建含数字字母的随机字符串
let generateRdStr = () => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 10; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

const timeout = 18000;

export const instance = axios.create({
    baseURL: UrlInfo.BaseUrl,
    // baseURL: 'http://172.16.12.39:49003/',
    timeout: timeout,
    headers: { 'X-Custom-Header': 'foobar' },
    responseType: 'json'
});
instance.defaults.withCredentials = false;

//请求拦截处理
instance.interceptors.request.use(
    function (config) {
        if (__DEV__) {
            console.log(config);
            console.log(`interceptors.request:${config.url}-->${moment().format('mm:ss')}`);
        }
        // 在发送请求之前做些什么
        removePending(config); //在一个ajax发送前执行一下取消操作
        let randomStr = generateRdStr();
        if (config.data && config.data.noCancelFlag == true) {
            config.cancelToken = new cancelToken(c => {
                // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
                pending.push({ u: config.url + '&' + config.method + randomStr, f: c });
            });
        } else {
            config.cancelToken = new cancelToken(c => {
                // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
                pending.push({ u: config.url + '&' + config.method, f: c });
            });
        }
        // config.cancelToken = new cancelToken(c => {
        //     // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
        //     pending.push({ u: config.url + '&' + config.method + randomStr, f: c });
        // });

        return config;
    },
    function (error) {
        if (error && error.__CANCEL__ == true) {
            //拦截的加了个标识
            error.mCancel = 'request';
        }
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

//返回拦截处理
instance.interceptors.response.use(
    function (response) {
        // console.log(`interceptors.response:${response.config.url}-->${moment().format('mm:ss')}`);
        // 对响应数据做点什么
        removePending(response.config); //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
        return response;
    },
    function (error) {
        if (error && error.__CANCEL__ == true) {
            //拦截的加了个标识
            error.mCancel = 'response';
        }
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
async function geturl(url, tooken, headers) {
    const user = getToken();

    if (!tooken) {
        if (user != null) {
            url += `?authorCode=${user.User_ID}`;
        }
    } else if (tooken !== 'notooken') {
        url += `?authorCode=${tooken}`;
    }

    if (headers) {
        url += headers;
    }
    return url;
}

export const NetPost = async (api, params, headers, baseURL) => {
    // console.log(`${moment().format('HH:mm:ss')}-->${api}`);
    const beginTime = new Date().getTime();
    let result = null;
    let encryData = getEncryptData();
    // let PHONEUDID = await getPhoneUDID();
    const user = getToken();
    instance.defaults.retryDelay = timeout; // 设置超时时间
    if (typeof headers != 'undefined' && typeof headers != "string" && headers) {
        Object.keys(headers).map((item, index) => {
            axios.defaults.headers.post[item] = headers[item];
        });
    } else {
        instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    }
    if (typeof user != 'undefined' && user && user.Ticket && user.Ticket != undefined && user.Ticket != null && user.Ticket.length > 0) {
        // 自研代理header
        // instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData + '$' + user.Ticket;
        // nginx代理header
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + user.Ticket;
        instance.defaults.headers.common['ProxyCode'] = encryData;
    } else {
        // 自研代理header
        // instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData;
        // nginx代理header
        instance.defaults.headers.common['ProxyCode'] = encryData;
    }
    instance.defaults.headers.common['Accept'] = 'application/json, text/plain, */*';
    instance.defaults.headers.common['Content-Type'] = "application/json";
    // instance.defaults.headers.common['PHONEUDID'] = PHONEUDID;
    /** 污染源以及污染源运维通过权限码 获取服务器的IP地址 这个URL是写死的 */
    if ('rest/PollutantSourceApi/LoginApi/ValidateAuthorCode' == api) {
        instance.defaults.baseURL = UrlInfo.enterpriseInformationUrlPrefix;
    }
    if ('rest/PollutantSourceOAuth/connect/token' != api) {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + SentencedToEmpty(user, ['dataAnalyzeTicket'], '');
    } else {
        instance.defaults.headers.common['Content-Type'] = "application/x-www-form-urlencoded";
    }

    return new Promise((resolve, reject) => {
        // const requestTime = moment().format('YYYY-MM-DD HH:mm:ss')

        const requestTime = new Date().getTime();
        if (baseURL) result = instance.post(api, params, { baseURL, timeout: timeout, cancelToken: axiosSource.token });
        else result = instance.post(api, params, { timeout: timeout, cancelToken: axiosSource.token });

        result
            .then(res => {
                const endTime = new Date().getTime();
                res.castTime = endTime - beginTime;
                res.requestTime = requestTime;
                resolve(res);
            })
            .catch(error => {
                if (error && error.mCancel) {
                    console.log('拦截请求->', api);
                    return;
                }
                if (error.response == undefined) {
                    //移动端自己判断的404
                    error.response = { status: 404, api, clientReson: 'error.response == undefined' };
                } else {
                    if (error.response.status != 404 && error.response.status != 401) {
                        //接口返回的404 登录token失效为401
                        error.response.status = 1000;
                    }
                }

                if (error.response.status == 404) {
                    // ShowToast('网络异常');
                } else if (error.response.status == 1000) {
                    ShowToast(SentencedToEmpty(error, ['response', 'data', 'Message'], '服务器异常'));
                } else if (error.response.status == 401) {
                    ShowToast('登录失效，请重新登录');
                    DeviceEventEmitter.emit('net401', 'true');
                    error.response.status = 1000;
                }

                error.data = [];
                error.response.requestTime = requestTime;
                resolve(error.response);
            });
    });
};
export const NetLgoin = async (api, params, headers, baseURL) => {
    const beginTime = new Date().getTime();
    let result = null;
    // api = await geturl(api, 'a270dab1-3d79-47ee-976e-85bf32ef200b',headers);
    let encryData = getEncryptData();
    // let PHONEUDID = await getPhoneUDID();
    // 自研代理header
    // instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData;
    // nginx代理header
    instance.defaults.headers.common['ProxyCode'] = encryData;
    instance.defaults.headers.common['Accept'] = 'application/json, text/plain, */*';
    instance.defaults.headers.common['Content-Type'] = "application/json";
    /**
     * 
     */
    delete instance.defaults.headers.common.Authorization;
    // instance.defaults.headers.common['PHONEUDID'] = PHONEUDID;
    return new Promise((resolve, reject) => {
        // const requestTime = moment().format('YYYY-MM-DD HH:mm:ss')
        const requestTime = new Date().getTime();
        console.log('Promise params = ', params);
        if (baseURL) result = instance.post(api, params, { baseURL, timeout: timeout, cancelToken: axiosSource.token });
        else result = instance.post(api, params, { timeout: timeout, cancelToken: axiosSource.token });
        // if (Platform.OS == 'android') {
        //     setTimeout(() => {
        //         //判断
        //         if (!result._55) {
        //             //取消请求
        //             const endTime = new Date().getTime();
        //             const endTimeStr = moment().format('YYYY-MM-DD HH:mm:ss');
        //             axiosSource.cancel('取消请求');
        //             resolve({ status: 404 , api, clientReson: 'setTimeout ',requestTime,endTimeStr });
        //             ShowToast('网络异常');
        //         }
        //     }, timeout);
        // }
        result
            .then(res => {
                const endTime = new Date().getTime();
                res.castTime = endTime - beginTime;
                res.requestTime = requestTime;
                resolve(res);
            })
            .catch(error => {
                console.log(error);
                if (error && error.mCancel) {
                    console.log('拦截请求->', api);
                    return;
                }
                // 对响应错误做点什么
                if (error.message == undefined) {
                    error.response.status = 1000;
                    // return error;
                }

                if (error.response == undefined) {
                    error.response = { status: 404, api, clientReson: 'error.response == undefined ' };
                } else {
                    if (error.response.status != 404 && error.response.status != 500) {
                        error.response.status = 1000;
                    }
                }

                if (error.response.status == 404) {
                    ShowToast('网络异常');
                } else if (error.response.status == 1000) {
                    ShowToast('服务器异常');
                }

                error.data = [];
                error.response.requestTime = requestTime;
                resolve(error.response);
                // reject(error)
            });
    });
};
export const NetGet = async (api, params) => {
    const beginTime = new Date().getTime();
    let result = null;
    let encryData = getEncryptData();
    // let PHONEUDID = await getPhoneUDID();
    const user = getToken();
    if (typeof user != 'undefined' && user && user.Ticket && user.Ticket != undefined && user.Ticket != null && user.Ticket.length > 0) {
        // 自研代理header
        // instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData + '$' + user.Ticket;
        // nginx代理header
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + user.Ticket;
        instance.defaults.headers.common['ProxyCode'] = encryData;
    } else {
        // 自研代理header
        // instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData;
        // nginx代理header
        instance.defaults.headers.common['ProxyCode'] = encryData;
    }
    instance.defaults.headers.common['Accept'] = 'application/json, text/plain, */*';
    // instance.defaults.headers.common['Content-Type'] = "application/json";
    // instance.defaults.headers.common['PHONEUDID'] = PHONEUDID;
    // api = await geturl(api, null, headers);
    return new Promise((resolve, reject) => {
        // const requestTime = moment().format('YYYY-MM-DD HH:mm:ss')
        const requestTime = new Date().getTime();
        result = instance.get(api, { params: params }, { timeout: timeout, cancelToken: axiosSource.token });
        // if (Platform.OS == 'android') {
        //     setTimeout(() => {
        //         //判断
        //         if (!result._55) {
        //             const endTime = new Date().getTime();
        //             const endTimeStr = moment().format('YYYY-MM-DD HH:mm:ss');
        //             //取消请求
        //             axiosSource.cancel('取消请求');
        //             resolve({ status: 404 , api, clientReson: 'setTimeout',requestTime,endTimeStr});
        //             ShowToast('网络异常');
        //         }
        //     }, timeout);
        // }
        result
            .then(res => {
                const endTime = new Date().getTime();
                res.castTime = endTime - beginTime;
                res.requestTime = requestTime;
                resolve(res);
                // const nativeRes = {...res};
                // nativeRes.config.data={}
            })
            .catch(error => {
                if (error && error.mCancel) {
                    console.log('拦截请求->', api);
                    return;
                }

                if (error.response == undefined) {
                    //移动端自己判断的404
                    error.response = { status: 404, api, clientReson: 'error.response == undefined' };
                } else {
                    if (error.response.status != 404 && error.response.status != 401 && error.response.status != 500) {
                        //接口返回的404 登录token失效为401
                        error.response.status = 1000;
                    }
                }

                /*
                    应该没有用 暂不处理了
                    // 对响应错误做点什么
                    if (error.message == undefined) {
                        error.response.status = 1000;
                        // return error;
                    }
                */

                if (error.response.status == 404) {
                    ShowToast('网络异常');
                } else if (error.response.status == 1000) {
                    ShowToast('服务器异常');
                } else if (error.response.status == 401) {
                    ShowToast('登录失效，请重新登录');
                    DeviceEventEmitter.emit('net401', 'true');
                    error.response.status = 1000;
                }

                error.data = [];
                error.response.requestTime = requestTime;
                resolve(error.response);
            });
    });
};
function getUserPermissions(api) {
    return instance.get(api);
}
export const GetCustomUrl = async (api, params) => {
    return new Promise((resolve, reject) => {
        axios
            .get(api, {
                params: params
            })
            .then(function (res) {
                resolve(res);
            })
            .catch(function (error) {
                console.log(error); //错误处理 相当于error
            });
    });
};
export const NetConcurrent = async (api, params) => {
    return new Promise((resolve, reject) => {
        //同时发起多个请求时的处理
        axios
            .all([getUserPermissions(api), getUserPermissions(params)])
            .then(
                axios.spread(function (res1, res2) {
                    // 只有两个请求都完成才会成功，否则会被catch捕获
                    resolve(res1, res2);
                })
            )
            .catch(error => {
                reject(error);
            });
    });
};
