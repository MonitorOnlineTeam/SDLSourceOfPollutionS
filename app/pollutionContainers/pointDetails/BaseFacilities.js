import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { PickerTouchable, Touchable, SimpleLoadingComponent, SelectButton, SDLText, StatusPage } from '../../components';
import { SentencedToEmpty, createAction, NavigationActions, createNavigationOptions } from '../../utils';
import { CURRENT_PROJECT } from '../../config';

const ic_arrows_down = require('../../images/ic_arrows_down.png');

/**
 * 基础设施设置
 */
@connect(({ enterpriseListModel }) => ({
    BaseFacilitiesResult: enterpriseListModel.BaseFacilitiesResult,
    commitBaseFac: enterpriseListModel.commitBaseFac
}))
export default class BaseFacilities extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '基础设置',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {
            User_ID: '',
            dataArray: [
                {
                    title: '进行中',
                    id: '0'
                },
                {
                    title: '已结束',
                    id: '1'
                }
            ]
        };
    }
    componentDidMount() {
        this.refresh();
    }
    getPersonSelectOption = () => {
        const dataArr = this.props.selectableMaintenanceStaff;
        return {
            codeKey: 'User_ID',
            nameKey: 'User_Name',
            defaultCode: this.state.User_ID,
            dataArr,
            onSelectListener: item => {
                this.setState({
                    User_ID: item.User_ID,
                    User_Name: item.User_Name
                });
            }
        };
    };
    refresh() {
        this.props.dispatch(
            createAction('enterpriseListModel/BaseFacilities')({
                params: {
                    DGIMN: this.props.navigation.state.params.DGIMN
                }
            })
        );
    }
    render() {
        return (
            <StatusPage
                status={this.props.BaseFacilitiesResult.status}
                style={{ alignItems: 'center' }}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.refresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.refresh();
                }}
            >
                <KeyboardAwareScrollView ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                    <View style={[styles.card]}>
                        <View style={[styles.selectRow]}>
                            <Touchable
                                onPress={() => {
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'ContactOperation',
                                            params: {
                                                selectType: 'people',
                                                callback: item => {
                                                    let data = {
                                                        data: {
                                                            Datas: [{ UserId: item.User_ID, UserName: item.title, OperationStatus: SentencedToEmpty(this.props.BaseFacilitiesResult, ['data', 'Datas', 0, 'OperationStatus'], '0') }],
                                                            Total: 0,
                                                            Status: 200
                                                        }
                                                    };
                                                    // let infodata = { ...this.props.BaseFacilitiesResult, UserName: '1', UserId: '2' };
                                                    this.props.dispatch(
                                                        createAction('enterpriseListModel/updateState')({
                                                            BaseFacilitiesResult: data
                                                        })
                                                    );
                                                }
                                            }
                                        })
                                    );
                                }}
                                style={[styles.row]}
                            >
                                <Text style={[styles.label, { color: '#333', marginRight: 42 }]}>{'运维负责人'}</Text>
                                <Text result={this.props.BaseFacilitiesResult} style={[styles.content, { color: '#666' }]}>
                                    {SentencedToEmpty(this.props.BaseFacilitiesResult, ['data', 'Datas', 0, 'UserName'], '-')}
                                </Text>
                                <Image style={{ width: 10, height: 10, marginRight: 8 }} source={require('../../images/ic_arrows_right.png')} />
                            </Touchable>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'white', marginTop: 1 }}>
                        <SDLText style={{ marginLeft: 13 }}>运维状态</SDLText>
                        <SelectButton
                            result={this.props.BaseFacilitiesResult}
                            style={{ flexDirection: 'row', width: 200, marginLeft: 10 }} //整个组件的样式----这样可以垂直和水平
                            conTainStyle={{ height: 44 }} //图片和文字的容器样式
                            WBModePic={{ select: require('../../images/xinjiangselect.png'), unselect: require('../../images/xinjiangunselect.png') }}
                            imageStyle={{ width: 18, height: 18 }} //图片样式
                            textStyle={{ color: '#666' }} //文字样式
                            // OperationStatus这个0是进行中 1已结束
                            selectIndex={SentencedToEmpty(this.props.BaseFacilitiesResult, ['data', 'Datas', 0, 'OperationStatus'], '-')} //空字符串,表示不选中,数组索引表示默认选中
                            data={this.state.dataArray} //数据源
                            onPress={(index, item) => {
                                let data = {
                                    data: {
                                        Datas: [
                                            {
                                                UserId: SentencedToEmpty(this.props.BaseFacilitiesResult, ['data', 'Datas', 0, 'UserId'], ''),
                                                UserName: SentencedToEmpty(this.props.BaseFacilitiesResult, ['data', 'Datas', 0, 'UserName'], ''),
                                                OperationStatus: item.id
                                            }
                                        ],
                                        Total: 0,
                                        Status: 200
                                    }
                                };
                                // let infodata = { ...this.props.BaseFacilitiesResult, OperationStatus: item.id };
                                this.props.dispatch(
                                    createAction('enterpriseListModel/updateState')({
                                        BaseFacilitiesResult: data
                                    })
                                );
                            }}
                        />
                    </View>
                </KeyboardAwareScrollView>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ loading: true });
                        this.props.dispatch(
                            createAction('enterpriseListModel/commitBaseFac')({
                                params: {
                                    DGIMN: this.props.navigation.state.params.DGIMN,
                                    UserID: SentencedToEmpty(this.props.BaseFacilitiesResult, ['data', 'Datas', 0, 'UserId'], ''),
                                    OperationStatus: SentencedToEmpty(this.props.BaseFacilitiesResult, ['data', 'Datas', 0, 'OperationStatus'], '0')
                                },
                                callback: () => {
                                    this.props.dispatch(NavigationActions.back());
                                }
                            })
                        );
                    }}
                    style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: globalcolor.headerBackgroundColor, marginBottom: 10, height: 50, width: SCREEN_WIDTH - 20 }}
                >
                    <Text style={{ color: 'white' }}>确定</Text>
                </TouchableOpacity>
                {this.props.commitBaseFac.status == -1 ? <SimpleLoadingComponent message={'提交中'} /> : null}
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey
    },
    card: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        paddingHorizontal: 13,
        alignItems: 'center'
    },
    icon: {
        height: 24,
        width: 24,
        marginRight: 5
    },
    row: {
        width: SCREEN_WIDTH - 38,
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    selectRow: {
        width: SCREEN_WIDTH - 26,
        height: 45,
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 15,
        color: '#d6e5ff'
    },
    content: {
        fontSize: 14,
        color: '#fdffff',
        flex: 1
    },
    rowInner: {
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#e5e5e5'
    }
});
