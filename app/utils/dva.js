/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2020-08-26 09:28:38
 * @LastEditTime: 2024-11-11 11:32:42
 * @FilePath: /SDLSourceOfPollutionS/app/utils/dva.js
 */
import React from 'react';
import { create } from 'dva-core';
import { Provider, connect } from 'react-redux';
// import createLoading from 'dva-loading';

export { connect };

export default function (options) {
  const app = create(options);
  // app.use(createLoading());
  // HMR workaround
  if (!global.registered) options.models.forEach(model => app.model(model));
  global.registered = true;

  app.start();
  // eslint-disable-next-line no-underscore-dangle
  const store = app._store;
  const dispatch = store.dispatch;
  app.start = container => () => <Provider store={store}>{container}</Provider>;
  app.getStore = () => store;

  return { app, dispatch };
}
