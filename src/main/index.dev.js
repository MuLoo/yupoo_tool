/*
 * @Author: your name
 * @Date: 2021-06-21 16:12:55
 * @LastEditTime: 2021-06-21 18:44:54
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /upyun-tool/src/main/index.dev.js
 */
/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
// require('electron-debug')({ showDevTools: true })
// NB: Don't open dev tools with this, it is causing the error
require('electron-debug')();

// Install `vue-devtools`
require('electron').app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

// Require `main` process to boot app
require('./index')