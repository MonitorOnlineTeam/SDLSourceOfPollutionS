import React, { PureComponent } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
// import { createStackNavigator, NavigationActions } from 'react-navigation';

import MapPopContent from './MapPopContent';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction } from '../../../../utils';
import { StatusPagem, Touchable, BaseTable, SDLText } from '../../../../components';
import { NavigationActions } from '../../../../utils/RouterUtils';

/**
 * 地图气泡 container 显示站点名字 关闭按钮 常看详情按钮
 */
@connect(({ map }) => ({
    selectPoint: map.selectPoint
}))
export default class MapPopContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    /** 点击站点进行跳转 */
    clickPoint = selectPoint => {
        const { PointName = '名称', DGIMN = '', MTAbbreviation: Abbreviation = '', MonitorTargetName: TargetName = '' } = selectPoint;
        this.props.dispatch(NavigationActions.navigate({ routeName: 'PointDetail', params: { DGIMN, Abbreviation, TargetName, PointName } }));
    };

    render() {
        const { selectPoint } = this.props;
        const { showPollutantNum } = this.props;

        const { pointInfo } = this.props;
        const { height } = this.props; //这个是气泡的高度，很重要

        if (selectPoint && pointInfo && selectPoint.DGIMN == pointInfo.DGIMN) {
            //确定为当前站点则进行渲染
            const { PointName = '名称', DGIMN = '' } = selectPoint;
            return (
                <View style={[styles.customInfoWindow, { height }]}>
                    {/* 头部信息 */}
                    <View style={{ justifyContent: 'space-between', height: 32, flexDirection: 'row' }}>
                        <Touchable
                            style={{ width: 32, height: 32, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}
                            onPress={() => {
                                this.props.onDismiss();
                            }}
                        >
                            <Image style={{ width: 18, height: 18, marginTop: 10, marginLeft: 6 }} source={require('../../../../images/mapclose.png')} />
                        </Touchable>
                        <View style={{ width: 175 }}>
                            <SDLText fontType={'large'} numberOfLines={1} style={{ alignSelf: 'center', marginTop: 10, color: '#333' }}>
                                {PointName}
                            </SDLText>
                        </View>

                        <Touchable
                            style={{ width: 32, height: 32, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end' }}
                            onPress={() => {
                                this.clickPoint(selectPoint);
                            }}
                        >
                            <Image style={{ width: 18, height: 18, marginTop: 10, marginRight: 6 }} source={require('../../../../images/xinxi.png')} />
                        </Touchable>
                    </View>
                    {<MapPopContent showPollutantNum={showPollutantNum} />}
                </View>
            );
        }
        //不是当前站点返回一个view 注意view的大小尺寸与上面的一样 否则气泡跑到地图左上角
        return <View style={[styles.customInfoWindow, { height }]} />;
    }
}

const styles = StyleSheet.create({
    customInfoWindow: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderColor: 'white',
        width: 305
    }
});
