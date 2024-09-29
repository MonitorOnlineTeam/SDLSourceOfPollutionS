/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-03-28 09:53:04
 * @LastEditTime: 2024-09-26 14:17:10
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/chengTaoXiaoXi/EquipmentInstallationPicAudit.js
 */
import { Platform, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { Component } from 'react'
import { NavigationActions, SentencedToEmpty, createAction, createNavigationOptions } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../../components';
import { connect } from 'react-redux';

@connect(({ CTEquipmentPicAuditModel }) => ({
    tabSelectedIndex: CTEquipmentPicAuditModel.tabSelectedIndex,
    equipmentAuditRectificationNumResult: CTEquipmentPicAuditModel.equipmentAuditRectificationNumResult
}))
export default class EquipmentInstallationPicAudit extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '安装照片不合格',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            // tabSelectedIndex: 1,
        };
    }

    componentDidMount() {
        this.props.dispatch(
            createAction('CTEquipmentPicAuditModel/updateState')({
                tabSelectedIndex: 1
            })
        );
        this.props.dispatch(
            createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationList')({
                params: { "auditType": "1" }
            })
        );
        this.props.dispatch(createAction('CTEquipmentPicAuditModel/updateState')({
            equipmentAuditRectificationNumResult: { status: -1 }
        }));
        this.props.dispatch(createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationNum')({}));
    }

    render() {
        const topButtonWidth = SCREEN_WIDTH / 3;
        return (<StatusPage
            backRef={true}
            status={200}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                // this.statusPageOnRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                // this.statusPageOnRefresh();
            }}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <View style={[{
                    flexDirection: 'row', height: 44
                    , width: SCREEN_WIDTH, alignItems: 'center'
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white', marginBottom: 5
                }]}>
                    <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                        <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                            onPress={() => {
                                // 1 不合格 2已提交 3申诉中
                                this.props.dispatch(
                                    createAction('CTEquipmentPicAuditModel/updateState')({
                                        tabSelectedIndex: 1
                                    })
                                );
                                this.props.dispatch(
                                    createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationList')({
                                        params: { "auditType": "1" }
                                    })
                                );
                                this.props.dispatch(createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationNum')({}));
                            }}
                        >
                            <View
                                style={[{
                                    width: topButtonWidth, height: 44
                                    , alignItems: 'center'
                                }]}
                            >
                                <View style={[{
                                    width: topButtonWidth, height: 42
                                    , alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode={'head'}
                                        style={[{
                                            fontSize: 15
                                            , color: this.props.tabSelectedIndex == 1 ? '#4AA0FF' : '#666666'
                                        }]}>{`不合格${typeof SentencedToEmpty(this.props
                                            , ['equipmentAuditRectificationNumResult', 'data', 'Datas', 'UnqualifiedQuantity'], '') != 'number' ? ''
                                            : '(' + SentencedToEmpty(this.props
                                                , ['equipmentAuditRectificationNumResult', 'data', 'Datas', 'UnqualifiedQuantity'], 0) + ')'}`}</Text>
                                </View>
                                <View style={[{
                                    width: 40, height: 2
                                    , backgroundColor: this.props.tabSelectedIndex == 1 ? '#4AA0FF' : 'white'
                                }]}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                        <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                            onPress={() => {
                                // 1 不合格 2已提交 3申诉中
                                this.props.dispatch(
                                    createAction('CTEquipmentPicAuditModel/updateState')({
                                        tabSelectedIndex: 2
                                    })
                                );
                                this.props.dispatch(
                                    createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationList')({
                                        params: { "auditType": "2" }
                                    })
                                );
                                this.props.dispatch(createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationNum')({}));
                            }}
                        >
                            <View
                                style={[{
                                    width: topButtonWidth, height: 44
                                    , alignItems: 'center'
                                }]}
                            >
                                <View style={[{
                                    width: topButtonWidth, height: 42
                                    , alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode={'head'}
                                        style={[{
                                            fontSize: 15
                                            , color: this.props.tabSelectedIndex == 2 ? '#4AA0FF' : '#666666'
                                        }]}>{`已提交${typeof SentencedToEmpty(this.props
                                            , ['equipmentAuditRectificationNumResult', 'data', 'Datas', 'SubmittedQuantity'], '') != 'number' ? ''
                                            : '(' + SentencedToEmpty(this.props
                                                , ['equipmentAuditRectificationNumResult', 'data', 'Datas', 'SubmittedQuantity'], 0) + ')'}`}</Text>
                                </View>
                                <View style={[{
                                    width: 40, height: 2
                                    , backgroundColor: this.props.tabSelectedIndex == 2 ? '#4AA0FF' : 'white'
                                }]}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                        <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                            onPress={() => {
                                // 1 不合格 2已提交 3申诉中
                                this.props.dispatch(
                                    createAction('CTEquipmentPicAuditModel/updateState')({
                                        tabSelectedIndex: 3
                                    })
                                );
                                this.props.dispatch(
                                    createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationList')({
                                        params: { "auditType": "3" }
                                    })
                                );
                                this.props.dispatch(createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationNum')({}));
                            }}
                        >
                            <View
                                style={[{
                                    width: topButtonWidth, height: 44
                                    , alignItems: 'center'
                                }]}
                            >
                                <View style={[{
                                    width: topButtonWidth, height: 42
                                    , alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode={'head'}
                                        style={[{
                                            fontSize: 15
                                            , color: this.props.tabSelectedIndex == 3 ? '#4AA0FF' : '#666666'
                                        }]}>{`申诉中${typeof SentencedToEmpty(this.props
                                            , ['equipmentAuditRectificationNumResult', 'data', 'Datas', 'AppealsQuantity'], '') != 'number' ? ''
                                            : '(' + SentencedToEmpty(this.props
                                                , ['equipmentAuditRectificationNumResult', 'data', 'Datas', 'AppealsQuantity'], 0) + ')'}`}</Text>
                                </View>
                                <View style={[{
                                    width: 40, height: 2
                                    , backgroundColor: this.props.tabSelectedIndex == 3 ? '#4AA0FF' : 'white'
                                }]}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <DefectiveList listType={this.props.tabSelectedIndex} />
            </View>
        </StatusPage>)
    }
}

@connect(({ CTEquipmentPicAuditModel }) => ({
    equipmentAuditRectificationList: CTEquipmentPicAuditModel.equipmentAuditRectificationList
    , equipmentAuditRectificationListResult: CTEquipmentPicAuditModel.equipmentAuditRectificationListResult
}))
class DefectiveList extends Component {

    getIcon = (item) => {
        const Status = item.Status;
        if (Status == 1) {
            return require('../../../images/ic_photo_unqualified.png');
        } else if (Status == 2) {
            return require('../../../images/ic_photo_submit.png');
        } else if (Status == 3) {
            return require('../../../images/ic_photo_appeal.png');
        } else {
            return require('../../../images/ic_photo_unqualified.png');
        }
    }

    renderItem = ({ item, index }) => {
        if (this.props.listType != 3) {
            return (<TouchableOpacity
                onPress={() => {
                    this.props.dispatch(NavigationActions.navigate({
                        routeName: 'EquipmentInstallationPicAuditEditor',
                        params: {
                            data: item
                        }
                    }));
                }}
            >
                <View style={[{
                    width: SCREEN_WIDTH - 20, height: 110
                    , marginLeft: 10
                    , borderRadius: 5, backgroundColor: 'white'
                    , alignItems: 'center'
                }]}>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 46, height: 57
                            , backgroundColor: '#F9F9F9', flexDirection: 'row'
                            , alignItems: 'center', marginTop: 15
                            , marginBottom: 4
                        }]}
                    >
                        <View
                            style={[{
                                width: (SCREEN_WIDTH - 46) / 4
                                , alignItems: 'center'
                            }]}
                        >
                            <Text
                                style={[{
                                    fontSize: 10, color: '#999999'
                                    , marginBottom: 4
                                }]}
                            >{'监测点'}</Text>
                            <Text
                                numberOfLines={1}
                                style={[{
                                    fontSize: 11, color: '#4AA0FF'
                                    , width: (SCREEN_WIDTH - 46) / 4
                                    , textAlign: 'center'
                                }]}
                            >{`${SentencedToEmpty(item, ['PointName'], '--')}`}</Text>

                        </View>
                        <View
                            style={[{
                                width: (SCREEN_WIDTH - 46) * 3 / 8
                                , alignItems: 'center'
                            }]}
                        >
                            <Text
                                style={[{
                                    fontSize: 10, color: '#999999'
                                    , marginBottom: 4
                                }]}
                            >{'企业名称'}</Text>
                            <Text
                                numberOfLines={1}
                                style={[{
                                    fontSize: 11, color: '#666666'
                                    , width: (SCREEN_WIDTH - 46) * 3 / 8
                                    , textAlign: 'center'
                                }]}
                            >{`${SentencedToEmpty(item, ['EntName'], '--')}`}</Text>
                        </View>
                        <View
                            style={[{
                                width: (SCREEN_WIDTH - 46) * 3 / 8
                                , alignItems: 'center'
                            }]}
                        >
                            <Text
                                style={[{
                                    fontSize: 10, color: '#999999'
                                    , marginBottom: 4
                                }]}
                            >{'项目编号'}</Text>
                            <Text
                                numberOfLines={1}
                                style={[{
                                    fontSize: 11, color: '#666666'
                                    , width: (SCREEN_WIDTH - 46) * 3 / 8
                                    , textAlign: 'center'
                                }]}
                            >{`${SentencedToEmpty(item, ['ProjectCode'], '--')}`}</Text>
                        </View>
                    </View>
                    <View
                        style={[{
                            flexDirection: 'row', width: SCREEN_WIDTH - 46
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 12, color: '#666666'
                                , width: (SCREEN_WIDTH - 46) * 3 / 8
                            }]}
                        >{`审核人:${SentencedToEmpty(item, ['AuditUserUserName'], '--')}`}</Text>
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 12, color: '#666666'
                                , width: (SCREEN_WIDTH - 46) / 2
                            }]}
                        >{`审核时间:${SentencedToEmpty(item, ['AuditTime'], '--')}`}</Text>
                    </View>
                    <Image
                        source={this.getIcon(item)}
                        style={[{
                            width: 50, height: 50
                            , position: 'absolute', right: 0, top: 0
                        }]}
                    />
                </View>
            </TouchableOpacity >);
        } else {
            return (<View style={[{
                width: SCREEN_WIDTH - 20, height: 110
                , marginLeft: 10
                , borderRadius: 5, backgroundColor: 'white'
                , alignItems: 'center'
            }]}>
                <View
                    style={[{
                        width: SCREEN_WIDTH - 46, height: 57
                        , backgroundColor: '#F9F9F9', flexDirection: 'row'
                        , alignItems: 'center', marginTop: 15
                        , marginBottom: 4
                    }]}
                >
                    <View
                        style={[{
                            width: (SCREEN_WIDTH - 46) / 4
                            , alignItems: 'center'
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 10, color: '#999999'
                                , marginBottom: 4
                            }]}
                        >{'监测点'}</Text>
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 11, color: '#4AA0FF'
                                , width: (SCREEN_WIDTH - 46) / 4
                                , textAlign: 'center'
                            }]}
                        >{`${SentencedToEmpty(item, ['PointName'], '--')}`}</Text>

                    </View>
                    <View
                        style={[{
                            width: (SCREEN_WIDTH - 46) * 3 / 8
                            , alignItems: 'center'
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 10, color: '#999999'
                                , marginBottom: 4
                            }]}
                        >{'企业名称'}</Text>
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 11, color: '#666666'
                                , width: (SCREEN_WIDTH - 46) * 3 / 8
                                , textAlign: 'center'
                            }]}
                        >{`${SentencedToEmpty(item, ['EntName'], '--')}`}</Text>
                    </View>
                    <View
                        style={[{
                            width: (SCREEN_WIDTH - 46) * 3 / 8
                            , alignItems: 'center'
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 10, color: '#999999'
                                , marginBottom: 4
                            }]}
                        >{'项目编号'}</Text>
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 11, color: '#666666'
                                , width: (SCREEN_WIDTH - 46) * 3 / 8
                                , textAlign: 'center'
                            }]}
                        >{`${SentencedToEmpty(item, ['ProjectCode'], '--')}`}</Text>
                    </View>
                </View>
                <View
                    style={[{
                        flexDirection: 'row', width: SCREEN_WIDTH - 46
                        , justifyContent: 'space-between'
                    }]}
                >
                    <Text
                        numberOfLines={1}
                        style={[{
                            fontSize: 12, color: '#666666'
                            , width: (SCREEN_WIDTH - 46) * 3 / 8
                        }]}
                    >{`审核人:${SentencedToEmpty(item, ['AuditUserUserName'], '--')}`}</Text>
                    <Text
                        numberOfLines={1}
                        style={[{
                            fontSize: 12, color: '#666666'
                            , width: (SCREEN_WIDTH - 46) * 3 / 8
                        }]}
                    >{`审核时间:${SentencedToEmpty(item, ['AuditTime'], '--')}`}</Text>
                </View>
                <Image
                    source={this.getIcon(item)}
                    style={[{
                        width: 50, height: 50
                        , position: 'absolute', right: 0, top: 0
                    }]}
                />
            </View>);
        }
    }

    onRefresh = (listType) => {
        this.props.dispatch(
            createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationList')({
                params: { "auditType": listType },
                setListData: this.list.setListData
            })
        );
        this.props.dispatch(createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationNum')({}));
    }

    getPageStatus = () => {
        return SentencedToEmpty(this.props
            , ['equipmentAuditRectificationListResult', 'status']
            , 1000);
    }

    onRefreshWithLoading = () => {
        this.props.dispatch(
            createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationList')({
                params: { "auditType": this.props.listType }
            })
        );
        this.props.dispatch(createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationNum')({}));
    }

    render() {
        return (<StatusPage
            status={this.getPageStatus()}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                this.onRefreshWithLoading();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.onRefreshWithLoading();
            }}
        >
            <FlatListWithHeaderAndFooter
                style={[{ backgroundColor: '#f2f2f2' }]}
                ref={ref => (this.list = ref)}
                ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                pageSize={20}
                hasMore={() => {
                    // return this.props.unhandleTaskListData.length < this.props.unhandleTaskListTotal;
                    return false;
                }}
                onRefresh={index => {
                    this.onRefresh(this.props.listType);
                }}
                onEndReached={index => {
                    // this.props.dispatch(createAction('taskModel/updateState')({ unhandleTaskListPageIndex: index }));
                    // this.props.dispatch(createAction('taskModel/getUnhandleTaskList')({ setListData: this.list.setListData }));
                }}
                renderItem={this.renderItem}
                data={SentencedToEmpty(this.props
                    , ['equipmentAuditRectificationList'], [])}
            />
        </StatusPage>);
    }
}