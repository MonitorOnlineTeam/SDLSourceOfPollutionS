package com.sdlmainproject

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.sdl.alipush.PushModule
import com.alibaba.sdk.android.push.huawei.HuaWeiRegister
import com.reactlibrary.bugly.RNBuglyModule
//import com.reactnative.uniapp.ReactNativeUniappPackage

//
class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
//              add(ReactNativeUniappPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  companion object{
    private var instance:Application? = null;
    fun instance() = instance!!
  }

  override fun onCreate() {
    super.onCreate()
    instance = this;
    SoLoader.init(this, false)
    this
      // 公司
      PushModule.initCloudChannel(this, "2882303761519963767", "5281996355767");
      // 注册方法会自动判断是否支持华为系统推送，如不支持会跳过注册。
      HuaWeiRegister.register(this);

    // 仅仅初始化(推荐使用该方法，所有的检查更新触发都都js端，更加灵活)
    RNBuglyModule.initWithoutAutoCheckUpgrade(getApplicationContext(), "1400022651", true);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }
}
