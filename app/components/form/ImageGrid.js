import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';
import Touchable from '../base/Touchable';

export default class ImageGrid extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { ImgList = [], LowimgList = [], ThumbimgList = [], isDel = true, isUpload = true, fileUUID = '' } = this.props;
        const { style } = this.props;
        if (!isUpload && ImgList.length == 0) {
            return null;
        } else if (!isUpload && ImgList.length == 0) {
            return null;
        } else {
            const rtnVal = [];
            LowimgList.map((item, key) => {
                rtnVal.push(
                    <View key={`image_${key}`} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 10 }}>
                        <Image source={item} style={{ width: 60, height: 60, marginRight: 5, marginLeft: 10, marginBottom: 5 }} />
                        <Touchable
                            onPress={() => {
                                this.setState({ modalVisible: true, index: key });
                            }}
                            style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                        >
                            <View style={[{ height: 50, width: 50 }]} />
                        </Touchable>
                        <Touchable
                            onPress={() => {
                                // this.props.dispatch(
                                //     createAction('alarm/DelPhotoRelation')({
                                //         params: {
                                //             code: item.attachID,
                                //             callback: () => {
                                //                 this.setState(state => {
                                //                     const imagelist = state.imagelist;
                                //                     let imgUrls = state.imgUrls;
                                //                     const removeIndex = state.imagelist.findIndex((value, index, arr) => value.uploadID === item.uploadID);
                                //                     imagelist.splice(removeIndex, 1);
                                //                     imgUrls.splice(removeIndex, 1);
                                //                     const refresh = !state.refresh;
                                //                     return { imagelist, refresh, imgUrls };
                                //                 });
                                //             }
                                //         }
                                //     })
                                // );
                            }}
                            style={[{ position: 'absolute', top: -8, left: SCREEN_WIDTH / 4 - 27 }]}
                        >
                            <Image source={require('../../images/ic_close_blue.png')} style={{ width: 16, height: 16 }} />
                        </Touchable>
                    </View>
                );
            });

            if (isUpload) {
                rtnVal.push(
                    <View key={'imge_upload'} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 10 }}>
                        <Image source={require('../../images/home_point_add.png')} style={{ width: 60, height: 60, marginRight: 5, marginLeft: 10, marginBottom: 5 }} />
                        <Touchable onPress={() => {}} style={[{ position: 'absolute', bottom: 0, left: 0 }]}>
                            <View style={[{ height: 50, width: 50 }]} />
                        </Touchable>
                    </View>
                );
            }

            return <View style={[{ flexDirection: 'row', width: '100%', backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap' }, style]}>{rtnVal}</View>;
        }
    }
}
