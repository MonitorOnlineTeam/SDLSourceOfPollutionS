/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-07-15 09:12:04
 * @LastEditTime: 2025-03-11 11:13:36
 * @FilePath: /SDLSourceOfPollutionS_dev/index.js
 */
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import dva from './app/utils/dva';
import { registerModels } from './app/pOperationModels';

const { app, dispatch } = dva({
    initialState: {},
    models: [],
    // extraReducers: { router: routerReducer },
    // onAction: [routerMiddleware, screenTracking],
    onAction: [],
    onError(e) {
        console.log('onError', e);
    }
});
registerModels(app);

const _App = app.start(<App />);
export { dispatch };
AppRegistry.registerComponent(appName, () => _App);
