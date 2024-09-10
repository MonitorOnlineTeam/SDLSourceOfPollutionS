import React, { PureComponent } from 'react';
import { Text, View, Image } from 'react-native';

import PickerTouchable from './PickerTouchable';
import { SentencedToEmpty } from '../../utils';
const ic_arrows_down = require('../../images/ic_filt_arrows.png');

export default class SimplePickerTouchable extends PureComponent {
    constructor(props) {
        super(props);
        const { codeKey, nameKey, defaultCode, dataArr, onSelectListener } = this.props.option;
        let defaultIndex = -1;
        if (defaultCode)
            defaultIndex = dataArr.findIndex((item, index) => {
                return item[codeKey] == defaultCode;
            });
        this.state = {
            selectItem: dataArr[defaultIndex]
        };
        this.option = { ...this.props.option };
        this.option.onSelectListener = item => {
            this.setState({ selectItem: item });
            this.props.option.onSelectListener(item);
        };
    }

    static defaultProps = {
        lastIcon:require('../../images/ic_filt_arrows.png')
    }

    setSelectItem = item => {
        this._touchable.setSelectItem(item);
        this.setState({ selectItem: item });
    };

    setDataArr = dataArr => {
        this.option.dataArr = dataArr;
        this.setState(dataArr);
    };

    render() {
        let { placeHolder = '请选择', textStyle = {}, disImage, showName } = this.props.option;
        return (
            <PickerTouchable
                ref={ref => (this._touchable = ref)}
                option={this.option}
                style={[{ height: 45, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', minWidth: 100, paddingLeft: 12, paddingRight: 12 }, this.props.style]}
            >
                {showName == null ? (
                    <Text numberOfLines={1} style={[{ fontSize: 14, color: '#666', flex: 1, marginRight: 4, textAlign: 'right' }, this.props.textStyle]}>
                        {SentencedToEmpty(this.state.selectItem, [this.props.option.nameKey], placeHolder)}
                    </Text>
                ) : (
                    <Text numberOfLines={1} style={[{ fontSize: 14, color: '#666', flex: 1, marginRight: 4, textAlign: 'right' }, this.props.textStyle]}>
                        {SentencedToEmpty(this.state.selectItem, [this.props.option.showName], placeHolder)}
                    </Text>
                )}

                {disImage == true ? null : <Image style={{ width: 10, height: 10 }} source={this.props.lastIcon} />}
            </PickerTouchable>
        );
    }
}
