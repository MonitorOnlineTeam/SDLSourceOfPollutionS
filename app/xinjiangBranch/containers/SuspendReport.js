import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Platform,
  TextInput,
  AsyncStorage,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SyanImagePicker from 'react-native-syan-image-picker';
import {connect} from 'react-redux';
import moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  StatusPage,
  SelectButton,
  SimplePickerSingleTime,
  SDLText,
  SimplePicker,
  SimpleLoadingComponent,
  OperationAlertDialog,
} from '../../components';
import {
  createNavigationOptions,
  NavigationActions,
  createAction,
  ShowLoadingToast,
  CloseToast,
  ShowToast,
  SentencedToEmpty,
} from '../../utils';
import {SCREEN_WIDTH} from '../../config/globalsize';
import {IMAGE_DEBUG, ImageUrlPrefix, UrlInfo} from '../../config/globalconst';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SCREEN_HEIGHT} from '../../components/SDLPicker/constant/globalsize';
import globalcolor from '../../config/globalcolor';
import {getEncryptData, getRootUrl} from '../../dvapack/storage';
const options = {
  mediaType: 'photo',
  quality: 0.7,
  selectionLimit: 5,
  includeBase64: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
let that;
/**
 * 停运上报
 */
@connect(({enterpriseListModel}) => ({
  commitStopResult: enterpriseListModel.commitStopResult,
}))
export default class SuspendReport extends PureComponent {
  //   static navigationOptions = ({navigation}) =>
  //     createNavigationOptions({
  //       title: '停运上报',
  //       headerTitleStyle: {marginRight: Platform.OS === 'android' ? 76 : 0},
  //     });

  constructor(props) {
    super(props);
    that = this;
    this.state = {
      loading: false,
      encryData: '',
      imagelist: [],
      imgUrls: [],
      VerifyMessage: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'StopDescription'],
        '',
      ),
      modalVisible: false,
      startTime: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'BeginTime'],
        moment().format('YYYY-MM-DD HH:mm:ss'),
      ),
      endTime: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'EndTime'],
        moment().format('YYYY-MM-DD HH:mm:ss'),
      ),
      TimeS: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'AttachmentId'],
        new Date().getTime(),
      ),
    };
  }

  callback = isSuccess => {
    if (isSuccess == true) {
      ShowToast('提交成功');

      this.props.navigation.dispatch(NavigationActions.back());
      this.props.navigation.state.params.onRefresh();
    } else {
      ShowToast('提交失败');
    }
    this.setState({loading: false});
  };
  getTimeSelectOption = () => {
    // let defaultTime;
    // defaultTime = moment().format('YYYY-MM-DD HH:mm:ss');
    return {
      formatStr: 'YYYY/MM/DD HH:00',
      defaultTime: this.state.startTime,
      type: 'hour',
      onSureClickListener: time => {
        this.setState({
          startTime: moment(time).format('YYYY-MM-DD HH:00:00'),
          // showTime:this.formatShowTime(time,'day'),
        });
      },
    };
  };
  getTimeSelectOption2 = () => {
    // let defaultTime;
    // defaultTime = moment().format('YYYY-MM-DD HH:mm:ss');
    return {
      formatStr: 'YYYY/MM/DD HH:00',
      defaultTime: this.state.endTime,
      type: 'hour',
      onSureClickListener: time => {
        this.setState({
          endTime: moment(time).format('YYYY-MM-DD HH:00:00'),
          // showTime:this.formatShowTime(time,'day'),
        });
      },
    };
  };

  renderPickedImage = () => {
    const ProxyCode = getEncryptData();
    const rtnVal = [];
    let encryData = getEncryptData();
    const rootUrl = getRootUrl();
    this.state.imagelist.map((item, key) => {
      // const source = item.attachID != '' ? { uri: `${UrlInfo.ImageUrl}${item.attachID}/Attachment?code=${this.state.encryData}`,headers:{ProxyCode:encryData} } : require('../../images/addpic.png');
      // const source = item.attachID != '' ? { uri: `${UrlInfo.ImageUrl}${item.attachID}`,headers:{ProxyCode:encryData} } : require('../../images/addpic.png');
      // const source = item.attachID != '' ? { uri: `${rootUrl.ReactUrl}/upload/${item.attachID}` } : require('../../images/addpic.png');
      // const source = item.attachID != '' ? { uri: `${ImageUrlPrefix}/${item.attachID}`, } : require('../../images/addpic.png');
      const source =
        item.attachID != ''
          ? {
              uri: IMAGE_DEBUG
                ? `${ImageUrlPrefix}/${item.attachID}`
                : `${ImageUrlPrefix}${ProxyCode}/thumb_${item.attachID}`,
            }
          : require('../../images/addpic.png');
      console.log('source', source);
      rtnVal.push(
        <View
          key={item.attachID}
          style={{width: SCREEN_WIDTH / 4 - 5, height: SCREEN_WIDTH / 4 - 5}}>
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
              this.setState({modalVisible: true, index: key});
            }}
            style={[{position: 'absolute', bottom: 0, left: 0}]}>
            <View
              style={[
                {height: SCREEN_WIDTH / 4 - 10, width: SCREEN_WIDTH / 4 - 15},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.dispatch(
                createAction('alarm/DelPhotoRelation')({
                  params: {
                    code: item.attachID,
                    callback: () => {
                      const removeIndex = this.state.imagelist.findIndex(
                        (value, index, arr) => value.attachID === item.attachID,
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
            style={[{position: 'absolute', top: 2, right: 2}]}>
            <Image
              source={require('../../images/ic_close_blue.png')}
              style={{width: 16, height: 16}}
            />
          </TouchableOpacity>
        </View>,
      );
    });
    return rtnVal;
  };
  uploadImageCallBack = (img, isSuccess) => {
    console.log('img', img);
    if (isSuccess) {
      const ProxyCode = getEncryptData();
      let encryData = getEncryptData();
      const rootUrl = getRootUrl();
      this.setState(state => {
        // copy the map rather than modifying state.
        const imagelist = state.imagelist;
        const refresh = !state.refresh;
        let imgUrls = state.imgUrls;
        let imagUrl = UrlInfo.ImageUrl;
        let newImagelist = imagelist.concat(img);
        let newImgUrls = [].concat(imgUrls);
        img.map((item, index) => {
          newImgUrls.push({
            // url: `${UrlInfo.ImageUrl}${img.attachID}/Attachment?code=${this.state.encryData}`,
            // url: `${rootUrl.ReactUrl}/upload/${item.attachID}`
            url: IMAGE_DEBUG
              ? `${ImageUrlPrefix}/${item.attachID}`
              : `${ImageUrlPrefix}${ProxyCode}/${item.attachID}`,
            // You can pass props to <Image />.
            // props: {
            //     // headers: ...
            //     headers:{
            //         ProxyCode:encryData,
            //     }
            // }
          });
        });

        return {imagelist: newImagelist, refresh, imgUrls: newImgUrls};
      });
      CloseToast('上传成功');
    } else {
      CloseToast();
      ShowToast('上传失败！');
    }
  };

  componentWillUnmount() {
    this.props.dispatch(
      createAction('pointDetails/updateState')({
        outputStopListIndex: 1,
        outputStopListTotal: 0,
        outputStopListResult: {status: -1},
      }),
    );
    this.props.dispatch(createAction('pointDetails/getOutputStopList')({}));
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: '停运上报',
    });

    let encryData = getEncryptData();
    const rootUrl = getRootUrl();
    this.setState({encryData: encryData});
    // AsyncStorage.getItem('encryptData', function (error, result) {
    //     if (error) {
    //         encryData = '';
    //     } else {
    //         if (result == null) {
    //             encryData = '';
    //         } else {
    //             encryData = result;
    //             that.setState({ encryData: encryData });
    //         }
    //     }
    // });
    let ims = [];
    SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'item', 'Attachment'],
      '',
    )
      .split(',')
      .map(item => {
        // if (item != '') ims.push({ attachID: item
        //     , url: `${UrlInfo.ImageUrl}${item}`
        //     , props: {
        //         headers: { ProxyCode: encryData}
        //     }});
        if (item != '')
          ims.push({attachID: item, url: `${rootUrl.ReactUrl}/upload/${item}`});
      });
    /**
         * {
                    // url: `${UrlInfo.ImageUrl}${img.attachID}/Attachment?code=${this.state.encryData}`,
                    url: `${UrlInfo.ImageUrl}${img.attachID}`,
                    // You can pass props to <Image />.
                    props: {
                        headers: { ProxyCode: encryData}
                    }
                }
         */
    let fuben = [].concat(ims);
    this.setState({imagelist: ims, imgUrls: fuben});
  }

  render() {
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
          btnStyle: {backgroundColor: '#fff'},
          txtStyle: {color: '#f97740', fontSize: 15, fontWeight: 'bold'},
          onpress: () => {
            launchCamera(options, response => {
              const {assets = []} = response;
              let imageObj = null;
              if (assets.length <= 0) {
                return;
              } else {
                imageObj = assets[0];
                ShowLoadingToast('正在上传图片');
                that.props.dispatch(
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
          btnStyle: {backgroundColor: '#fff'},
          txtStyle: {color: '#f97740', fontSize: 15, fontWeight: 'bold'},
          onpress: () => {
            launchImageLibrary(options, response => {
              const {assets = []} = response;
              let imageObj = null;
              if (assets.length <= 0) {
                return;
              } else {
                imageObj = assets[0];
                ShowLoadingToast('正在上传图片');
                that.props.dispatch(
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
      <View style={[{flex: 1}]}>
        <ScrollView style={[{flex: 1, borderWidth: 1}]}>
          <View
            style={{
              flexDirection: 'row',
              width: SCREEN_WIDTH,
              height: 50,
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
            }}>
            <SDLText style={{marginLeft: 13}}>开始时间</SDLText>
            <SimplePickerSingleTime
              style={{marginLeft: 20, width: SCREEN_WIDTH - 120}}
              option={this.getTimeSelectOption()}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: SCREEN_WIDTH,
              height: 50,
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              marginTop: 1,
            }}>
            <SDLText style={{marginLeft: 13}}>截止时间</SDLText>
            <SimplePickerSingleTime
              style={{marginLeft: 20, width: SCREEN_WIDTH - 120}}
              option={this.getTimeSelectOption2()}
            />
          </View>
          <View
            style={{
              width: SCREEN_WIDTH,
              alignItems: 'flex-start',
              justifyContent: 'center',
              backgroundColor: 'white',
              marginTop: 1,
            }}>
            <SDLText style={{marginLeft: 13, marginTop: 13}}>
              原因备注：
            </SDLText>
            <TextInput
            //   style={{color: '#333'}}
              autoCapitalize={'none'}
              autoCorrect={false}
              underlineColorAndroid={'transparent'}
              onChangeText={text => {
                //动态更新组件内state 记录输入内容
                this.setState({VerifyMessage: text});
              }}
              te
              value={this.state.VerifyMessage}
              multiline={true}
              placeholder="请输入原因备注"
              style={{
                width: SCREEN_WIDTH - 28,
                height: 44,
                backgroundColor: '#fff',
                textAlignVertical: 'top',
                marginLeft: 15,
                marginTop: 12,
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
            }}>
            <SDLText
              style={[
                styles.texttitleStyle,
                {marginLeft: 13, color: '#333', marginTop: 15},
              ]}>
              添加附件：
            </SDLText>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                width: SCREEN_WIDTH,
                backgroundColor: '#ffffff',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: 10,
                paddingHorizontal: 10,
              }}>
              {this.renderPickedImage()}
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS == 'ios') {
                    SyanImagePicker.showImagePicker(
                      {},
                      (err, selectedPhotos) => {
                        if (err) {
                          // 取消选择
                          return;
                        }

                        if (selectedPhotos.length <= 0) {
                          return;
                        } else {
                          that.props.dispatch(
                            createAction('imageModel/uploadimage')({
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
                  this.refs.doAlert.show();

                  // ImagePicker.showImagePicker(options, response => {
                  //     if (response.didCancel) {
                  //     } else if (response.error) {
                  //     } else if (response.customButton) {
                  //     } else {
                  //         ShowLoadingToast('正在上传图片');
                  //         const imageIndex = this.state.imagelist.findIndex((value, index, arr) => value.origURL === response.origURL);
                  //         this.props.dispatch(
                  //             createAction('alarm/uploadimage')({
                  //                 image: response,
                  //                 uuid: this.state.TimeS,
                  //                 callback: this.uploadImageCallBack
                  //             })
                  //         );
                  //     }
                  // });
                }}
                style={{
                  width: SCREEN_WIDTH / 4 - 5,
                  height: SCREEN_WIDTH / 4 - 5,
                }}>
                <Image
                  source={require('../../images/addpic.png')}
                  style={{
                    width: SCREEN_WIDTH / 4 - 25,
                    height: SCREEN_WIDTH / 4 - 25,
                    marginLeft: 10,
                    marginTop: 10,
                    marginBottom: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            visible={this.state.modalVisible}
            transparent={true}
            onRequestClose={() => this.setState({modalVisible: false})}>
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
          {this.props.commitStopResult.status == -1 ? (
            <SimpleLoadingComponent message={'提交中'} />
          ) : null}
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            if (
              SentencedToEmpty(
                this.props,
                ['route', 'params', 'params', 'item', 'OutputStopID'],
                '',
              ) != ''
            ) {
              this.props.dispatch(
                createAction('enterpriseListModel/updateStops')({
                  params: {
                    OutputStopID: SentencedToEmpty(
                      this.props,
                      ['route', 'params', 'params', 'item', 'OutputStopID'],
                      '',
                    ),
                    DGIMN: '',
                    BeginTime: this.state.startTime,
                    EndTime: this.state.endTime,
                    StopDescription: this.state.VerifyMessage,
                    Attachment: this.state.TimeS,
                    RecordTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                  },
                  callback: () => {
                    this.props.dispatch(NavigationActions.back());
                  },
                }),
              );
              return;
            }
            this.props.dispatch(
              createAction('enterpriseListModel/commitStops')({
                params: {
                  DGIMN: '',
                  BeginTime: this.state.startTime,
                  EndTime: this.state.endTime,
                  StopDescription: this.state.VerifyMessage,
                  Attachment: this.state.TimeS,
                  RecordTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                },
                callback: () => {
                  this.props.dispatch(NavigationActions.back());
                },
              }),
            );
          }}
          style={{
            marginVertical: 10,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            width: SCREEN_WIDTH - 20,
            marginLeft: 10,
            height: 52,
            backgroundColor: globalcolor.headerBackgroundColor,
          }}>
          <Text style={{color: '#ffffff', fontSize: 18}}>{'确定'}</Text>
        </TouchableOpacity>
        <OperationAlertDialog options={dialogOptions} ref="doAlert" />
      </View>
    );
  }
}
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
