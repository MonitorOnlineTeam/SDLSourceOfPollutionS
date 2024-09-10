import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import {Touchable} from '../../components';

/**
 * 基础排序
 * @param {*} param0 
 */
export const BaseOrderView = ({style,text,textStyle,imageStyle,order='desc',ascImg=require('../../images/ic_sort_up.png'),descImg=require('../../images/ic_sort_down.png'),defaultImg=require('../../images/ic_sort_default.png'),...rest}) => {
  let img = defaultImg;
  switch(order){
    case 'desc':
      img=descImg;
      break;
    case 'asc':
      img=ascImg;
      break;
    default:
      img = defaultImg;
  }
  return(<Touchable style={[styles.container, style]} {...rest}>
          <Text style={[styles.text,textStyle&&{...textStyle}]}>{text}</Text>
          <Image style={[styles.image,imageStyle&&{...imageStyle}]} source={img}></Image>
        </Touchable>);
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    fontSize:16,
    fontWeight: '300',
  },
  image:{
    width:12,
    height:12,
    marginLeft: 4,
  }
});

export default BaseOrderView;