//import liraries
import React, { PureComponent } from 'react';
import { View,FlatList, Platform, StyleSheet } from 'react-native';

import {BaseRow1,BaseTable1} from '../../components';
import { ShowToast } from '../../utils';
/**
 * 图表
 */
export default class TitleTable extends PureComponent {


    constructor(props) {
        super(props); 
    }
    render() {

        const {titleProps,contentProps} = this.props;
        const {renderCell,onRowClick} = contentProps;
        /* 初始化标题头 */
        const titleData =[];
        titleProps.data.map((item,index)=>{titleData.push(item.title);});

        /* 初始化内容 */
        const contentData=[];
        for(let j=0;j<contentProps.data.length;j++){
            let rowData=[];
            for(let i=0;i<titleProps.data.length;i++){
                let key = titleProps.data[i].key;
                let value;
                if(renderCell){
                    value = renderCell(i,key,contentProps.data[j]);
                }
                if(value == -1)
                    value = contentProps.data[j][key];
                if(!value){
                    value=contentProps.defaultContent||'';
                }
                rowData.push(value);
            }
            contentData.push(rowData);
        }
       
        return (
            <View style = {styles.container}>
                <BaseRow1 {...titleProps} data={titleData}/>
                <BaseTable1 {...contentProps} data={contentData} onRowClick={onRowClick&&((index)=>{onRowClick(contentProps.data[index]);})}></BaseTable1>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%',
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
      },
});