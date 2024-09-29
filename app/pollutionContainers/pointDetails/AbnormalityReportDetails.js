import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  AsyncStorage,
} from 'react-native';

import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../config/globalsize';
import {
  SentencedToEmpty,
  getDocumentIcon,
  createNavigationOptions,
  ShowToast,
  showAttachment,
} from '../../utils';
import {
  StatusPage,
  FlatListWithHeaderAndFooter,
  Touchable,
  SimpleLoadingComponent,
} from '../../components';
import {IMAGE_DEBUG, ImageUrlPrefix, UrlInfo} from '../../config';
import globalcolor from '../../config/globalcolor';
import {getEncryptData} from '../../dvapack/storage';

export default class AbnormalityReportDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downLoading: false,
    };
    _me = this;
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: '异常上报详情',
    });
  }

  getDocumentSuffix = name => {
    if (name == '') {
      return 'default';
    } else {
      let tempArray = name.split('.');
      if (tempArray.length > 1) {
        return tempArray[tempArray.length - 1];
      } else {
        return 'default';
      }
    }
  };

  _onItemClick = async item => {
    const ProxyCode = getEncryptData();
    // let { downloadUrl = '', b_local_file = '', fileShowName = '文件名', progressCallBack = res => {}, endCallBack = (res, compliteFun = () => {}) => {}, errorCallBack = err => {} } = option;
    showAttachment({
      // downloadUrl: `${UrlInfo.ImageUrl}${SentencedToEmpty(item, ['AttachmentName'], '')}`,
      // downloadUrl: `${ImageUrlPrefix}/${SentencedToEmpty(item, ['AttachmentName'], '')}`,
      downloadUrl: IMAGE_DEBUG
        ? `${ImageUrlPrefix}/${SentencedToEmpty(item, ['AttachmentName'], '')}`
        : `${ImageUrlPrefix}${ProxyCode}/${SentencedToEmpty(
            item,
            ['AttachmentName'],
            '',
          )}`,
      b_local_file: SentencedToEmpty(item, ['AttachmentName'], ''),
      fileShowName: SentencedToEmpty(item, ['AttachmentName'], ''),
      beginCallBack: () => {
        this.setState({
          //展示进度条
          downLoading: true,
        });
      },
      progressCallBack: res => {
        let pro =
          Math.round((res.bytesWritten / res.contentLength) * 100) / 100;
        let _text = Math.round((res.bytesWritten / res.contentLength) * 100);
      },
      endCallBack: (res, compliteFun) => {
        if (SentencedToEmpty(res, ['statusCode'], 404) == 404) {
          this.setState({
            //关闭进度条
            downLoading: false,
          });
          ShowToast('文件下载失败！');
          return;
        }
        let pro = 1;
        let _text = 100;
        // 最后一次将进度刷新为100
        this.setState({
          //关闭进度条
          downLoading: false,
        });
        compliteFun();
      },
      errorCallBack: err => {
        this.setState({
          //关闭进度条
          downLoading: false,
        });
        console.log('err:', err);
      },
    });
  };

  render() {
    let buttonWidth = (SCREEN_WIDTH - 20) / 5;
    // let viewData = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item'], {});
    // let attachmentStr = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'Attachments'], '');
    // let attachmentArray = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'Attachments', 'ImgNameList'], []);
    let attachmentArray = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'item', 'Attachments'],
      '',
    ).split(',');
    return (
      <View style={[styles.container, {backgroundColor: '#fff'}]}>
        {this.state.downLoading == true ? (
          <SimpleLoadingComponent message={'正在下载相关文档'} />
        ) : null}
        <View
          style={[
            {
              width: SCREEN_WIDTH,
              height: 44,
              paddingHorizontal: 20,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e5e5',
            },
          ]}>
          <Text style={[{fontSize: 14, color: '#333'}]}>异常开始时间</Text>
          <Text style={[{marginLeft: 28, fontSize: 14, color: '#666'}]}>
            {SentencedToEmpty(
              this.props,
              ['route', 'params', 'params', 'item', 'BeginTime'],
              '--',
            )}
          </Text>
        </View>
        <View
          style={[
            {
              width: SCREEN_WIDTH,
              height: 44,
              paddingHorizontal: 20,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e5e5',
            },
          ]}>
          <Text style={[{fontSize: 14, color: '#333'}]}>异常截止时间</Text>
          <Text style={[{marginLeft: 28, fontSize: 14, color: '#666'}]}>
            {SentencedToEmpty(
              this.props,
              ['route', 'params', 'params', 'item', 'EndTime'],
              '--',
            )}
          </Text>
        </View>
        <View
          style={[
            {
              width: SCREEN_WIDTH,
              height: 44,
              paddingHorizontal: 20,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e5e5',
            },
          ]}>
          <Text style={[{fontSize: 14, color: '#333'}]}>异常数据类型：</Text>
          <Text style={[{marginLeft: 28, fontSize: 14, color: '#666'}]}>
            {SentencedToEmpty(
              this.props,
              ['route', 'params', 'params', 'item', 'DataType'],
              '--',
            )}
          </Text>
        </View>
        <View
          style={[
            {
              width: SCREEN_WIDTH,
              height: 44,
              paddingHorizontal: 20,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e5e5',
            },
          ]}>
          <Text style={[{fontSize: 14, color: '#333'}]}>异常监测因子：</Text>
          <Text
            style={[
              {
                marginLeft: 28,
                fontSize: 14,
                color: '#666',
                flex: 1,
                marginRight: 8,
                lineHeight: 18,
              },
            ]}>
            {SentencedToEmpty(
              this.props,
              ['route', 'params', 'params', 'item', 'PollutantNames'],
              '--',
            )}
          </Text>
        </View>
        <View
          style={[
            {
              width: SCREEN_WIDTH,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#e5e5e5',
            },
          ]}>
          <View
            style={[
              {
                width: SCREEN_WIDTH,
                height: 44,
                alignItems: 'center',
                flexDirection: 'row',
              },
            ]}>
            <Text style={[{fontSize: 14, color: '#333'}]}>异常描述</Text>
          </View>
          <Text
            style={[
              {fontSize: 14, color: '#666', lineHeight: 25, marginBottom: 11},
            ]}>
            {SentencedToEmpty(
              this.props,
              ['route', 'params', 'params', 'item', 'Msg'],
              '----',
            )}
          </Text>
        </View>
        <View style={[{width: SCREEN_WIDTH, paddingLeft: 20}]}>
          <View
            style={[
              {
                width: SCREEN_WIDTH,
                height: 44,
                alignItems: 'center',
                flexDirection: 'row',
              },
            ]}>
            <Text style={[{fontSize: 14, color: '#333'}]}>报告凭证</Text>
          </View>
          <View
            style={[
              {
                width: SCREEN_WIDTH - 20,
                flexDirection: 'row',
                flexWrap: 'wrap',
              },
            ]}>
            {attachmentArray.map((item, key) => {
              if (item != '') {
                return (
                  <Touchable
                    key={`附件${key}`}
                    onPress={() =>
                      this._onItemClick({
                        AttachmentName: item,
                        showName: `附件${key + 1}`,
                      })
                    }
                    style={[
                      {
                        width: buttonWidth,
                        alignItems: 'center',
                        paddingRight: 20,
                      },
                    ]}>
                    <Image
                      style={[{height: 24, width: 24}]}
                      source={getDocumentIcon(this.getDocumentSuffix(item))}
                    />
                    <Text
                      style={[
                        {
                          color: '#666',
                          fontSize: 12,
                          marginTop: 5,
                          marginBottom: 16,
                        },
                      ]}>{`附件${key + 1}`}</Text>
                  </Touchable>
                );
              }
            })}
          </View>
        </View>
      </View>
    );
  }
}
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
