import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { DeviceEventEmitter } from 'react-native';
export default class SelectButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: this.props.selectIndex ? this.props.selectIndex : null,
            data: this.props.data ? this.props.data : [{ title: '男' }, { title: '女' }],
            isChecked: this.props.isChecked,
            currentNum: this.props.currentNum,
            WBModePic: this.props.WBModePic ? this.props.WBModePic : { select: require('../images/auditselect.png'), unselect: require('../images/auditunslect.png') }
        };
        // this.WBModePic = {

        // };
    }

    clear() {
        this.setState({ selectIndex: null });
        this.onPress(-1, '');
    }
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('changeStatus', item => {
            this.setState({ currentNum: item });
        });
    }
    render() {
        let newArray = this.state.data;
        return (
            <View style={[this.props.style]}>
                {this.props.selectStyle == 'More' ? (
                    <TouchableHighlight style={[this.props.style]} onPress={() => this.onClick()} underlayColor="transparent">
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%', height: 40 }}>
                            {this._renderLeft()}
                            {this._renderImage()}
                            {this._renderRight()}
                        </View>
                    </TouchableHighlight>
                ) : (
                    <View style={[this.props.style, { alignItems: 'center', justifyContent: 'space-between' }]}>{newArray.map((item, index) => this.renderRadioButton(newArray, item, this.onPress, index, this.state.selectIndex))}</View>
                )}
            </View>
        );
    }
    //多选框
    /**
     * propTypes是React内部提供的校验器,如果通过props传过的数据与之不匹配,则会抛出异常。
     *
     */
    // static propTypes = {
    //     ...View.propTypes,
    //     leftText: React.PropTypes.string,
    //     leftTextView: React.PropTypes.element,
    //     rightText: React.PropTypes.string,
    //     leftTextStyle: Text.propTypes.style,
    //     rightTextView: React.PropTypes.element,
    //     rightTextStyle: Text.propTypes.style,
    //     checkedImage: React.PropTypes.element,
    //     unCheckedImage: React.PropTypes.element,
    //     onClick: React.PropTypes.func.isRequired,
    //     isChecked: React.PropTypes.bool

    // }

    /**
     * 如果没有通过props传过来数据,则默认的是这样
     * @type
     */
    static defaultProps = {
        isChecked: false,
        leftTextStyle: {},
        rightTextStyle: {}
    };

    /**
     * 左边文字
     */
    _renderLeft() {
        if (this.props.leftTextView) {
            return this.props.leftTextView;
        }
        if (!this.props.leftText) {
            return null;
        }
        return (
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={[{ marginRight: 4, fontSize: 14, color: '#666666', alignItems: 'center' }, this.props.textStyle]}>
                {this.props.leftText}
            </Text>
        );
    }

    /**
     * 右边的文字
     * @returns {*}
     * @private
     */
    _renderRight() {
        if (this.props.rightTextView) return this.props.rightTextView;
        if (!this.props.rightText) return null;
        return (
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={[{ marginLeft: 4, flex: 1, fontSize: 14, color: '#666666', alignItems: 'center' }, this.props.rightTextStyle]}>
                {this.props.rightText}
            </Text>
        );
    }

    /**
     * 选中和为选中的图片按钮样式
     * @returns {*}
     * @private
     */
    _renderImage() {
        if (this.state.isChecked) {
            return this.props.checkedImage ? this.props.checkedImage : this.genCheckedImage();
        } else {
            return this.props.unCheckedImage ? this.props.unCheckedImage : this.genCheckedImage();
        }
    }

    genCheckedImage() {
        var source = this.state.isChecked ? this.state.WBModePic.select : this.state.WBModePic.unselect;
        return <Image style={{ width: 20, height: 20 }} source={source} />;
    }

    onClick() {
        if (this.state.currentNum < this.props.maxNum) {
            this.setState({ isChecked: !this.state.isChecked });
            this.props.onClick();
        } else {
            if (this.state.isChecked == true) {
                this.setState({ isChecked: !this.state.isChecked });
                this.props.onClick();
            }
        }
    }
    //单选框
    onPress = (index, item) => {
        let array = this.state.data;
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            if (i == index) {
                item.select = !item.select;
            } else {
                item.select = false;
            }
        }
        this.setState({ selectIndex: index });
        this.props.onPress ? this.props.onPress(index, item) : () => {};
    };

    renderRadioButton(array, item, onPress, index, sexIndex) {
        const { editable = true } = this.props;
        let backgroundColor = 'red';
        let image = item.image;
        if (sexIndex == index && sexIndex != null) {
            backgroundColor = 'blue';
            item.select = true;
        } else {
            item.select = false;
        }
        if (item.select == true) {
            image = item.image2;
            backgroundColor = 'blue';
        } else {
            image = item.image;
            backgroundColor = 'red';
        }

        // let childViewWidth = item.childViewWidth ? item.childViewWidth : 100;
        // let childViewHeight = item.childViewHeight ? item.childViewHeight : 44;
        // let childViewbackgroundColor = item.childViewbackgroundColor ? item.childViewbackgroundColor : 'white';
        //
        //
        // let imageWidth = item.imageWidth ? item.imageWidth : 20;
        // let imageHeigt = item.imageHeigt ? item.imageHeigt : 20;

        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    if (editable == false) {
                        return;
                    } else {
                        onPress(index, item);
                    }
                }}
                disabled={this.props.disabled}
                // disabled={!item.select}
                style={[
                    {
                        width: 100,
                        height: 43,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    this.props.conTainStyle
                ]}
            >
                <Image style={[{ width: 20, height: 20 }, this.props.imageStyle]} source={item.image ? image : item.select == true ? this.state.WBModePic['select'] : this.state.WBModePic['unselect']} />
                <Text ellipsizeMode={'tail'} numberOfLines={1} style={[{ marginLeft: 5, color: item.select == true ? '#666666' : '#999999' }, this.props.textStyle]}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    leftText: {
        flex: 1
    }
});
