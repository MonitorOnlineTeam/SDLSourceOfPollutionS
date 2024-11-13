/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2023-11-01 16:56:11
 * @LastEditTime: 2024-11-11 17:24:30
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/AnalysisModelModification/RectificationReviewExecution.js
 */
import {
  Text,
  View,
  Platform,
  TextInput,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { Component } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SyanImagePicker from 'react-native-syan-image-picker';
import {
  NavigationActions,
  CloseToast,
  SentencedToEmpty,
  ShowLoadingToast,
  ShowToast,
  createAction,
  createNavigationOptions,
} from '../../utils';
import {
  AlertDialog,
  OperationAlertDialog,
  SDLText,
  SelectButton,
  SimpleLoadingComponent,
  StatusPage,
} from '../../components';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../config/globalsize';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IMAGE_DEBUG, ImageUrlPrefix, UrlInfo } from '../../config';
import globalcolor from '../../config/globalcolor';
import { connect } from 'react-redux';
import { getEncryptData } from '../../dvapack/storage';
const options = {
  mediaType: 'photo',
  quality: 0.7,
  selectionLimit: 1,
  includeBase64: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

@connect(({ modelAnalysisAectificationModel }) => ({
  recheckItemId: modelAnalysisAectificationModel.recheckItemId,
  checkedRectificationResult:
    modelAnalysisAectificationModel.checkedRectificationResult,
}))
export default class RectificationReviewExecution extends Component {
  static defaultProps = {
    editCommitEnable: true,
    approvalStatus: '',
  };

  constructor(props) {
    super(props);
    that = this;
    this.alarmObj = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params'],
      {},
    );
    this.state = {
      loading: false,
      encryData: '',
      dataArray: [
        {
          title: '通过',
          id: '1',
        },
        {
          title: '驳回',
          id: '2',
        },
      ],
      imagelist: [],
      imgUrls: [],
      selectUntruthReason: '',
      modalVisible: false,

      TimeS: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'AttachmentId'],
        `yczgfh_${new Date().getTime()}`,
      ),
      approvalRemarks: '',
      approvalStatus: '', // 复核状态 1 通过 2 驳回
    };

    props.navigation.setOptions({
      title: '整改复核',
    });
  }

  renderPickedImage = () => {
    const ProxyCode = getEncryptData();
    const rtnVal = [];
    this.state.imagelist.map((item, key) => {
      const nameArray = item.url.split('/');
      // const source = item.attachID != '' ? { uri: `${UrlInfo.DataAnalyze}/${item.url}` } : require('../../images/addpic.png');
      const source =
        item.attachID != ''
          ? {
            uri: IMAGE_DEBUG
              ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
              : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]
              }`,
          }
          : require('../../images/addpic.png');
      rtnVal.push(
        <View
          key={item.attachID}
          style={{ width: SCREEN_WIDTH / 4 - 5, height: SCREEN_WIDTH / 4 - 5 }}>
          <Image
            resizeMethod={'resize'}
            source={source}
            style={{
              width: SCREEN_WIDTH / 4 - 25,
              height: SCREEN_WIDTH / 4 - 25,
              marginLeft: 10,
              marginTop: 10,
              marginBottom: 5,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              this.setState({ modalVisible: true, index: key });
            }}
            style={[{ position: 'absolute', bottom: 0, left: 0 }]}>
            <View
              style={[
                { height: SCREEN_WIDTH / 4 - 10, width: SCREEN_WIDTH / 4 - 15 },
              ]}
            />
          </TouchableOpacity>
          {this.props.editCommitEnable == true ? (
            <TouchableOpacity
              onPress={() => {
                this.props.dispatch(
                  createAction('alarmAnaly/DelPhotoRelation')({
                    params: {
                      code: item.attachID,
                      callback: () => {
                        const removeIndex = this.state.imagelist.findIndex(
                          (value, index, arr) =>
                            value.attachID === item.attachID,
                        );
                        this.setState(state => {
                          const imagelist = state.imagelist;
                          let imgUrls = state.imgUrls;
                          let newImagelist = [].concat(imagelist);
                          let newImgUrls = [].concat(imgUrls);
                          newImagelist.splice(removeIndex, 1);
                          newImgUrls.splice(removeIndex, 1);
                          const refresh = !state.refresh;
                          return {
                            imagelist: newImagelist,
                            refresh,
                            imgUrls: newImgUrls,
                          };
                        });
                      },
                    },
                  }),
                );
              }}
              style={[{ position: 'absolute', top: 2, right: 2 }]}>
              <Image
                source={require('../../images/ic_close_blue.png')}
                style={{ width: 16, height: 16 }}
              />
            </TouchableOpacity>
          ) : null}
        </View>,
      );
    });
    return rtnVal;
  };

  uploadImageCallBack = (img, isSuccess) => {
    if (isSuccess) {
      const ProxyCode = getEncryptData();
      this.setState(state => {
        // copy the map rather than modifying state.
        const imagelist = state.imagelist;
        const refresh = !state.refresh;
        let imgUrls = state.imgUrls;
        let newImagelist = imagelist.concat(img);
        let newImgUrls = [].concat(imgUrls);
        img.map((item, index) => {
          const nameArray = item.url.split('/');
          newImgUrls.push({
            // url: `${UrlInfo.DataAnalyze}/${item.url}`
            url: IMAGE_DEBUG
              ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
              : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]
              }`,
          });
        });

        return { imagelist: newImagelist, refresh, imgUrls: newImgUrls };
      });
      CloseToast('上传成功');
    } else {
      CloseToast();
      ShowToast('上传失败！');
    }
  };

  cancelButton = () => { };
  confirm = () => {
    this.props.dispatch(
      createAction('modelAnalysisAectificationModel/checkedRectification')({
        params: {
          id: this.props.recheckItemId,
          // id: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'ID'], ''),
          approvalRemarks: this.state.approvalRemarks,
          approvalDocs: this.state.TimeS,
          approvalStatus: this.state.approvalStatus,
        },
        callback: result => {
          this.props.dispatch(
            createAction('modelAnalysisAectificationModel/updateState')({
              checkedRectificationResult: result,
            }),
          );
          this.props.dispatch(
            createAction('modelAnalysisAectificationModel/updateState')({
              checkedRectificationListGResult: { status: -1 },
            }),
          );
          this.props.dispatch(NavigationActions.back());
          this.props.dispatch(NavigationActions.back());
          this.props.dispatch(
            createAction(
              'modelAnalysisAectificationModel/getCheckedRectificationList',
            )({}),
          );
          return true;
        },
      }),
    );
  };

  render() {
    console.log('this.props = ', this.props);
    let alertOptions = {
      headTitle: '提示',
      messText: '是否确定要提交此复核记录吗？',
      headStyle: {
        backgroundColor: globalcolor.headerBackgroundColor,
        color: '#ffffff',
        fontSize: 18,
      },
      buttons: [
        {
          txt: '取消',
          btnStyle: { backgroundColor: 'transparent' },
          txtStyle: { color: globalcolor.headerBackgroundColor },
          onpress: this.cancelButton,
        },
        {
          txt: '确定',
          btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
          txtStyle: { color: '#ffffff' },
          onpress: this.confirm,
        },
      ],
    };
    // const { approvalStatus } = this.props;
    const dialogOptions = {
      headTitle: '选择照片',
      messText: null,
      innersHeight: 100,
      headStyle: {
        color: '#333',
        fontSize: 18,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        fontWeight: 'bold',
      },
      buttons: [
        {
          txt: '打开相机',
          btnStyle: { backgroundColor: '#fff' },
          txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
          onpress: () => {
            launchCamera(options, response => {
              const { assets = [] } = response;
              let imageObj = null;
              if (assets.length <= 0) {
                return;
              } else {
                imageObj = assets[0];
                ShowLoadingToast('正在上传图片');
                that.props.dispatch(
                  // createAction('alarmAnaly/uploadimage')({
                  createAction('imageModel/uploadimage')({
                    image: imageObj,
                    images: assets,
                    uuid: this.state.TimeS,
                    callback: this.uploadImageCallBack,
                  }),
                );
              }
            });
          },
        },
        {
          txt: '选择照片',
          btnStyle: { backgroundColor: '#fff' },
          txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
          onpress: () => {
            launchImageLibrary(options, response => {
              console.log('response = ', response);
              const { assets = [] } = response;
              let imageObj = null;
              if (assets.length <= 0) {
                return;
              } else {
                imageObj = assets[0];
                ShowLoadingToast('正在上传图片');
                that.props.dispatch(
                  // createAction('alarmAnaly/uploadimage')({
                  createAction('imageModel/uploadimage')({
                    image: imageObj,
                    images: assets,
                    uuid: this.state.TimeS,
                    callback: this.uploadImageCallBack,
                  }),
                );
              }
            });
          },
        },
      ],
    };
    return (
      <StatusPage
        status={200}
        //页面是否有回调按钮，如果不传，没有按钮，
        emptyBtnText={'重新请求'}
        errorBtnText={'点击重试'}
        onEmptyPress={() => {
          //空页面按钮回调
          console.log('重新刷新');
          // this.statusPageOnRefresh();
        }}
        onErrorPress={() => {
          //错误页面按钮回调
          console.log('错误操作回调');
          // this.statusPageOnRefresh();
        }}>
        <ScrollView style={[{ flex: 1, paddingTop: 13 }]}>
          <View
            style={{
              flexDirection: 'row',
              width: SCREEN_WIDTH,
              height: 50,
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: 13,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <SDLText style={{ color: 'red' }}>*</SDLText>
              <SDLText style={{}}>复核结果</SDLText>
            </View>
            <SelectButton
              editable={this.props.editCommitEnable}
              style={{ flexDirection: 'row', width: 200 }} //整个组件的样式----这样可以垂直和水平
              conTainStyle={{ height: 44, width: 80 }} //图片和文字的容器样式
              imageStyle={{ width: 18, height: 18 }} //图片样式
              textStyle={{ color: '#666' }} //文字样式
              selectIndex={this.state.approvalStatus} //空字符串,表示不选中,数组索引表示默认选中
              data={this.state.dataArray} //数据源
              onPress={(index, item) => {
                // 复核状态 1 通过 2 驳回
                this.setState({
                  approvalStatus: item.id,
                });
                // let newObj = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { approvalStatus: null, approvalRemarks: null, FileList: [] });
                // newObj.approvalStatus = item.id;
                // //动态更新组件内state 记录输入内容
                // this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmVerifyDetail: { ...this.props.alarmVerifyDetail, data: { Datas: newObj } } }));
              }}
            />
            {this.props.editCommitEnable == false ? (
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}></View>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'column',
              width: SCREEN_WIDTH,
              marginTop: 1,
              backgroundColor: '#ffffff',
              padding: 13,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SDLText style={{ color: 'red' }}>*</SDLText>
              <SDLText style={{}}>复核意见</SDLText>
            </View>
            <TextInput
              editable={this.props.editCommitEnable}
              autoCapitalize={'none'}
              autoCorrect={false}
              underlineColorAndroid={'transparent'}
              onChangeText={text => {
                // let newObj = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { approvalStatus: null, approvalRemarks: null, FileList: [] });
                // newObj.approvalRemarks = text;
                // //动态更新组件内state 记录输入内容
                // this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmVerifyDetail: { ...this.props.alarmVerifyDetail, data: { Datas: newObj } } }));
                this.setState({ approvalRemarks: text });
              }}
              value={this.state.approvalRemarks}
              multiline={true}
              placeholder="请输入描述信息"
              placeholderTextColor={'#999999'}
              style={{
                width: SCREEN_WIDTH - 26,
                backgroundColor: 'white',
                marginTop: 10,
                minHeight: 100,
                borderWidth: 0.5,
                color: '#333',
                borderColor: '#999',
                padding: 13,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'column',
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT - 250,
              marginTop: 1,
              backgroundColor: '#ffffff',
              padding: 13,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <SDLText style={{ color: 'red' }}> </SDLText>
              <SDLText style={{}}>附件</SDLText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                width: SCREEN_WIDTH,
                backgroundColor: '#ffffff',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: 10,
              }}>
              {this.renderPickedImage()}
              {this.props.editCommitEnable == true ? (
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS == 'ios') {
                      SyanImagePicker.showImagePicker(
                        { imageCount: 1 },
                        (err, selectedPhotos) => {
                          if (err) {
                            // 取消选择
                            return;
                          }

                          if (selectedPhotos.length < 1) {
                            return;
                          } else {
                            that.props.dispatch(
                              // createAction('alarmAnaly/uploadimage')({
                              createAction('imageModel/uploadimage')({
                                image: selectedPhotos[0],
                                images: selectedPhotos,
                                uuid: this.state.TimeS,
                                callback: this.uploadImageCallBack,
                              }),
                            );
                          }
                        },
                      );
                      return;
                    }
                    SyanImagePicker.showImagePicker({ imageCount: 1 }, (err, selectedPhotos) => {
                      if (err) {
                        // 取消选择
                        return;
                      }

                      if (selectedPhotos.length <= 0) {
                        return;
                      } else {
                        ShowLoadingToast('正在上传图片');
                        that.props.dispatch(
                          createAction('imageModel/uploadimage')({
                            images: selectedPhotos,
                            uuid: this.state.TimeS,
                            callback: this.uploadImageCallBack
                          })
                        );
                      }
                    });
                    // this.refs.doAlert.show();
                  }}
                  style={{
                    width: SCREEN_WIDTH / 4 - 25,
                    height: SCREEN_WIDTH / 4 - 25,
                  }}>
                  <Image
                    source={require('../../images/addpic.png')}
                    style={{
                      width: SCREEN_WIDTH / 4 - 25,
                      height: SCREEN_WIDTH / 4 - 25,
                      marginLeft: 10,
                      marginBottom: 5,
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            {this.props.editCommitEnable == true ? (
              <TouchableOpacity
                onPress={() => {
                  const { approvalStatus, approvalRemarks } = this.state;
                  if (
                    approvalStatus == '' ||
                    approvalRemarks == '' ||
                    approvalStatus == null ||
                    approvalRemarks == null
                  ) {
                    ShowToast('请完善相关信息');
                    return;
                  } else {
                    this.refs.doCommitAlert.show();
                  }
                }}
                style={{
                  marginVertical: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: SCREEN_WIDTH - 20,
                  height: 52,
                  backgroundColor: globalcolor.headerBackgroundColor,
                }}>
                <Text style={{ color: '#ffffff', fontSize: 18 }}>{'保存'}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <Modal
            visible={this.state.modalVisible}
            transparent={true}
            onRequestClose={() => this.setState({ modalVisible: false })}>
            <ImageViewer
              saveToLocalByLongPress={false}
              onClick={() => {
                {
                  this.setState({
                    modalVisible: false,
                  });
                }
              }}
              imageUrls={this.state.imgUrls}
              index={this.state.index}
            />
          </Modal>
          {SentencedToEmpty(
            this.props,
            ['checkedRectificationResult', 'status'],
            200,
          ) == -1 ? (
            <SimpleLoadingComponent message={'提交中'} />
          ) : null}
        </ScrollView>
        <AlertDialog options={alertOptions} ref="doCommitAlert" />
        <OperationAlertDialog options={dialogOptions} ref="doAlert" />
      </StatusPage>
    );
  }
}
