import { Dimensions, Platform } from 'react-native';
import Color from './color';

let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

const pageStatus = {
    neterror: 404,
    content: 200,
    error: 1000,
    empty: 0,
    init: -1,
    loading: -1,
    commit: -2
};

export default {
    window: window,
    isIOS: Platform.OS === 'ios',
    Color: Color,
    PageStatus: pageStatus
};
