import { getRootUrl } from '../dvapack/storage';
import { SentencedToEmpty } from '../utils';

export const openWebSocket = (handleMessage = data => {}, handleErrorMessage = message => {}, hasOpenFun = () => {}, hasCloseFun = () => {}) => {
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
        console.log(e.code, e.reason);
        console.log(e);
        hasCloseFun();
    };
    return ws;
};
