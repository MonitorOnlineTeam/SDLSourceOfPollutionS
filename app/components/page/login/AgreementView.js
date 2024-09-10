/*
 * @Description: 协议展示页
 * @LastEditors: hxf
 * @Date: 2022-06-23 12:01:04
 * @LastEditTime: 2022-06-23 15:14:10
 * @FilePath: /SDLMainProject/app/components/page/login/AgreementView.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { createAction, createNavigationOptions } from '../../../utils';
import { SCREEN_WIDTH } from '../../SDLPicker/constant/globalsize';

@connect(({ login })=>({
    IsAgree:login.IsAgree,
}))
export default class AgreementView extends Component {
    static navigationOptions = createNavigationOptions({
        title: '用户协议',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    render() {
        return (
            <ScrollView>
                <View style={{width:SCREEN_WIDTH,backgroundColor:'white',alignItems:'center'}}>
                    <Text style={{fontSize:18,color:'#333',marginVertical:10}}>{'用户监测数据许可协议'}</Text>
                    <Text style={{fontSize:15,color:'#666',width:SCREEN_WIDTH-20}}>{`甲方：用户
乙方：北京雪迪龙科技股份有限公司

根据本协议，甲方同意授予乙方基于智能环境监测设备运行和服务而监测、传输与使用甲方数据信息的权利。现就具体事项约定如下：

一、许可对象：监测平台在运行过程中搜集到的用户基本信息、环保实时监测数据与其他周边信息。

二、许可范围：
1、甲方任何格式在设备或系统上监测、传输、存储或处理的所有数据、软件、设备、文本、图像、视频、音频、照片、第三方应用程序、信息、材料等。乙方自身的数据和信息不属于此列；
2、仅指企业信息，本许可协议不涉及国标GBT 35273-2017《信息安全技术个人信息安全规范》规范的个人信息。

三、授权使用用途：包括但不限于
1、甲方环境监测实时信息、备份留存、汇总信息及可视化成果；
2、为应对环保监管机关检查而提供符合监管要求数据信息；
3、向其他公共事务管理机构如市场监督管理局、商标局、证监会等提供或司法机关依法调取；
3、为配合国家环境保护标准制定或修订提供相应数据信息；
4、商业研究与应用：环保大数据的研究及商业化应用。  

四、修改与转让
1、乙方可能通过在网站上传修改后的版本或者其他方式通知甲方发布本协议的修改版本，包括协议中所提及的文件和政策。除非更新后的版本、文件或政策另有规定，修改的条款将于发布或通知后生效。甲方需要定期在网上查阅这些条款。甲方在条款修改生效后继续使用服务将被视为接受修改后的条款；
2、不可转让。未经乙方事先书面同意，甲方不得转让或以其他方式将本协议的全部或部分转让给任何第三方，包括甲方的关联方。乙方可能会在未经甲方同意的情况下向关联方转让或转移本协议项下的任何权利或义务。在转让生效前，乙方会通过网站通知或其他途径告知甲方。

五、合规使用
1、账户：甲方需要谨慎保存企业账号与密码，所提供的资料与事实不符或所提供的资料已变更而未更新导致乙方无法为用户提供或进一步提供服务，乙方不因此承担任何责任；
2、篡改：鉴于智能化操作平台的特殊性，乙方无义务审核是否甲方本企业使用该组账号及密码，仅审核账号及密码是否与数据库中保存的一致，只要任何人输入的账号及密码与数据库中保存的一致，即可凭借该组账号及密码登陆，由此导致数据发生错误或遭篡改行为即使并非其企业用户所为，乙方将不承担因此而产生的任何责任。
六、知识产权
1、乙方拥有本协议项下硬件设计，服务（包括任何基础软件程序及其所有部分、复制和修改）、服务衍生品、监测数据研究以及由乙方开发或交付的任何内容的所有权、知识产权和权益；
2、甲方不得、也不能使得或允许其他人（a）修改、变更服务或制造服务的衍生品；（b）对服务进行反汇编、反编译、反向工程、复制服务的任何部分，或应用其他任何程序来获得服务中所包含的任何软件的源代码；（c）分发、转售、再许可、或转让服务。

七、保密规定
1、保密期限为双方合作结束之后期限2年。双方承诺在保密期限内，未经对方事先书面许可，一方不会不符合本协议规定目的，自己或允许他人使用保密信息的全部或任何部分；
2、除了上述第二条、第三条乙方不得透露甲方任何非官方信息，乙方有权对整个用户数据库进行技术分析并对已进行分析、整理后的用户数据库进行商业上的利用。

八、争议解决
双方同意本协议的签订地为北京市昌平区，并同意将因本协议引起的或与本协议有关的任何争议提交合同签订地有管辖权的法院诉讼解决（包括与非合同义务有关的任何争议或索赔）。`}</Text>
                </View>
                <View style={{
                    height: 40,
                    marginVertical: 20,
                    flexDirection:'row',
                    width:SCREEN_WIDTH,
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <TouchableOpacity
                        style={styles.checkStyleDetail}
                        onPress={() => {
                            // 动态更新组件内State记录记住我
                            this.props.dispatch(createAction('login/updateState')({IsAgree:!this.props.IsAgree}))
                        }}
                    >
                        <Image source={this.props.IsAgree ? require('../../../images/login_checkbox_on.png') : require('../../../images/login_checkbox_off.png')} style={{ width: 21, height: 21 }} />
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',}}>
                        <Text style={{ fontSize: 14, color: '#666', marginLeft: 3 }}>请勾选阅读并接受</Text>
                        <View
                            style={styles.checkStyleDetail}
                        >
                            <Text style={{ fontSize: 14, color: '#4aa0ff', marginLeft: 3 }}>《用户监测数据许可协议》</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    checkStyleDetail: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});