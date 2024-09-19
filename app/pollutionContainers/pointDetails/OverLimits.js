import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createNavigationOptions, NavigationActions, createAction } from '../../utils';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { SDLText, StatusPage, BaseTable } from '../../components';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';

const lineHeight = 30;
const colNum = 3;
const flexArr = [1, 1, 1];
/**
 *
 *超标限值
 */
@connect(({ pointDetails }) => ({
    overLimitsResult: pointDetails.overLimitsResult
}))
export default class OverLimits extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '排放标准值',
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
        this.props.dispatch(createAction('pointDetails/getOverLimits')({ params: { DGIMN: '' } }));
    }
    /**
     * 渲染table里面的 views
     */
    renderTableItems = () => {
        const tableItems = [];
        tableItems.push(
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <SDLText fontType={'large'} style={{ color: '#333' }}>
                    {'监测因子'}
                </SDLText>
            </View>
        );
        tableItems.push(
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <SDLText fontType={'large'} style={{ color: '#333' }}>
                    {'排放标准值'}
                </SDLText>
            </View>
        );
        tableItems.push(
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <SDLText fontType={'large'} style={{ color: '#333' }}>
                    {'单位'}
                </SDLText>
            </View>
        );
        if (this.props.overLimitsResult.status == 200) {
            this.props.overLimitsResult.data.Datas.map((item, key) => {
                tableItems.push(
                    <View key={`h_${key.toString()}`} style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <SDLText fontType={'normal'} style={{ color: '#333' }}>
                            {item.PollutantName}
                        </SDLText>
                    </View>
                );
                tableItems.push(
                    <View key={`d_${key.toString()}`} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                        <SDLText fontType={'normal'} style={{ color: '#333' }}>
                            {item.AstrictValue}
                        </SDLText>
                    </View>
                );
                tableItems.push(
                    <View key={`p_${key.toString()}`} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                        <SDLText fontType={'normal'} style={{ color: '#333' }}>
                            {item.Unit || '-'}
                        </SDLText>
                    </View>
                );
            });
        }

        return tableItems;
    };

    render() {
        // return <View style={[{ height: 200, width: SCREEN_WIDTH, backgroundColor: 'blue' }]} />;
        return (
            <StatusPage
                style={{ flex: 1 }}
                status={this.props.overLimitsResult.status}
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
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'white' }}>
                    <BaseTable style={{ padding: 5 }} lineData={this.renderTableItems()} colNum={colNum} flexArr={flexArr} borderWidth={1} borderColor={'#efefef'} height={lineHeight} />
                </View>
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({});
