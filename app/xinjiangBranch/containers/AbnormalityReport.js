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
  SimpleMultipleItemPicker,
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
 * 异常上报
 */
@connect(({enterpriseListModel, pointDetails}) => ({
  abnormalListDGIMN: pointDetails.abnormalListDGIMN,
  commitStopResult: enterpriseListModel.commitStopResult,
  PollantCodes: pointDetails.PollantCodes,
}))
export default class AbnormalityReport extends PureComponent {
  // static navigationOptions = ({ navigation }) =>
  //     createNavigationOptions({
  //         title: '异常报告上报',
  //         headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
  //     });

  constructor(props) {
    super(props);
    that = this;
    this.state = {
      loading: false,
      ID: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'ID'],
        '',
      ),
      excepTypes: [
        {
          typeName: '小时数据',
          code: 'HourData',
        },
        {
          typeName: '日数据',
          code: 'DayData',
        },
      ],
      selectExcepTyopes: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'ExceptionType'],
        'HourData',
      ),
      selectCodes: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'PollutantCodes'],
        '',
      ),
      encryData: '',
      imagelist: [],
      imgUrls: [],
      ExceptionMsg: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'Msg'],
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
      AttachmentsID: SentencedToEmpty(
        this.props,
        ['route', 'params', 'params', 'item', 'AttachmentsID'],
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
    let defaultTime;
    defaultTime = moment().format('YYYY-MM-DD HH:mm:ss');
    return {
      formatStr: 'YYYY/MM/DD HH:00',
      // defaultTime: defaultTime,
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
    let defaultTime;
    defaultTime = moment().format('YYYY-MM-DD HH:mm:ss');
    return {
      formatStr: 'YYYY/MM/DD HH:00',
      // defaultTime: defaultTime,
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
      // const source = item.attachID != '' ? { uri: `${UrlInfo.ImageUrl}${item.attachID}/Attachment?code=${this.state.encryData}` } : require('../../images/addpic.png');
      // const source = item.attachID != '' ? { uri: `${UrlInfo.ImageUrl}${item.attachID}`,headers:{ ProxyCode: encryData} } : require('../../images/addpic.png');
      // const source = item.attachID != '' ? { uri: `${rootUrl.ReactUrl}/upload/${item.attachID}` } : require('../../images/addpic.png');
      // const source = item.attachID != '' ? { uri: `${ImageUrlPrefix}/${item.attachID}` } : require('../../images/addpic.png');
      const source =
        item.attachID != ''
          ? {
              uri: IMAGE_DEBUG
                ? `${ImageUrlPrefix}/${item.attachID}`
                : `${ImageUrlPrefix}${ProxyCode}/thumb_${item.attachID}`,
            }
          : require('../../images/addpic.png');
      // const source = item.attachID != '' ? { uri: `${ImageUrlPrefix}/${item}` } : require('../../images/addpic.png');
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
        // newImagelist.push(img);
        let newImgUrls = [].concat(imgUrls);
        img.map((item, index) => {
          newImgUrls.push({
            // url: `${UrlInfo.ImageUrl}${img.attachID}/Attachment?code=${this.state.encryData}`,
            // url: `${UrlInfo.ImageUrl}${img.attachID}`,
            // url: `${rootUrl.ReactUrl}/upload/${item.attachID}`
            url: IMAGE_DEBUG
              ? `${ImageUrlPrefix}/${item.attachID}`
              : `${ImageUrlPrefix}${ProxyCode}/${item.attachID}`,
            // You can pass props to <Image />.
            // props: {
            //     headers: { ProxyCode: encryData}
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
        abnormalListIndex: 1,
        abnormalListTotal: 0,
        abnormalListResult: {status: -1},
      }),
    );
    this.props.dispatch(createAction('pointDetails/getAbnormalList')({}));
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: '异常报告上报',
    });
    const ProxyCode = getEncryptData();
    let that = this;
    let encryData = getEncryptData();
    const rootUrl = getRootUrl();
    this.setState({encryData: encryData});
    // AsyncStorage.getItem('encryptData', function(error, result) {
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
    // SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'Attachments', 'ImgNameList'], [])
    SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'item', 'Attachments'],
      '',
    )
      .split(',')
      .map(item => {
        if (item != '')
          ims.push({
            attachID: item,
            url: IMAGE_DEBUG
              ? `${ImageUrlPrefix}/${item}`
              : `${ImageUrlPrefix}${ProxyCode}/${item}`,
          });
      });
    let fuben = [].concat(ims);
    this.setState({imagelist: ims, imgUrls: fuben});

    this.props.dispatch(
      createAction('pointDetails/getPollantCodes')({
        params: {DGIMNs: this.props.abnormalListDGIMN},
        callBack: () => {},
      }),
    );
  }
  getExceptionOption = () => {
    return {
      contentWidth: 166,
      // selectName: '选择异常类型',
      placeHolderStr: '小时数据',
      codeKey: 'code',
      nameKey: 'typeName',
      // maxNum: 3,
      selectCode: this.state.selectExcepTyopes.split(','),
      dataArr: this.state.excepTypes,
      callback: ({selectCode, selectNameStr, selectCodeStr, selectData}) => {
        this.setState({selectExcepTyopes: selectCodeStr});
      },
    };
  };
  getPointTypeOption = () => {
    let dataSource = [];

    this.props.PollantCodes.map(item => {
      if (item.PollutantCode == 'AQI') {
        return;
      }

      dataSource.push(item);
    });
    return {
      contentWidth: 166,
      // selectName: '选择污染物',
      placeHolderStr: '选择污染物',
      codeKey: 'PollutantCode',
      nameKey: 'PollutantName',
      // maxNum: 3,
      selectCode: this.state.selectCodes.split(','),
      dataArr: dataSource,
      callback: ({selectCode, selectNameStr, selectCodeStr, selectData}) => {
        if (selectCode.length < 1) {
          ShowToast('请至少选择一种因子');
          return;
        }
        this.setState({selectCodes: selectCodeStr});
      },
    };
  };
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
                    uuid: this.state.AttachmentsID,
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
                    uuid: this.state.AttachmentsID,
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
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              width: SCREEN_WIDTH,
              height: 50,
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
            }}>
            <SDLText style={{marginLeft: 13, color: 'red'}}>* 开始时间</SDLText>
            <SimplePickerSingleTime option={this.getTimeSelectOption()} />
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
            <SDLText style={{marginLeft: 13, color: 'red'}}>* 截止时间</SDLText>
            <SimplePickerSingleTime option={this.getTimeSelectOption2()} />
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
            <SDLText style={{marginLeft: 13, color: 'red'}}>
              * 选择污染物
            </SDLText>
            {this.props.PollantCodes.length > 0 ? (
              <SimpleMultipleItemPicker
                ref={ref => {
                  this.simpleMultipleItemPicker2 = ref;
                }}
                option={this.getPointTypeOption()}
                style={[{width: 210}]}
              />
            ) : null}
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
            <SDLText style={{marginLeft: 13, color: 'red'}}>* 异常类型</SDLText>
            {this.props.PollantCodes.length > 0 ? (
              <SimpleMultipleItemPicker
                ref={ref => {
                  this.simpleMultipleItemPicker = ref;
                }}
                option={this.getExceptionOption()}
                style={[{width: 210}]}
              />
            ) : null}
          </View>
          <View
            style={{
              width: SCREEN_WIDTH,
              alignItems: 'flex-start',
              justifyContent: 'center',
              backgroundColor: 'white',
              marginTop: 1,
            }}>
            <SDLText style={{marginLeft: 13, marginTop: 13, color: 'red'}}>
              * 异常描述：
            </SDLText>
            <TextInput
              style={{color: '#333'}}
              autoCapitalize={'none'}
              autoCorrect={false}
              underlineColorAndroid={'transparent'}
              onChangeText={text => {
                //动态更新组件内state 记录输入内容
                this.setState({ExceptionMsg: text});
              }}
              value={this.state.ExceptionMsg}
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
              height: SCREEN_HEIGHT,
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
                              uuid: this.state.AttachmentsID,
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
                  //                 uuid: this.state.AttachmentsID,
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
            if (SentencedToEmpty(this.state, ['ExceptionMsg'], '') == '') {
              ShowToast('请填写异常描述信息');
              return;
            }
            if (SentencedToEmpty(this.state, ['selectExcepTyopes'], '') == '') {
              ShowToast('请选择异常类型');
              return;
            }
            if (SentencedToEmpty(this.state, ['selectCodes'], '') == '') {
              ShowToast('请选择污染因子');
              return;
            }
            this.props.dispatch(
              createAction('enterpriseListModel/commitAbnomal')({
                params: {
                  ID: this.state.ID,
                  DGIMN: this.props.abnormalListDGIMN,
                  ExceptionBeginTime: this.state.startTime,
                  ExceptionEndTime: this.state.endTime,
                  ExceptionMsg: this.state.ExceptionMsg,
                  Attachments: this.state.AttachmentsID,
                  RecordTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                  ExceptionType: this.state.selectExcepTyopes,
                  PollutantCodes: this.state.selectCodes,
                },
                callback: () => {
                  this.props.dispatch(NavigationActions.back());
                },
              }),
            );
          }}
          style={{
            bottom: 10,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            width: SCREEN_WIDTH - 20,
            marginLeft: 10,
            height: 52,
            backgroundColor: globalcolor.headerBackgroundColor,
            position: 'absolute',
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
