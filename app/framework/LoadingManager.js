/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-08-21 14:24:05
 * @LastEditTime: 2023-08-25 09:08:15
 * @FilePath: /AwesomeProject_dev/src/framework/LoadingManager.js
 */
module.exports = {
  _loadingView: null,

  registerLoadingView (loadingView) {
    this._loadingView = loadingView
  },

  unregisterLoadingView () {
    this._loadingView = null
  },


  show(msg="未输入消息") {
    this._loadingView.show(msg);
  },

  hide(){
    this._loadingView.hide();
  },

  
}