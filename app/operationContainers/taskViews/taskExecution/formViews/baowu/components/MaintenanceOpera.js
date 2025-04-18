/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2025-04-15 14:01:48
 * @LastEditors: outman0611 jia_anbo@163.com
 * @LastEditTime: 2025-04-18 09:09:11
 * @Description: 宝武记录表头部组件
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import FormInput from '../../../components/FormInput';
import globalcolor from '../../../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../../../config/globalsize';
import {  NavigationActions, } from '../../../../../../utils';

const { width, height } = Dimensions.get('window');

const MaintenanceOpera = (props) => {



  useEffect(() => {

  }, []);
  


  const { dispatch,maintenanceManageUnit, unitCallback, operationPerson,userCallback,isJycs,cemsSupplier,checkDate,lastCheckDate } = props;
  return (
    <View style={styles.formContainer}>
      {isJycs && 
          <FormInput
          label="CEMS供应商"
          required={true}
          value={cemsSupplier}
          placeholder="请输入"
          onChangeText={text => {
            unitCallback?.(text)
          }}
        />}

      <FormInput
        label="维护单位管理"
        required={true}
        value={maintenanceManageUnit}
        placeholder="请输入"
        onChangeText={text => {
          unitCallback?.(text)
        }}
      />
      <TouchableOpacity style={[styles.layoutStyle, { justifyContent: 'space-between', height: 45, }]}
        onPress={() => {
          dispatch(NavigationActions.navigate({
          routeName: 'PersonList',
          params: {
            selectUser:operationPerson.split(','),
            callback: (item)=>{
              userCallback?.(item)
            }
        }
        }));
        }}
      >
        <View style={[styles.layoutStyle]}>
          <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text>
          <Text numberOfLines={1} style={[styles.labelStyle]}>{'运维人：'}</Text>
        </View>
        <View style={[styles.layoutStyle]}>
          <Text numberOfLines={1}   ellipsizeMode="tail"   style={{width: SCREEN_WIDTH - 150,textAlign:'right', color: globalcolor.placeholderTextColor }}>{/**operationPerson? globalcolor.textBlack : */}
            {operationPerson || '请选择'}
          </Text>
          <Image style={[{ tintColor: globalcolor.blue, height: 16, }]} resizeMode={'contain'} source={require('../../../../../../images/right.png')} />
        </View>
      </TouchableOpacity>

      {isJycs && <>
         <FormDatePicker
         label="本次校验日期"
         required={true}
         timeString={
          checkDate
             ? moment(checkDate).format('YYYY-MM-DD')
             : '请选择本次校验日期'
         }
         getPickerOption={() => ({
           type: 'day',
           onSureClickListener: date => {
             this.setState(prevState => ({
               formData: {...prevState.formData, ExpirationDate: date},
             }));
           },
         })}
       />
           <FormDatePicker
         label="上次校验日期"
         required={true}
         timeString={
          lastCheckDate
             ? moment(lastCheckDate).format('YYYY-MM-DD')
             : '请选择上次校验日期'
         }
         getPickerOption={() => ({
           type: 'day',
           onSureClickListener: date => {
             this.setState(prevState => ({
               formData: {...prevState.formData, ExpirationDate: date},
             }));
           },
         })}
       />
      </>}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 28,
    backgroundColor: '#fff',
  },
  layoutStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelStyle: {
    fontSize: 14,
    color: globalcolor.textBlack
  },
});

export default MaintenanceOpera; 