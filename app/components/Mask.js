//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,FlatList,TouchableWithoutFeedback,Animated, } from 'react-native';

import { connect } from 'react-redux';

import globalcolor from '../config/globalcolor';
import {SCREEN_WIDTH, SCREEN_HEIGHT,little_font_size, WINDOW_HEIGHT, NOSTATUSHEIGHT} from '../config/globalsize';
/**
 * 对比点选择dialog
*/
// create a component
@connect()
class Mask extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
          
        };
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={[{height:WINDOW_HEIGHT,width:SCREEN_WIDTH,alignItems:'center',justifyContent:'flex-end',},this.props.style]}>
                <TouchableWithoutFeedback onPress={()=>{
                    this.props.hideDialog();
                }}>
                    <Animated.View style={ styles.mask } >
                    </Animated.View>
                </TouchableWithoutFeedback>
                {/**此处添加需要弹出的框体*/}
                {this.props.children}
            </View>);
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        height:SCREEN_HEIGHT/2,
        width:SCREEN_WIDTH*3/4,
        borderRadius:8,
        borderWidth:0.5,
        borderColor:'white',
        justifyContent:'center',
        alignItems:'center',
    },
    titleContainer:{
        height:40,
        backgroundColor:globalcolor.titleBlue,
        flexDirection:'row',
        width:SCREEN_WIDTH*3/4-1,
        alignItems:'center',
        justifyContent:'space-between',
        borderTopLeftRadius:8,
        borderTopRightRadius:8,
    },
    titleText:{
        color:globalcolor.white,
        fontWeight:'bold'
    },
    closeIconTouchable:{
        height:32,
        width:32,
        justifyContent:'center',
        alignItems:'center',
        marginRight:4,
    },
    flatlist:{
        flex:1,
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
        width:SCREEN_WIDTH*3/4-1,
    },
    noDataComponent:{
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
    },
    mask: {
        backgroundColor:"#383838",
        opacity:0.8,
        position:"absolute",
        width:SCREEN_HEIGHT,
        height:SCREEN_HEIGHT,
        left:0,
        top:0,
    },
});

export default Mask;
