/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-08-02 09:01:55
 * @LastEditTime: 2024-08-02 09:22:48
 * @FilePath: /SDLMainProject37/app/components/page/login/OfflineImageUploadTest.js
 */
import { Image, Text, View } from 'react-native'
import React, { Component } from 'react'
import ImageUploadTouch from '../../form/images/ImageUploadTouch';
import OfflineImageUploadTouch from './OfflineImageUploadTouch';

export default class OfflineImageUploadTest extends Component {
    render() {
        return (
            <View>
                <Text>OfflineImageUploadTest</Text>
                <OfflineImageUploadTouch
                    style={{ width: 60, height: 60, marginRight: 4, marginLeft: 8, marginBottom: 5, marginTop: 8 }}
                    componentType={''}
                    extraInfo={''}
                    uuid={'123'}
                    callback={images => {
                        // const ProxyCode = getEncryptData();
                        // let Imgs = [...this.state.Imgs];
                        // let largImage = [].concat(this.state.largImage);
                        // let newItem = [];
                        // let tempObject;
                        // images.map((item, key) => {
                        //     newItem.push({ AttachID: item.attachID });
                        //     Imgs.push({ AttachID: item.attachID });
                        //     tempObject = {
                        //         // url: `${rootUrl.ReactUrl}/upload/${item.AttachID}`,
                        //         // url: `${ImageUrlPrefix}/${item.AttachID}`,
                        //         url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.AttachID}`
                        //             : `${ImageUrlPrefix}${ProxyCode}/${item.AttachID}`,
                        //         AttachID: item.AttachID
                        //     }
                        //     largImage.push(tempObject);
                        // });

                        // this.setState({ Imgs: Imgs, largImage });
                        // uploadCallback(newItem);
                    }}
                >
                    <Image source={require('../../../images/home_point_add.png')} style={{ width: 60, height: 60 }} />
                </OfflineImageUploadTouch>
            </View>
        )
    }
}