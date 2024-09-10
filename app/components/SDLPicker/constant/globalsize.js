import { Dimensions, NativeModules, Platform } from 'react-native';
const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const NOSTATUSHEIGHT = Dimensions.get('screen').height - STATUSBAR_HEIGHT;

export const little_font_size = 14;
export const little_font_size2 = 12;
export const normal_font_size = 16;
export const big_font_size = 18;
