//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import globalcolor from '../../../../config/globalcolor';

// create a component
class ConfirmDialog extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.titleText]}>{this.props.title ? this.props.title : '确认'}</Text>
                <Text style={[styles.titleText]}>{this.props.description ? this.props.description : ''}</Text>
                <View style={[{ flexDirection: 'row', width: (SCREEN_WIDTH * 3) / 4, height: 64, justifyContent: 'space-around', alignItems: 'center' }]}>
                    <TouchableOpacity onPress={this.props.doPositive}>
                        <View style={styles.button}>
                            <Text style={[styles.buttonText]}>确认</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.doNegative}>
                        <View style={styles.button}>
                            <Text style={[styles.buttonText]}>取消</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        width: (SCREEN_WIDTH * 3) / 4,
        height: 160,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: globalcolor.white
    },
    titleText: {
        color: globalcolor.antBlue,
        fontWeight: 'bold',
        maxWidth: (SCREEN_WIDTH * 3) / 4 - 40
    },
    button: {
        width: SCREEN_WIDTH / 5,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: globalcolor.antBlue
    },
    buttonText: {
        color: globalcolor.whiteFont,
        fontSize: 14
    }
});

//make this component available to the app
export default ConfirmDialog;
