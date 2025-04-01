import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Signature from 'react-native-signature-canvas';
import globalcolor from '../../../../../config/globalcolor';
import {lockToLandscape, lockToPortrait} from 'react-native-orientation';

const {width, height} = Dimensions.get('window');

const SignaturePage = ({route, navigation}) => {
  const {onOK, onCancel, signature} = route.params.params;

  useEffect(() => {
    // // 进入页面时锁定为横屏
    // lockToLandscape();

    // // 返回时恢复竖屏
    // return () => {
    //   lockToPortrait();
    // };
  }, []);

  const handleOK = (_signature) => {
    // 直接使用签名组件返回的数据
    onOK(_signature);
    navigation.goBack();
    // 返回竖屏
    // lockToPortrait();
  };

  const handleCancel = () => {
    onCancel();
    // 返回竖屏
    lockToPortrait();
  };

  return (
    <View style={styles.container}>
      <Signature
        onOK={handleOK}
        onCancel={handleCancel}
        descriptionText="请在上方签名"
        clearText="清除"
        confirmText="确认"
        // imageType="image/png"
        imageType={"image/svg+xml"}
        ref={ref => {}}
        webStyle={`
          .m-signature-pad {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: white;
            z-index: 9999;
          }
          .m-signature-pad--body {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: calc(100% - 80px);
            border: none;
          }
          .m-signature-pad--footer {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 80px;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 20px;
            z-index: 10000;
          }
          .m-signature-pad--footer .button {
            background-color: ${globalcolor.blue};
            color: white;
            border-radius: 4px;
            padding: 0px 16px;
            margin: 0 8px;
            font-size: 16px;
            min-width: 80px;
            text-align: center;
          }
          .m-signature-pad--footer .button.clear {
            background-color: #999;
          }
          .m-signature-pad--footer .button:active {
            opacity: 0.8;
          }
          .m-signature-pad--body canvas {
            width: 100% !important;
            height: 100% !important;
          }
          @media screen and (orientation: landscape) {
            .m-signature-pad--body {
              height: calc(100% - 80px);
            }
            .m-signature-pad--footer {
              height: 80px;
            }
          }
        `}
        signature={signature}
        trimWhitespace={true}
        minWidth={0.5}
        maxWidth={2.5}
        minHeight={0.5}
        maxHeight={2.5}
        velocityFilterWeight={0.7}
        dotSize={1}
        penColor="black"
        backgroundColor="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default SignaturePage; 