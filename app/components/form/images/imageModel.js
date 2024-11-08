import moment from 'moment';
import { Alert, AsyncStorage } from 'react-native';
import {
  EncodeUtf8,
  createAction,
  NavigationActions,
  Storage,
  StackActions,
  ShowToast,
  SentencedToEmpty,
  createImageUrl,
  delay,
  CloseToast,
} from '../../../utils';
import * as authService from '../../../services/auth';
import { Model } from '../../../dvapack';
import {
  loadToken,
  saveRouterConfig,
  getToken,
  getEncryptData,
} from '../../../dvapack/storage';
import api from '../../../config/globalapi';
import { UrlInfo } from '../../../config/globalconst';
import axios from 'axios';

export default Model.extend({
  namespace: 'imageModel',
  state: {
    status: 200,
    images: [],
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    //反馈上传图片
    *uploadimage({ payload: { image, images = [], callback, uuid } }, { call }) {
      let encryData = getEncryptData();
      const user = yield loadToken();
      let formdata = new FormData();
      let imageArray = [];
      let _file = {};
      if (images.length == 0) {
        // 单张
        _file = {
          uri: image.uri,
          type: 'multipart/form-data',
          name: 'image.jpg',
        };
        formdata.append('file', _file);
      } else if (images.length == 1) {
        // 单张
        _file = {
          uri: images[0].uri,
          type: 'multipart/form-data',
          name: 'image.jpg',
        };
        formdata.append('file', _file);
      } else {
        // 多张
        images.map((imageItem, index) => {
          _file[index] = {
            // uri: imageItem.uri,
            uri: imageItem.uri,
            type: 'multipart/form-data',
            name: `image${index}.jpg`,
          };
          formdata.append(`file`, _file[index]);
        });
      }
      formdata.append('FileActualType', '2');
      formdata.append('FileUuid', uuid);
      // formdata.append('type', '2');
      // console.log('formdata = ', formdata);
      // Alert.alert('上传中', JSON.stringify(formdata));

      // // 使用axios发送请求
      // axios.post(UrlInfo.BaseUrl + api.pollutionApi.Alarm.uploadimage
      //   , formdata
      //   , {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //       authorization: 'Bearer ' + user.dataAnalyzeTicket,
      //       ProxyCode: encryData,
      //       Accept: 'application/json, text/plain, */*',
      //       'Content-Type': 'multipart/form-data',
      //     }
      //   })
      //   .then(response => {
      //     console.log(response);
      //     callback('', true);
      //     Alert.alert('上传成功', JSON.stringify(response));
      //   })
      //   .catch(error => {
      //     console.error(error);
      //     callback('', false);
      //     Alert.alert('失败', '123');
      //   });
      // Alert.alert('结束', '123');
      fetch(UrlInfo.BaseUrl + api.pollutionApi.Alarm.uploadimage, {
        method: 'POST',
        bodyType: 'file', //后端接收的类型
        body: formdata,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          authorization: 'Bearer ' + user.dataAnalyzeTicket,
          ProxyCode: encryData,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(res => {
          if (res.StatusCode == 200) {
            //     console.log('typeof = ', typeof res);
            //     const response = res.json();
            console.log('res = ', res);
            //     debugger;
            //     // let urls = JSON.parse(res._bodyInit).Datas;
            // let urls = SentencedToEmpty(response, ['_j', 'Datas'], []);
            //     let url = '';
            //     for (let index = 0; index < urls.length; index++) {
            //       url = SentencedToEmpty(urls, [index], '');
            //       if (url != '') {
            //         let attachIDArr = urls[index].split('/');
            //         images[index].attachID = attachIDArr[attachIDArr.length - 1];
            //         images[index].url = url;
            //       }
            //     }
            //     console.log('images = ', images);
            //     callback(images, true);
            //   } else {
            //     callback(res._bodyInit, false);

            let images = res.Datas.map(item => {
              return { attachID: item.split('/').pop(), url: item };
            });
            callback(images, true);
          } else {
            console.log('not 200 res = ', res);
            callback(res, false);
          }
        })
        .catch(error => {
          // console.log('error = ', error);
          const msg = JSON.stringify(error)
          callback(msg, false);
          // Alert.alert("title", msg);
          // Alert.alert("title", error);
          // callback('', false);
        });
    },
    //反馈上传图片-服务端加水印
    *uploadimageWaterMask(
      { payload: { image, images = [], callback, uuid, imageParams = {} } },
      { call },
    ) {
      let encryData = getEncryptData();

      const user = yield loadToken();
      let formdata = new FormData();
      if (images.length == 0) {
        // 单张
        var file = {
          uri: image.uri,
          type: 'multipart/form-data',
          name: 'image.jpg',
        };
        formdata.append('file', file);
      } else {
        // 多张
        var file = {};
        images.map((imageItem, index) => {
          file[index] = {
            uri: imageItem.uri,
            type: 'multipart/form-data',
            name: `image${index}.jpg`,
          };
          formdata.append(`file`, file[index]);
        });
      }

      formdata.append('FileActualType', '2');
      formdata.append('FileUuid', uuid);
      formdata.append('EntName', imageParams.EntName);
      formdata.append('PointName', imageParams.PointName);
      formdata.append('RegionName', imageParams.RegionName);
      formdata.append('str_lat', imageParams.str_lat);
      formdata.append('str_long', imageParams.str_long);

      console.log('formdata = ', formdata);
      // http://172.16.12.39:49003
      fetch(UrlInfo.BaseUrl + api.pollutionApi.Alarm.PostFilesAddWater, {
        // fetch('http://172.16.12.39:49003/' + api.pollutionApi.Alarm.PostFilesAddWater, {
        // fetch('http://61.50.135.114:49003/' + api.pollutionApi.Alarm.PostFilesAddWater, {
        method: 'POST',
        bodyType: 'file', //后端接收的类型
        body: formdata,
        headers: {
          authorization: 'Bearer ' + user.dataAnalyzeTicket,
          ProxyCode: encryData,
          Accept: 'application/json, text/plain, */*',
        },
      })
        .then(response => response.json())
        .then(res => {
          console.log('res = ', res);
          console.log('res.status == 200 = ', res.status == 200);
          if (res.StatusCode == 200 && res.IsSuccess) {
            // const response = res.json();
            // // let attachIDArr = SentencedToEmpty(JSON.parse(res._bodyInit), ['Datas'], '').split(',');
            // let attachIDArr = SentencedToEmpty(
            //   response,
            //   ['_j', 'Datas'],
            //   '',
            // ).split(',');
            // let imageName = '';
            // nameArray = [];
            // for (let index = 0; index < images.length; index++) {
            //   imageName = attachIDArr[index];
            //   if (imageName.indexOf('/') != -1) {
            //     nameArray = attachIDArr[index].split('/');
            //     imageName = nameArray[nameArray.length - 1];
            //   }
            //   images[index].attachID = imageName;
            // }
            let imageName = res.Datas.split('/').pop()
            callback([{ ...file, attachID: imageName }], true);
          } else {
            callback(res, false);
          }
        })
        .catch(error => {
          callback(error, false);
        });
    },
    //上传文件
    * uploadFile({ payload: { file, callback, uuid } }, { call }) {
      console.log('uploadFile');
      if (file && file.size > 10000000) {
        callback('文件过大，上传失败', false);
        return;
      }
      let encryData = getEncryptData();

      const user = yield loadToken();
      // var upfile = { uri: 'file://' + file.uri, type: 'multipart/form-data', name: EncodeUtf8(file.name) };
      var upfile = {
        uri: 'file://' + file.uri,
        type: 'multipart/form-data',
        name: EncodeUtf8(file.name),
        // name: '123.xlsx',
      };
      let formdata = new FormData();
      formdata.append('file', upfile);
      formdata.append('FileUuid', uuid);
      formdata.append('FileTypes', '2');
      formdata.append('FileActualType', '2');
      console.log('formdata = ', formdata);
      // fetch(UrlInfo.BaseUrl + api.pollutionApi.Alarm.PostFilesAddWater, {
      console.log('before fetch');
      // fetch(UrlInfo.BaseUrl + api.pollutionApi.Alarm.uploadimage, {

      fetch(UrlInfo.BaseUrl + api.pollutionApi.Alarm.UploadFiles, {
        method: 'POST',
        bodyType: 'file', //后端接收的类型
        body: formdata,
        headers: {
          authorization: 'Bearer ' + user.dataAnalyzeTicket,
          ProxyCode: encryData,
          Accept: 'application/json, text/plain, */*',
        },
      })
        .then(response => response.json())
        .then(res => {
          console.log('res = ', res);
          if (res.StatusCode == 200 && res.IsSuccess) {
            file.AttachID = res.Datas.fNameList[0];
            callback(file, true);
          } else {
            callback('上传失败', false);
          }
          // if (res._bodyText && res._bodyText != '') {
          //   let obj = JSON.parse(res._bodyText);
          //   if (obj.IsSuccess) {
          //     file.AttachID = obj.Datas.fNameList[0];
          //     callback(file, true);
          //   } else {
          //     callback(
          //       '上传失败:' + SentencedToEmpty(obj, ['Message'], '无错误信息'),
          //       false,
          //     );
          //   }
          // } else {
          //   callback('1上传失败', false);
          // }
        })
        .catch(error => {
          callback('上传失败' + error, false);
        });
    },
    //删除反馈图片
    * DelPhotoRelation({ payload: { params } }, { update, take, call, put }) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pollutionApi.Alarm.delPhoto,
        {
          Guid: params.code,
          noCancelFlag: true,
        },
      );
      CloseToast();
      if (result.data && result.data != null && result.data.IsSuccess == true) {
        ShowToast(result.data.Message);
        params.callback();
      } else {
        ShowToast('删除失败');
      }
    },
  },

  subscriptions: {},
});
