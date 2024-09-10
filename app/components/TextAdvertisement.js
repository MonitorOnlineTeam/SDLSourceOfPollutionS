/*
 * @Description: 文字广告rn版
 * @LastEditors: hxf
 * @Date: 2022-10-09 09:12:02
 * @LastEditTime: 2022-10-24 17:58:42
 * @FilePath: /SDLMainProject/app/components/TextAdvertisement.js
 */
import React, { PureComponent } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux';
import { SCREEN_WIDTH } from '../config/globalsize';

@connect(({ helpCenter })=>({
    noticeContentData:helpCenter.noticeContentData,
}))
export default class TextAdvertisement extends PureComponent {

    constructor(props){
        super(props);
        this.state={
            index:0
        }
    }

    componentDidMount(){
        const { noticeContentData=[], propWidth, itemKey } = this.props;
        const scrollView = this.refs.scrollView;
        let x = 0;
        this.timer = setInterval(() => {
            x = this.state.index+1;
            if (noticeContentData.length == x) {
                x = 0;
            }
            scrollView.scrollTo({x: 0, y: x*40, animated: x == 0?false:true})
            this.setState({ index: x });
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { noticeContentData=[], propWidth, itemKey } = this.props;
        return (<ScrollView 
            ref='scrollView'
            showsVerticalScrollIndicator={false}
            style={{height:40, width:propWidth
            , backgroundColor:'#ffffff', marginTop:0}}>
            {
                noticeContentData.map((item,index)=>{
                    return(<View key={`ads${index}`} style={{height:40
                        , width:propWidth, flexDirection:'row'
                        , justifyContent:'center', alignItems:'center'}}>
                        <Text style={{width:propWidth,color:'#333333'}} numberOfLines={1}>{item.NoticeTitle}</Text>
                    </View>);
                })
            }
        </ScrollView>)
    }
}
