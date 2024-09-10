//import liraries
import React, { PureComponent } from 'react';
import { View,ScrollView, Platform, StyleSheet } from 'react-native';

import {BaseTable1,BaseRow1,BaseOrderView} from '../../components';

const CONENT_FIXED = 1;
const CONENT_MOBILE = 2;
/**
 * 固定列横向滚动
 */
export default class FixTable extends PureComponent {

    constructor(props) {
        super(props);
        const order = {orderRule:'num',orderType:'desc',orderKey:''};
        const {titleProps} = props;
        let _order = order;
        if(titleProps.order) _order={..._order,...titleProps.order};
        this.state={..._order};
    }

    getTitleProps=(start,end)=>{
        const {titleProps} = this.props;
        const {flexArr,widthArr,data} = titleProps;
        const _flexArr = flexArr&&flexArr.slice(start,end);
        const _widthArr = widthArr&&widthArr.slice(start,end);
        const _data = this.getTitleData(data.slice(start,end));
        return {...titleProps,flexArr:_flexArr,widthArr:_widthArr,data:_data};
    }
    getTitleData(data){
        const titleData = [];
        data.map((item,index)=>{
            if(item.order)
                titleData.push(this.getOrderTitle(item.title,item.key));
            else
                titleData.push(item.title);
        });
        return titleData;
    }

    getOrderTitle=(title,key)=>{
        const {titleProps:{textStyle}} = this.props;

        let order = 'none';
        if(key == this.state.orderKey){
            order=this.state.orderType;
        }
        return(
            <BaseOrderView 
                order={order} 
                text={title} 
                textStyle = {textStyle} 
                style={{flex:1,width:'100%'}}
                onPress={()=>{
                    if(this.state.orderKey == key){
                        if(this.state.orderType=='desc'){
                            this.setState({orderType:'asc'});
                        }else if(this.state.orderType=='asc'){
                            this.setState({orderType:'desc'});
                        }
                    }else{
                        this.setState({orderKey:key});
                    }
                }}></BaseOrderView>);
    }

    getContentProps(start,end){
        const {titleProps,contentProps} = this.props;
        const {flexArr,widthArr,data} = contentProps;
        const _flexArr = flexArr&&flexArr.slice(start,end);
        const _widthArr = widthArr&&widthArr.slice(start,end);
        const _data = this.getContentData(titleProps.data.slice(start,end),data);
        return {...contentProps,flexArr:_flexArr,widthArr:_widthArr,data:_data};
    }

    getContentData(titleData,contentData){
        const {contentProps:{renderCell,defaultContent}} = this.props;
        const _contentData=[];
        for(let j=0;j<contentData.length;j++){
            let rowData=[];
            for(let i=0;i<titleData.length;i++){
                let key = titleData[i].key;
                let value;
                if(renderCell){
                    value = renderCell(i,key,contentData[j]);
                }
                if(value == -1)
                    value = contentData[j][key];
                if(!value){
                    value=defaultContent||'';
                }
                rowData.push(value);
            }
            _contentData.push(rowData);
        }
        return _contentData;
    }
    



    render() {
        const {type} = this.props;
        switch(type){
            case 'fix':
                return this._renderFixTable();
            case 'title':
                return this._renderTitleTable();
            default:
                return null;
        }

    }

    _renderTitleTable(){
        const {titleProps:{data:titleData}, contentProps:{data:contentData}} = this.props;
        return (<View style = {styles.titlecontainer}>
                    <BaseRow1 {...this.getTitleProps(0,titleData.length)}/>
                    <BaseTable1 {...this.getContentProps(0,contentData.length)}></BaseTable1>
                </View>);
    }

    _renderFixTable(){
        return (
            <View style = {[styles.fixcontainer,this.props.style]}>
                <View style={[styles.leftcontainer,{width:this.getFixWidth()}]}>
                    {this._renderTitleFix()}
                    {this._renderContentFix()}
                </View>
                <ScrollView 
                    style={styles.rightcontainer}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}>
                    <View style={{flex:1,flexDirection:'column'}}>
                        {this._renderTitleMobile()}
                        {this._renderContentMobile()}
                    </View>
                </ScrollView>
            </View>
        );
    }

    getFixWidth = () => {
        let fixWidth = 0;
        const {titleProps:{widthArr,fixCol}} = this.props;
        for(let i=0;i<fixCol;i++){
            fixWidth+=widthArr[i];
        }
        return fixWidth;
    }


    /**
     *渲染标题固定列
     * @memberof TitleTable
     */
    _renderTitleFix=()=>{
        const {titleProps} = this.props;
        const {fixCol} = titleProps;
        return ( <BaseRow1 {...this.getTitleProps(0,fixCol)}/>);
    }

    /**
     *渲染标题移动列
     * @memberof TitleTable
     */
    _renderTitleMobile=()=>{
        const {titleProps} = this.props;
        const {fixCol,data} = titleProps;
        return ( <BaseRow1 {...this.getTitleProps(fixCol,data.length)}/>);
    }

    /**
     * 渲染内容固定列
     * @memberof FixTable
     */
    _renderContentFix=()=>{
        const {titleProps:{fixCol}} = this.props;
        return ( <BaseTable1 
                    ref={(ref) => (this.contentFix = ref)}
                    onScroll={({nativeEvent:{contentOffset:{x,y}}}) => {
                        if(this.state.CurTable==CONENT_FIXED)
                            this.contentMobile.scrollToOffset({animated: false, offset: y});
                    }}
                    scrollEventThrottle={20}
                    onScrollBeginDrag={(event)=>{this.setState({CurTable:CONENT_FIXED});}}
                    style={{flex:1}} 
                    {...this.getContentProps(0,fixCol)}/>);
    }
    /**
     * 渲染内容移动列
     * @memberof FixTable
     */
    _renderContentMobile=()=>{
        const {titleProps:{fixCol,data}} = this.props;

        return ( <BaseTable1
                        style={{flex:1}}
                        ref={ref => (this.contentMobile = ref)}
                        onScroll={({nativeEvent:{contentOffset:{x,y}}}) => {
                               if(this.state.CurTable==CONENT_MOBILE)
                                  this.contentFix.scrollToOffset({animated: false, offset: y});
                        }}
                        scrollEventThrottle={20}
                        onScrollBeginDrag={(event)=>{this.setState({CurTable:CONENT_MOBILE});}}
                        {...this.getContentProps(fixCol,data.length)}/>);
    }
}

// define your styles
const styles = StyleSheet.create({
    titlecontainer: {
        flex: 1,
        width:'100%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    fixcontainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor:'#00000000',
    },
    leftcontainer: {
        flexDirection: 'column',
        backgroundColor:'#00000000',
    },
    rightcontainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor:'#00000000',
    },
});