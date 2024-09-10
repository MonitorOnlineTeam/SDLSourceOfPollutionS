/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2020-08-26 09:28:38
 * @LastEditTime: 2024-06-20 11:30:28
 * @FilePath: /SDLMainProject37/app/components/LandscapeComponents/SimpleLandscapeMultipleItemPicker.js
 */
import React, { PureComponent } from 'react';
import { Text, View, Image } from 'react-native';

import MoreSelectTouchable from '../form/MoreSelectTouchable';
const ic_arrows_down = require('../../images/ic_filt_arrows.png');

export default class SimpleLandscapeMultipleItemPicker extends PureComponent {

    static defaultProps = {
        orientation: 'Portrait'
    }

    constructor(props) {
        super(props);
        let { placeHolderStr = '请选择', selectCode = [], dataArr = [], codeKey, nameKey } = props.option;
        let showString = '';
        selectCode.map(item => {
            dataArr.map(dataArrItem => {
                if (dataArrItem[codeKey] == item) {
                    if (showString == '') {
                        showString = dataArrItem[nameKey];
                    } else {
                        showString = showString + ',' + dataArrItem[nameKey];
                    }
                }
            });
        });
        this.state = {
            selectedItemsNameStr: showString || placeHolderStr
        };
        this.option = { ...this.props.option };
        this.option.callback = ({ selectData, selectCode, selectNameStr, selectCodeStr }) => {
            this.setState({ selectedItemsNameStr: selectNameStr });
            this.props.option.callback({ selectData, selectCode, selectNameStr, selectCodeStr });
        };
    }
    /**
     * contentWidth的计算方法
     * 不修改paddingLeft paddingRight的情况下
     * 控件宽度（默认100）-12*2-10
     * 默认两侧padding 12，右侧图标宽度10
     */

    selectItems = selectCode => {
        let { placeHolderStr = '请选择' } = this.props.option;
        let showString = '';
        selectCode.map(item => {
            this.props.option.dataArr.map(dataArrItem => {
                if (dataArrItem[this.props.option.codeKey] == item) {
                    if (showString == '') {
                        showString = dataArrItem[this.props.option.nameKey];
                    } else {
                        showString = showString + ',' + dataArrItem[this.props.option.nameKey];
                    }
                }
            });
        });
        this.setState({ selectedItemsNameStr: showString || placeHolderStr });
        this._picker.selectItems(selectCode);
    };
    render() {
        let { textStyle = {}, hideImg } = this.props.option;
        return (
            <MoreSelectTouchable
                orientation={this.props.orientation}
                ref={ref => (this._picker = ref)}
                option={this.option}
                style={[{ flexDirection: 'row', width: 100, justifyContent: 'space-between', height: 45, alignItems: 'center', paddingLeft: 12, paddingRight: 12 }, this.props.style]}
            >
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{ fontSize: 14, color: '#666', width: this.props.option.contentWidth || 66, textAlign: 'right' }, this.props.textStyle, {}]}>
                    {this.props.option.selectName || this.state.selectedItemsNameStr}
                </Text>
                {hideImg == true ? null : <Image style={{ width: 10, height: 10 }} source={ic_arrows_down} />}
            </MoreSelectTouchable>
        );
    }
}
