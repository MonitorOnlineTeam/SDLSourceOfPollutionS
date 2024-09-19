import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty } from '../../utils';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { SimplePickerSingleTime, SimpleMultipleItemPicker, SDLText, StatusPage } from '../../components';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback, ImageBackground, Platform } from 'react-native';
import PointBar from '../components/PointBar';
import TextLabel from '../components/TextLabel';
import { getToken } from '../../dvapack/storage';
/**
 *
 *站点详情
 */
@connect(({ pointDetails }) => ({
    videoLstResult: pointDetails.videoLstResult
}))
export default class VideoList extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '监控列表',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        this.props.dispatch(createAction('pointDetails/getVideoList')({ params: { DGIMN: this.props.navigation.state.params.DGIMN } }));
    }

    _renderItemList = item => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    minHeight: 50,
                    marginBottom: 1,
                    alignItems: 'center'
                }}
                onPress={() => {
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'VideoView',
                            params: {
                                pointName: item.item.VedioCamera_Position,
                                SerialNumber: item.item.VedioCamera_SerialNumber,
                                VerificationCode: item.item.VedioCamera_VerificationCode,
                                channelNo: SentencedToEmpty(item, ['item', 'VedioCamera_Describe'], '1'),
                                token: this.props.videoLstResult.data.Datas.Token,
                                AppKey: getToken().AppKey
                            }
                        })
                    );
                }}
            >
                <Image source={require('../../images/icon_upload_pictures.png')} style={{ marginLeft: 20, width: 30, height: 30 }} />
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[{ marginLeft: 10, color: '#666666' }]}>{item.item.VedioCamera_Position}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={[{ marginLeft: 10, color: '#999999' }]}>{item.item.VedioCamera_Describe}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        // return <View style={[{ height: 200, width: SCREEN_WIDTH, backgroundColor: 'blue' }]} />;
        return (
            <StatusPage
                style={{ flex: 0.95 }}
                status={this.props.videoLstResult.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.refreshData();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.refreshData();
                }}
            >
                {this.props.videoLstResult.status == 200 ? (
                    <View>
                        <FlatList
                            style={{ marginTop: 10 }}
                            data={this.props.videoLstResult.data.Datas.CameraList}
                            overScrollMode={'never'}
                            onScroll={this.props.onScroll}
                            renderItem={this._renderItemList}
                            onEndReachedThreshold={0.5}
                            initialNumToRender={30}
                        />
                    </View>
                ) : null}
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({});
