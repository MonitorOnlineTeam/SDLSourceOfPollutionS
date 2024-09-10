//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, InteractionManager } from 'react-native';
import { createAction } from '../utils';
import { connect } from 'react-redux';
// import data from '../../config/configjson/mainmap.json';

const SCREEN_WIDTH = Dimensions.get('window').width;
/**
 * 污染因子bar
 * helenChen
 * @class PollutantcodeBar
 * @extends {Component}
 */
@connect()
class PollutantcodeBar extends PureComponent {
    static defaultProps = {
        selectColor: '#4B83F5',
        defaultColor: '#42403E'
    };

    constructor(props) {
        super(props);
        this.state = {
            pressPollutantCode: props.pressPollutantCode || 'a34002'
        };
    }
    //污染因子 item
    _renderItemPollutant = item => {
        let color = item.item.PollutantCode === this.state.pressPollutantCode ? this.props.selectColor : this.props.defaultColor;
        return (
            <View
                style={{
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    flexDirection: 'row',
                    height: 40,
                    marginLeft: 4,
                    marginRight: 4,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <TouchableOpacity
                    style={{ alignItems: 'center', width: 50 }}
                    onPress={() => {
                        this.setState({ pressPollutantCode: item.item.PollutantCode });
                        this.props.callback(item.item.PollutantCode);
                        InteractionManager.runAfterInteractions(() => {
                            this.props.dispatch(
                                createAction('map/MapOrRank')({
                                    pressPollutantCodeMap: item.item.PollutantCode,
                                    pressPollutantCodeRank: '',
                                    whitchPage: 'Map'
                                })
                            );
                        });
                    }}
                >
                    {<Text style={{ fontSize: 14, alignSelf: 'center', padding: 4, color: color }}>{item.item.PollutantName}</Text>}
                    <View
                        style={{
                            height: 1,
                            width: '100%',
                            marginLeft: -5,
                            backgroundColor: color == this.props.defaultColor ? 'white' : color,
                            bottom: -6
                        }}
                    />
                </TouchableOpacity>
            </View>
        );
    };
    //FlatList key
    _extraUniqueKey = (item, index) => `index${index}${item}`;
    render() {
        return (
            <View
                style={
                    this.props.style || {
                        width: SCREEN_WIDTH,
                        backgroundColor: '#ffffff',
                        position: 'absolute',
                        top: 100
                    }
                }
            >
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    extraData={this.state.pressPollutantCode}
                    data={this.props.pollutantData}
                    renderItem={this._renderItemPollutant}
                    keyExtractor={this._extraUniqueKey}
                />
            </View>
        );
    }
}

export default PollutantcodeBar;
