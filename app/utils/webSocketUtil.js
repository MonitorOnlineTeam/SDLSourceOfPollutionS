/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2021-04-01 08:57:11
 * @LastEditTime: 2024-11-11 11:32:12
 * @FilePath: /SDLSourceOfPollutionS/app/utils/webSocketUtil.js
 */
import { getRootUrl } from '../dvapack/storage';
import { SentencedToEmpty } from '../utils';

export const openWebSocket = (handleMessage = data => { }, handleErrorMessage = message => { }, hasOpenFun = () => { }, hasCloseFun = () => { }) => {
    let urlConfig = getRootUrl();
    const ws = new WebSocket(`ws://${SentencedToEmpty(urlConfig, ['WebSocket'], '172.16.12.165:40005')}`);
    ws.onopen = () => {
        // connection opened
        console.log('onopen');
        ws.send('something'); // send a message
        hasOpenFun();
    };

    ws.onmessage = e => {
        // a message was received
        console.log('onmessage');
        // console.log(e.data);
        handleMessage(e.data);
    };

    ws.onerror = e => {
        // an error occurred
        console.log('onerror');
        console.log(e.message);
        handleErrorMessage(e.message);
    };

    ws.onclose = e => {
        // connection closed
        console.log('onclose');
        console.log(e);
        hasCloseFun();
    };
    return ws;
};
