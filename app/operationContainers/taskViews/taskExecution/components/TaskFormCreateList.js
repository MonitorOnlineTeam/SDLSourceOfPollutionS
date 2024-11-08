//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TouchableWithoutFeedback, Animated, } from 'react-native';

import { connect } from 'react-redux';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH, SCREEN_HEIGHT, little_font_size, WINDOW_HEIGHT, NOSTATUSHEIGHT } from '../../../../config/globalsize';
import { createAction, ShowToast } from '../../../../utils';
/**
 * 对比点选择dialog
*/
// create a component
@connect(({ taskModel }) => ({
    TaskDetail: taskModel.currentTask,
    TaskFormList: taskModel.TaskFormList,
}))
class TaskFormCreateList extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            time: this.props.time,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    _renderItem = (item, index) => {
        /**由于吴建伟将已创建的表单与待创建的表单回合返回，这里需要过滤*/
        if (!item.FormMainID) {
            index.a = index.a + 1;
            return (<TouchableOpacity key={index}
                onPress={() => {
                    this.props.showConfirmDialog(item);
                }}>
                <View style={[{ width: SCREEN_WIDTH, height: 40, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: globalcolor.lightGreyBackground }]}>
                    <View style={{
                        backgroundColor: globalcolor.datepickerGreyText, marginHorizontal: 8, height: 17, width: 17, borderRadius: 3,
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Text style={{ color: globalcolor.whiteFont, fontSize: 14, textAlign: 'center', }}>{index.a - 1}</Text>
                    </View>
                    <Text style={[{ color: '#333333' }]}>{item.CnName}</Text>
                </View>
            </TouchableOpacity>);
        }
    }

    render() {
        let _index = { a: 1 };
        return (
            <View style={[styles.container]}>
                <Text style={[{ color: globalcolor.antBlue, marginTop: 24, }]}>选择需要创建的表单</Text>
                <FlatList
                    keyExtractor={(item, index) => index + ''}
                    showsVerticalScrollIndicator={false}
                    style={[{ width: SCREEN_WIDTH * 3 / 4 - 20, flex: 1, marginHorizontal: 10, marginVertical: 8, }]}
                    data={this.props.TaskFormList ? this.props.TaskFormList : []}
                    renderItem={({ item, index }) => this._renderItem(item, _index)}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: SCREEN_HEIGHT / 2,
        width: SCREEN_WIDTH * 3 / 4,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TaskFormCreateList;
