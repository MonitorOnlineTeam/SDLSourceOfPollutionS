import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, Image, Platform } from 'react-native'
// import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ApprovalPendingList from './ApprovalPendingList'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../config/globalsize';
import { StatusPage, Touchable, PickerTouchable } from '../../components';
import { NavigationActions, createAction, createNavigationOptions } from '../../utils';
import { connect } from 'react-redux';
const ic_filt_arrows = require('../../images/ic_filt_arrows.png');
/**
 * 审批
 */
@connect(({ approvalModel }) => ({
  pendingData: approvalModel.pendingData,
  approvalPage: approvalModel.approvalPage
}))
export default class PerformApproval extends PureComponent {
  static navigationOptions = createNavigationOptions({
    title: '审批',
    headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
  });

  constructor(props) {
    super(props);
    // 0 待我审批 ；1 我发起的；2 我审批的
    this.state = {
      datatype: 0, // 默认为选中 0 待我审批
      DGIMNs: '',
      selectItem: { ContentTypeName: '全部类型', ID: '' },
    };
    _me = this;
  }

  onChange = (e) => {
    const i = e;
    this.setState({ datatype: i, selectItem: { ContentTypeName: '全部类型', ID: '' } });
    // 0 待我审批 ；1 我发起的；2 我审批的
    this.props.dispatch(createAction('approvalModel/getTaskListRight')({
      params: {
        type: i,
        pageIndex: 1,
        pageSize: 10
      }
    }));
  }

  onRefresh = () => {
    this.props.dispatch(createAction('approvalModel/getTaskListRight')({
      params: {
        type: this.state.datatype,
        pageIndex: 1,
        pageSize: 10
      }
    }));
  }

  onEndReached = () => {
    if (this.props.approvalPage <= (this.props.pendingData.data.Total / 10)) {
      this.props.dispatch(createAction('approvalModel/updateState')({
        approvalPage: this.props.approvalPage + 1,
      }))
      this.props.dispatch(createAction('approvalModel/getTaskListRight')({
        params: {
          type: this.state.datatype,
          pageIndex: this.props.approvalPage + 1,
          pageSize: 10
        }
      }));
    }
  }

  componentDidMount() {
    this.props.dispatch(createAction('approvalModel/updateState')({
      approvalPage: 1,
      pendingData: { status: -1 },
    }))
    // 0 待我审批 ；1 我发起的；2 我审批的
    //不能通过pageType判断，因为页面位置出了问题
    // 0 待我审批
    this.props.dispatch(createAction('approvalModel/getTaskListRight')({
      params: {
        type: 0,
        pageIndex: 1,
        pageSize: 10
      }
    }));
  }

  render() {
    // 0 待我审批 ；1 我发起的；2 我审批的
    return (
      <View style={styles.container}>
        {/* <ScrollableTabView
          onChangeTab={(obj) => {
            this.onChange(obj.ref.props.datatype);
          }
          }
          style={{ height: SCREEN_HEIGHT }}
          renderTabBar={() =>
            <DefaultTabBar tabStyle={{ marginTop: 10 }} />
          }
          // initialPage={this.props.navigation.state.params.pageType}
          initialPage={0}
          tabBarUnderlineStyle={{ width: SCREEN_WIDTH / 3, height: 2, backgroundColor: '#5688f6', marginBottom: -1, }}
          tabBarPosition='top'
          scrollWithoutAnimation={false}
          tabBarUnderlineColor='#5688f6'
          tabBarBackgroundColor='#FFFFFF'
          tabBarActiveTextColor='#5688f6'
          tabBarInactiveTextColor='#666666'
          tabBarTextStyle={{ fontSize: 13 }}>

          <ApprovalPendingList
            selectItem={this.state.selectItem}
            listKey='b' key='1' tabLabel='待我审批' datatype={0} approvaData={this.props.pendingData}
            onRefresh={this.onRefresh} onEndReached={this.onEndReached}
          />
          <ApprovalPendingList
            selectItem={this.state.selectItem}
            listKey='c' key='2' tabLabel='我已审批' datatype={2} approvaData={this.props.pendingData} onRefresh={this.onRefresh} onEndReached={this.onEndReached}
          />
          <ApprovalPendingList
            selectItem={this.state.selectItem}
            listKey='a' key='0' tabLabel='我发起的' datatype={1}
            approvaData={this.props.pendingData} onRefresh={this.onRefresh} onEndReached={this.onEndReached}
          />
        </ScrollableTabView> */}
      </View>
    )
  }
}
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeeee',
    flexDirection: 'column',

  },

});