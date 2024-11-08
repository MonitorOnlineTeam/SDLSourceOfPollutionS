/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-05-13 11:51:43
 * @LastEditTime: 2024-11-04 17:11:52
 * @FilePath: /SDLSourceOfPollutionS/app/operationContainers/taskViews/taskExecution/ScopeMap.js
 */
import React, { Component } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, Image } from 'react-native';
import Map from '../../../components/Map';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../../utils';
import IconDialog from './components/IconDialog';

export default class ScopeMap extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '查看打卡范围',
            headerRight: SentencedToEmpty(navigation, ['state', 'params', 'headerRight'], <View></View>)
        });

    componentDidMount() {
        this.props.navigation.setParams({
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        this.iconDialog.showModal();
                    }}
                >
                    <Text style={{ color: 'white', marginRight: 8 }}>说明</Text>
                </TouchableOpacity>
            )
        });
    }

    isChengTaoSignIn = () => {
        const from = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'from'], 'task')
        if (from == 'ChengTaoSignIn') {
            return true;
        } else {
            return false;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Map />
                <IconDialog hasCloseButton={true} ref={ref => (this.iconDialog = ref)} icUri={require('../../../images/ic_dialog_no_check_in.png')}>
                    <View style={{ width: 270, height: 150, alignItems: 'center' }}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image style={{ height: 13, width: 13, marginRight: 8 }} source={require('../../../images/userlocal.png')} />
                                <Text style={[{ color: '#333333' }]}>{'您的当前位置'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image style={{ height: 13, width: 13, marginRight: 8 }} source={require('../../../images/enterpriselocal.png')} />
                                <Text style={[{ color: '#333333' }]}>{this.isChengTaoSignIn() ? '项目位置' : '监测点位置'}</Text>
                            </View>
                            {/* 大家都认为标记这个位置不合适
                            <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                <Image
                                    style={{height:13,width:13,tintColor:'#FF9912',marginRight:8}}
                                    source={require('../../../images/ic_audit_invalid.png')}
                                />
                                <Text style={[{ color: '#333333' }]}>{'当前打卡可能出现打卡异常'}</Text>
                            </View> */}

                            {this.isChengTaoSignIn() ? null : <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image style={{ height: 13, width: 13, marginRight: 8 }} source={require('../../../images/ic_audit_invalid.png')} />
                                <Text style={[{ color: '#333333' }]}>{'打卡异常的位置'}</Text>
                            </View>}
                            {this.isChengTaoSignIn() ? null : <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image style={{ height: 13, width: 13, marginRight: 8 }} source={require('../../../images/auditselect.png')} />
                                <Text style={[{ color: '#333333' }]}>{'无异常的打卡位置'}</Text>
                            </View>}
                        </View>
                    </View>
                </IconDialog>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
        // backgroundColor: 'red',
    }
});
