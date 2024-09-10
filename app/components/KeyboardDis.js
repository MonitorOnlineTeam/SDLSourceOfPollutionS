import React, { Component } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ReactNative, {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    Animated
} from 'react-native'

import {SCREEN_HEIGHT} from '../config/globalsize';

var dataSources = [];

export default class KeyboardDis extends Component {

    _keyExtractor = (item, index) => item.id;

    constructor(props) {
        super(props);
       
        this.state = {
            keyboardHeight: -10,
            cusViewHeight: 0,
            textID: ''
        }
    }

    _renderItem = ({ item }) => (
        <View style={{ justifyContent: 'center' }} key={item.id}>
            <Text key={item.id} style={styles.renderItem}>{item.data}</Text>
        </View>
    );



    componentWillMount() {
        //开启键盘监听
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        //结束监听
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) => {
      
        
        // this.refs.flatList.scrollToIndex({animated: true, index: this.generateBig().length - 1, viewPosition: 0.5});
        this.setState({ keyboardHeight: event.endCoordinates.height, cusViewHeight: 40 })
    };

    keyboardWillHide = (event) => {
     
        // this.refs.flatList.scrollToIndex({animated: true, index: this.generateBig().length - 1, viewPosition: 1.9})
        this.setState({ keyboardHeight: event.endCoordinates.height, cusViewHeight: 0 })
    }

    render() {
        return (
            <View style={styles.container}>

                <View
                    ref='wancheng'
                    style={[{ position: 'absolute', width: 375, height: this.state.cusViewHeight, backgroundColor: 'white', bottom:0,},this.props.style]}>
                    <Text
                        style={{ top: 13, left: 10 }}
                        onPress={() => {
                            Keyboard.dismiss()
                        }}>完成</Text>

                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'flex-end',
        backgroundColor: '#F5FCFF',
        flexDirection: 'column'
    },
    list: {
        marginTop: 30,
    },
    inputView: {
        height: 45,
        borderWidth: 1,
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 5,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 30
    },
    renderItem: {
        height: 44,
        marginLeft: 20,
    }
});

