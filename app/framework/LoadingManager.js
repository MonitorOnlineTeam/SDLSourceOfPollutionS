/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-08-21 14:24:05
 * @LastEditTime: 2024-09-13 13:27:14
 * @FilePath: /SDLMainProject/app/framework/LoadingManager.js
 */
module.exports = {
  _loadingView: null,

  registerLoadingView(loadingView) {
    this._loadingView = loadingView
  },

  unregisterLoadingView() {
    this._loadingView = null
  },


  show(msg = "Loading") {
    if (this._loadingView === null) {
      return
    }

    // Hide the current alert
    this.hide()

    if (msg != null) {
      // Clear current state
      this._loadingView.setNewState({
        showState: false,
        message: '加载中...',
      })

      setTimeout(() => {
        this._loadingView.show(msg)
      }, 100)
    }
  },

  hide() {
    this._loadingView.hide();
  },


}