/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-07-15 09:12:04
 * @LastEditTime: 2024-09-05 14:03:00
 * @FilePath: /SDLMainProject/index.js
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
console.log('app = ', app);
console.log('store = ', app.store);

const _App = app.start(<App />);
export { dispatch };
AppRegistry.registerComponent(appName, () => _App);
