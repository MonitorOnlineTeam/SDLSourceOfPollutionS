import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';
import { connect } from 'react-redux';

import { saveSwitchToken, getSwitchToken } from '../../../dvapack/storage';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction } from '../../../utils';
import { Touchable } from '../../../components';
import PollutionMap from './PollutionMap';
import MapList from './MapList';
import { NavigationActions } from '../../../utils/RouterUtils';

/**
 * 地图
 * @class Audit
 * @extends {Component}
 */
@connect(({ map }) => ({
    curPage: map.curPage,
}))
class PollutionAll extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     let name = '监控';
    //     let leftImg = require('../../../images/ic_map.png');
    //     if (navigation.state.params && navigation.state.params.curPage && navigation.state.params.curPage) {
    //         if (navigation.state.params.curPage == 'map') {
    //             name = '地图';
    //             leftImg = require('../../../images/ic_map_list.png');
    //         }
    //     } else if (getSwitchToken() && getSwitchToken().mapPageDefSwitch == 'map') {
    //         name = '地图';
    //         leftImg = require('../../../images/ic_map_list.png');
    //     }
    //     return {
    //         headerLeft: (
    //             <Touchable
    //                 style={{ width: 44, height: 40, alignItems: 'center', justifyContent: 'center' }}
    //                 onPress={() => {
    //                     navigation.state.params.navigateLeftPress();
    //                 }}
    //             >
    //                 <Image style={{ width: 18, height: 18 }} source={leftImg} />
    //             </Touchable>
    //         ),
    //         ...createNavigationOptions({
    //             title: name,
    //             headerRight: (
    //                 <Touchable
    //                     style={{ width: 44, height: 40, alignItems: 'center', justifyContent: 'center' }}
    //                     onPress={() => {
    //                         navigation.state.params.navigateSearchPress();
    //                     }}
    //                 >
    //                     <Image style={{ width: 18, height: 18 }} source={require('../../../images/ic_search.png')} />
    //                 </Touchable>
    //             )
    //         })
    //     };
    // };
    constructor(props) {
        super(props);
        let mapPageDefSwitch = 'list';
        if (getSwitchToken() && getSwitchToken().mapPageDefSwitch == 'map') {
            mapPageDefSwitch = 'map';
        }
        // this.state = { curPage: mapPageDefSwitch };
        // this.props.navigation.setParams({
        //     curPage: this.state.curPage,
        //     navigateLeftPress: () => {
        //         if (this.state.curPage == 'map') {
        //             this.props.navigation.setParams({ curPage: 'list' });
        //             this.setState({ curPage: 'list' });
        //             saveSwitchToken({ mapPageDefSwitch: 'list' });
        //         } else {
        //             this.props.navigation.setParams({ curPage: 'map' });
        //             this.setState({ curPage: 'map' });
        //             saveSwitchToken({ mapPageDefSwitch: 'map' });
        //         }
        //     },
        //     navigateSearchPress: () => {
        //         this.props.dispatch(NavigationActions.navigate({ routeName: 'SearchList' }));
        //     }
        // });
    }

    componentDidMount() {
        let source = 'mapList'; //判断是地图页面还是列表页面
        if (getSwitchToken() && getSwitchToken().mapPageDefSwitch == 'map') {
            source = 'map';
        }
        this.props.dispatch(createAction('map/loadEntListFirstTime')({ params: { source } })); //首次加载
        this.props.dispatch(createAction('map/GetPhoneMapLegend')({ params: {} })); //获取图例
    }

    render() {
        // return (<View><Text>map</Text></View>)
        if (this.props.curPage == 'map') return <PollutionMap />;
        else return <MapList />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});

// export default createStackNavigator({ PollutionAll });
export default PollutionAll;
