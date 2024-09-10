import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Platform, Image, TextInput, TouchableOpacity } from 'react-native';
import { Button, StatusPage, Contact, LineSelectBar, SimpleLoadingComponent } from '../../components';
import { connect } from 'react-redux';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../utils';
import { CURRENT_PROJECT } from '../../config';
import { SCREEN_WIDTH } from '../../components/SDLPicker/constant/globalsize';

@connect(({ taskModel }) => ({
    selectablePart: taskModel.selectablePart,
    searchtablePart: taskModel.searchtablePart
}))
class SelectSearchList extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({

            title: navigation.state.params.tableType == 'Storehouse' ? '仓库列表'
                : navigation.state.params.tableType == 'MachineryMaintenance' ? '保养项目'
                    : navigation.state.params.tableType == 'SparePart' ? '备件列表'
                        // : navigation.state.params.tableType == 'StandardGas' ? '标气列表' 
                        : navigation.state.params.tableType == 'StandardGas' ? '标准物质'
                            : navigation.state.params.tableType == 'StandardLiquid' ? '试剂列表' : '易耗品列表',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    constructor(props) {
        super(props);
        this.state = {
            targetType: '1'
        };
    }
    _renderItemList = item => {
        // 仓库
        if (this.props.navigation.state.params.tableType == 'Storehouse') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    {/* <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['StorehouseName']}`}</Text> */}
                    <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${SentencedToEmpty(item, ['item', 'dbo.T_Bas_Storehouse.StorehouseName'], '仓库名为空')}`}</Text>
                    <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${SentencedToEmpty(item, ['item', 'dbo.T_Bas_Storehouse.StorehouseAddress'], '-----')}`}</Text>
                </TouchableOpacity>
            );
        }

        if (this.props.navigation.state.params.tableType == 'StandardGas') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['StandardGasName']}  ${item.item['StandardGasCode']}`}</Text>
                    <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${item.item['Manufacturer']}  ${item.item['Component']}`}</Text>
                </TouchableOpacity>
            );
        }
        if (this.props.navigation.state.params.tableType == 'StandardLiquid') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['StandardGasName']}  ${item.item['StandardGasCode']}`}</Text>
                    <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${item.item['Manufacturer']}  ${item.item['Component']}`}</Text>
                </TouchableOpacity>
            );
        }

        if (this.props.navigation.state.params.tableType == 'MachineryMaintenance') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <Text style={[{ marginLeft: 20, color: '#666666', fontSize: 14, lineHeight: 18 }]}>{`${item.item['dbo.T_Cod_MaintainBase.MaintainName']}`}</Text>
                </TouchableOpacity>
            );
        }
        // 备件 SparePart 易耗品 Consumables
        if (this.props.navigation.state.params.tableType == 'SparePart'
            || this.props.navigation.state.params.tableType == 'Consumables') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['PartName']}-${item.item['PartCode']}`}</Text>
                    <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${item.item['Code']}`}</Text>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    minHeight: 55,
                    marginBottom: 1,
                    justifyContent: 'center'
                }}
                onPress={() => {
                    if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                        this.props.navigation.state.params.callback(item.item);
                    }
                    this.props.dispatch(NavigationActions.back());
                }}
            >
                <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['dbo.T_Bas_SpareParts.PartName']}-${item.item['dbo.T_Bas_SpareParts.Code']}`}</Text>
                <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${item.item['dbo.T_Bas_SpareParts.Manufacturer']}`}</Text>
            </TouchableOpacity>
        );
    };

    _renderSearchItem = item => {

        if (this.props.navigation.state.params.tableType == 'Storehouse') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    {/* <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['StorehouseName']}`}</Text> */}
                    <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${SentencedToEmpty(item, ['item', 'dbo.T_Bas_Storehouse.StorehouseName'], '仓库名为空')}`}</Text>
                    <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${`${SentencedToEmpty(item, ['item', 'dbo.T_Bas_Storehouse.StorehouseAddress'], '-----')}`}`}</Text>
                </TouchableOpacity>
            );
        }

        if (this.props.navigation.state.params.tableType == 'SparePart'
            || this.props.navigation.state.params.tableType == 'Consumables') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['PartName']}-${item.item['PartCode']}`}</Text>
                    <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${item.item['Code']}`}</Text>
                </TouchableOpacity>
            );
        }
        if (this.props.navigation.state.params.tableType == 'StandardGas') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['StandardGasName']}  ${item.item['StandardGasCode']}`}</Text>
                    <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${item.item['Manufacturer']}  ${item.item['StandardGasDensity']}`}</Text>
                </TouchableOpacity>
            );
        }
        if (this.props.navigation.state.params.tableType == 'StandardLiquid') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['StandardGasName']}  ${item.item['StandardGasCode']}`}</Text>
                    <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${item.item['Manufacturer']}  ${item.item['Component']}`}</Text>
                </TouchableOpacity>
            );
        }
        if (this.props.navigation.state.params.tableType == 'MachineryMaintenance') {
            return (
                <TouchableOpacity
                    style={{
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        flex: 1,
                        minHeight: 55,
                        marginBottom: 1,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                            this.props.navigation.state.params.callback(item.item);
                        }
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <Text style={[{ marginLeft: 20, color: '#666666', fontSize: 14, lineHeight: 18 }]}>{`${item.item['dbo.T_Cod_MaintainBase.MaintainName']}`}</Text>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    minHeight: 55,
                    marginBottom: 1,
                    justifyContent: 'center'
                }}
                onPress={() => {
                    if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                        this.props.navigation.state.params.callback(item.item);
                    }
                    this.props.dispatch(NavigationActions.back());
                }}
            >
                <Text style={[{ marginLeft: 20, color: '#333333', fontSize: 14, lineHeight: 18 }]}>{`${item.item['dbo.T_Bas_SpareParts.PartName']}-${item.item['dbo.T_Bas_SpareParts.Code']}`}</Text>
                <Text style={[{ marginLeft: 20, marginTop: 5, color: '#666666', fontSize: 12, lineHeight: 16 }]}>{`${item.item['dbo.T_Bas_SpareParts.PartCode']}`}</Text>
            </TouchableOpacity>
        );
    };

    componentDidMount() {
        this.onFreshData();
    }
    onFreshData = () => {
        switch (this.props.navigation.state.params.tableType) {
            case 'Storehouse': // 获取仓库列表
                this.props.dispatch(createAction('taskModel/updateState')({ 'selectablePart': { status: -1 } }));
                this.props.dispatch(
                    createAction('taskModel/getStorehouse')({})
                );
                return;
            case 'SparePart': //备品备件
                // TextKey: '', 不查询
                this.props.dispatch(createAction('taskModel/updateState')({
                    searchtablePart: { status: 200, data: { data: [] } },
                    selectablePart: { status: 200, data: { data: [] } }
                }));
                // this.props.dispatch(createAction('taskModel/updateState')({ 'selectablePart': { status: -1 } }));
                // this.props.dispatch(
                //     createAction('taskModel/getSparePartsList')({
                //         params: {
                //             SparePartsStationCode: this.props.navigation.state.params.selectedStorehouseCode,
                //             // PartName: '',
                //             TextKey: '',
                //             isUsed: 1,
                //         }
                //     })
                // );
                return;
            case 'Consumables': //易耗品表单
                this.props.dispatch(createAction('taskModel/updateState')({
                    searchtablePart: { status: 200, data: { data: [] } },
                    selectablePart: { status: 200, data: { data: [] } }
                }));
                // this.props.dispatch(createAction('taskModel/updateState')({ 'selectablePart': { status: -1 } }));
                // this.props.dispatch(
                //     createAction('taskModel/getSparePartsList')({
                //         params: {
                //             SparePartsStationCode: this.props.navigation.state.params.selectedStorehouseCode,
                //             // PartName: '',
                //             TextKey: '',
                //             isUsed: 1,
                //         }
                //     })
                // );
                return;

            // this.props.dispatch(
            //     createAction('taskModel/getTablePart')({
            //         params: {
            //             IsPaging: true,
            //             ConfigId: 'ConsumablesManage',
            //             ConditionWhere:
            //                 '{"Rel":"and","Group":[{"Key":"dbo.T_Bas_SpareParts.PartName","Value":"","Where":"$like"},{"Key":"dbo.T_Bas_SpareParts.EquipmentType","Value":"2","Where":"$="},{"Key":"dbo.T_Bas_SpareParts.IsUsed","Value":"1","Where":"$="}]}',
            //             IsAsc: true,
            //             PageIndex: 1,
            //             PageSize: 20
            //         }
            //     })
            // );
            case 'StandardGas': //标气选择
                // PartType  1.标气2.标液  ，PartName 存货编码或名称
                this.props.dispatch(createAction('taskModel/updateState')({ 'selectablePart': { status: 200 } }));
                // this.props.dispatch(
                //     createAction('taskModel/getStandardGasList')({
                //         params: {
                //            PartType:1,
                //            PartName:'' 
                //         }
                //     })
                // );
                return;
            case 'StandardLiquid': // 污水 标液 试剂更换
                // PartType  1.标气2.标液  ，PartName 存货编码或名称
                this.props.dispatch(createAction('taskModel/updateState')({ 'selectablePart': { status: 200 } }));
                // this.props.dispatch(
                //     createAction('taskModel/getStandardGasList')({
                //         params: {
                //            PartType:2,
                //            PartName:'' 
                //         }
                //     })
                // );
                return;
            case 'MachineryMaintenance': //设备保养记录
                this.props.dispatch(createAction('taskModel/updateState')({ 'selectablePart': { status: -1 } }));
                this.props.dispatch(
                    createAction('taskModel/getTablePart')({
                        params: {
                            IsPaging: true,
                            ConfigId: 'MaintainBase',
                            ConditionWhere:
                                '{"Rel":"and","Group":[{"Key":"dbo.T_Cod_MaintainBase.MaintainName","Value":"","Where":"$like"},{"Key":"dbo.T_Cod_MaintainBase.EquipmentType","Value":"2","Where":"$="},{"Key":"dbo.T_Cod_MaintainBase.IsUsed","Value":"1","Where":"$="}]}',
                            IsAsc: true,
                            PageIndex: 1,
                            PageSize: 20
                        }
                    })
                );
                return;
        }
    };
    searchData = item => {
        console.log('searchData');
        let jsonValue = {};
        let ConfigId = '';
        switch (this.props.navigation.state.params.tableType) {
            case 'Storehouse':
                let arr = SentencedToEmpty(this.props.selectablePart, ['data', 'data'], []).filter(record => {
                    return record['dbo.T_Bas_Storehouse.StorehouseName'].indexOf(item) != -1;
                })
                let result = { data: { data: arr } };
                this.props.dispatch(createAction('taskModel/updateState')({ searchtablePart: result }))
                // searchtablePart
                break;
            case 'StandardGas': //标准气体
                jsonValue = { Rel: 'and', Group: [{ Key: 'dbo.T_Bas_StandardGas.StandardGasName', Value: item, Where: '$like' }, { Key: 'dbo.T_Bas_StandardGas.IsUsed', Value: '1', Where: '$=' }] };
                ConfigId = 'StandardGasManage';
                break;
            case 'MachineryMaintenance': //设备保养
                jsonValue = {
                    Rel: 'and',
                    Group: [
                        { Key: 'dbo.T_Cod_MaintainBase.MaintainName', Value: item, Where: '$like' },
                        { Key: 'dbo.T_Cod_MaintainBase.EquipmentType', Value: '2', Where: '$=' },
                        { Key: 'dbo.T_Cod_MaintainBase.IsUsed', Value: '1', Where: '$=' }
                    ]
                };
                ConfigId = 'MaintainBase';
                break;
        }
        // SparePart 备件 Consumables 易耗品
        if (this.props.navigation.state.params.tableType == 'Storehouse') {

        } else if (this.props.navigation.state.params.tableType == 'SparePart') {
            if (typeof item == 'string' && item.length > 0) {
                this.props.dispatch(
                    createAction('taskModel/getSparePartsList')({
                        params: {
                            SparePartsStationCode: this.props.navigation.state.params.selectedStorehouseCode,
                            // PartName: item,
                            TextKey: item,
                            isUsed: 1,
                        }
                    })
                );
            } else {
                this.props.dispatch(createAction('taskModel/updateState')({
                    searchtablePart: { status: 200, data: { data: [] } },
                    selectablePart: { status: 200, data: { data: [] } }
                }));
            }
        } else if (this.props.navigation.state.params.tableType == 'Consumables') {
            this.props.dispatch(
                createAction('taskModel/getSparePartsList')({
                    params: {
                        SparePartsStationCode: this.props.navigation.state.params.selectedStorehouseCode,
                        // PartName: item,
                        TextKey: item,
                        isUsed: 1,
                    }
                })
            );
        } else if (this.props.navigation.state.params.tableType == 'StandardGas') {
            //标准气体
            // PartType  1.标气2.标液  ，PartName 存货编码或名称
            this.props.dispatch(createAction('taskModel/updateState')({
                searchtablePart: { status: -1, data: null }
            }));
            this.props.dispatch(
                createAction('taskModel/getStandardGasList')({
                    params: {
                        PartType: 1,
                        PartName: item
                    }
                })
            );
        } else if (this.props.navigation.state.params.tableType == 'StandardLiquid') {
            // 污水 标准物质
            // PartType  1.标气2.标液  ，PartName 存货编码或名称
            this.props.dispatch(createAction('taskModel/updateState')({
                searchtablePart: { status: -1, data: null }
            }));
            this.props.dispatch(
                createAction('taskModel/getStandardGasList')({
                    params: {
                        PartType: 2,
                        PartName: item
                    }
                })
            );
        } else {
            this.props.dispatch(
                createAction('taskModel/searchPart')({
                    params: {
                        IsPaging: true,
                        ConfigId: ConfigId,
                        ConditionWhere: JSON.stringify(jsonValue),
                        IsAsc: true,
                        PageIndex: 1,
                        PageSize: 20
                    }
                })
            );
        }
    };
    render() {
        return (
            <StatusPage
                status={this.props.selectablePart.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.onFreshData();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onFreshData();
                }}
            >
                {this.props.selectablePart.status == 200 ? (
                    <Contact
                        searchPlaceholder={
                            this.props.navigation.state.params.tableType == 'StandardGas'
                                || this.props.navigation.state.params.tableType == 'StandardLiquid'
                                ? '请输入物料编码、物料名称搜索'
                                : '请输入关键字搜索'
                        }
                        // secType={'enterprise'} //查询页面的类型，默认不传是带右侧索引的带分组的，如不需要索引和分组传任意字符
                        secType={this.props.navigation.state.params.tableType} //查询页面的类型，默认不传是带右侧索引的带分组的，如不需要索引和分组传任意字符
                        flatData={SentencedToEmpty(this.props, ['selectablePart', 'data', 'data'], [])} //FlatList数据
                        renderItem={this._renderItemList}
                        searchResult={this.props.searchtablePart.data ? this.props.searchtablePart.data.data : []}
                        renderSearchItem={this._renderSearchItem}
                        SearchCallback={item => {
                            console.log('SearchCallback');
                            //搜索按钮的回调
                            this.searchData(item);
                        }}
                        ListHeaderComponent={null}
                        ListHeaderComponentHeight={0}
                        ItemHeight={50}
                    />
                ) : null}
                {this.props.searchtablePart.status == -1 ? <SimpleLoadingComponent message={'搜索中...'} /> : null}
            </StatusPage>
        );
    }
}

export default SelectSearchList;
