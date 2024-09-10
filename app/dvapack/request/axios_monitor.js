import { DeviceEventEmitter, Platform, AsyncStorage, NativeModules } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { UrlInfo } from '../../config/globalconst';
import { loadToken, getRootUrl, getEncryptData, getPhoneUDID } from '../storage';
import { ShowToast, NavigationActions, Storage, StackActions, SentencedToEmpty } from '../../utils';
import RNRequestMonitor from 'react-native-request-monitor';

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
    timeout: timeout,
    headers: { 'X-Custom-Header': 'foobar' },
    responseType: 'json'
});

//请求拦截处理
instance.interceptors.request.use(
    function(config) {
        if (__DEV__) {
            console.log(config);
        }
        // 在发送请求之前做些什么
        removePending(config); //在一个ajax发送前执行一下取消操作
        let randomStr = generateRdStr();
        config.cancelToken = new cancelToken(c => {
            // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
            pending.push({ u: config.url + '&' + config.method + randomStr, f: c });
        });

        return config;
    },
    function(error) {
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
    function(response) {
        // 对响应数据做点什么
        removePending(response.config); //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
        return response;
    },
    function(error) {
        if (error && error.__CANCEL__ == true) {
            //拦截的加了个标识
            error.mCancel = 'response';
        }
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
async function geturl(url, tooken, headers) {
    const user = await loadToken();

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

export const NetPost = async (api, params, headers) => {
    const beginTime = new Date().getTime();
    let result = null;
    let encryData = await getEncryptData();
    let PHONEUDID = await getPhoneUDID();
    const user = await loadToken();
    instance.defaults.retryDelay = timeout; // 设置超时时间
    if (typeof user != 'undefined' && user && user.Ticket && user.Ticket != undefined && user.Ticket != null && user.Ticket.length > 0) {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData + '$' + user.Ticket;
    } else {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData;
    }
    instance.defaults.headers.common['PHONEUDID'] = PHONEUDID;
    /** 污染源以及污染源运维通过权限码 获取服务器的IP地址 这个URL是写死的 */
    if ('rest/PollutantSourceApi/LoginApi/ValidateAuthorCode' == api) {
        instance.defaults.baseURL = UrlInfo.enterpriseInformationUrlPrefix;
    }

    return new Promise((resolve, reject) => {
        const requestTime = moment().format('YYYY-MM-DD HH:mm:ss')
        result = instance.post(api, params, { timeout: timeout, cancelToken: axiosSource.token });

        if (Platform.OS == 'android') {
            setTimeout(() => {
                //判断
                if (!result._55) {
                    //取消请求
                    const endTime = new Date().getTime();
                    axiosSource.cancel('取消请求');
                    resolve({ status: 404 });
                    RNRequestMonitor?.addRecordData({ status: 404, config: { method: 'post', url: UrlInfo.BaseUrl + api, data: params, headers: instance.defaults.headers.common, msg: '超时手动放弃' }, castTime: endTime - beginTime, requestTime: requestTime });
                    ShowToast('网络异常');
                }
            }, timeout);
        }
        result
            .then(res => {
                const endTime = new Date().getTime();
                res.castTime = endTime - beginTime;
                res.requestTime = requestTime;
                resolve(res);
                RNRequestMonitor?.addRecordData(res);
            })
            .catch(error => {
                if (error && error.mCancel) {
                    console.log('拦截请求->', api);
                    return;
                }
                if (error.response == undefined) {
                    //移动端自己判断的404
                    error.response = { status: 404 };
                } else {
                    if (error.response.status != 404 && error.response.status != 401) {
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
                RNRequestMonitor?.addRecordData(error.response);
            });
    });
};
export const NetLgoin = async (api, params, headers) => {
    const beginTime = new Date().getTime();
    let result = null;
    // api = await geturl(api, 'a270dab1-3d79-47ee-976e-85bf32ef200b',headers);
    let encryData = await getEncryptData();
    let PHONEUDID = await getPhoneUDID();
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData;
    instance.defaults.headers.common['PHONEUDID'] = PHONEUDID;
    return new Promise((resolve, reject) => {
        const requestTime = moment().format('YYYY-MM-DD HH:mm:ss')
        result = instance.post(api, params, { timeout: timeout, cancelToken: axiosSource.token });
        if (Platform.OS == 'android') {
            setTimeout(() => {
                //判断
                if (!result._55) {
                    //取消请求
                    const endTime = new Date().getTime();
                    axiosSource.cancel('取消请求');
                    resolve({ status: 404 });
                    RNRequestMonitor?.addRecordData({ status: 404, config: { method: 'post', url: UrlInfo.BaseUrl + api, data: params, headers: instance.defaults.headers.common, msg: '超时手动放弃' }, castTime: endTime - beginTime, requestTime: requestTime });
                    ShowToast('网络异常');
                }
            }, timeout);
        }
        result
            .then(res => {
                const endTime = new Date().getTime();
                res.castTime = endTime - beginTime;
                res.requestTime = requestTime;
                resolve(res);
                RNRequestMonitor?.addRecordData(res);
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
                    error.response = { status: 404 };
                } else {
                    if (error.response.status != 404) {
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
                RNRequestMonitor?.addRecordData(error.response);
                // reject(error)
            });
    });
};
export const NetGet = async (api, params) => {
    const beginTime = new Date().getTime();
    let result = null;
    let encryData = await getEncryptData();
    let PHONEUDID = await getPhoneUDID();
    const user = await loadToken();
    if (typeof user != 'undefined' && user && user.Ticket && user.Ticket != undefined && user.Ticket != null && user.Ticket.length > 0) {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData + '$' + user.Ticket;
    } else {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + encryData;
    }
    instance.defaults.headers.common['PHONEUDID'] = PHONEUDID;
    // api = await geturl(api, null, headers);
    return new Promise((resolve, reject) => {
        const requestTime = moment().format('YYYY-MM-DD HH:mm:ss')
        result = instance.get(api, { params: params }, { timeout: timeout, cancelToken: axiosSource.token });
        if (Platform.OS == 'android') {
            setTimeout(() => {
                //判断
                if (!result._55) {
                    const endTime = new Date().getTime();
                    //取消请求
                    axiosSource.cancel('取消请求');
                    resolve({ status: 404 });
                    RNRequestMonitor?.addRecordData({ status: 404, config: { method: 'get', url: UrlInfo.BaseUrl + api, data: params, headers: instance.defaults.headers.common, msg: '超时手动放弃' }, castTime: endTime - beginTime, requestTime: requestTime });
                    ShowToast('网络异常');
                }
            }, timeout);
        }
        result
            .then(res => {
                const endTime = new Date().getTime();
                res.castTime = endTime - beginTime;
                res.requestTime = requestTime;
                resolve(res);
                const nativeRes = {...res};
                nativeRes.config.data={}
                RNRequestMonitor?.addRecordData(nativeRes);
            })
            .catch(error => {
                if (error && error.mCancel) {
                    console.log('拦截请求->', api);
                    return;
                }

                if (error.response == undefined) {
                    //移动端自己判断的404
                    error.response = { status: 404 };
                } else {
                    if (error.response.status != 404 && error.response.status != 401) {
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
                RNRequestMonitor?.addRecordData(error.response);
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
            .then(function(res) {
                resolve(res);
            })
            .catch(function(error) {
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
                axios.spread(function(res1, res2) {
                    // 只有两个请求都完成才会成功，否则会被catch捕获
                    resolve(res1, res2);
                })
            )
            .catch(error => {
                reject(error);
            });
    });
};
