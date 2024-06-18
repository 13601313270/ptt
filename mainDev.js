const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');
const { } = require('electron')
const remote = require("@electron/remote/main");
remote.initialize();


function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: true, // Enable DevTools
      contextIsolation: false,
      enableRemoteModule: true,
      // // 预加载脚本来设置CSP
      // preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    }
  })
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    // 设置代理服务器地址和端口
    Object.assign(details.requestHeaders, {
      'Proxy-Authorization': 'Basic ' + Buffer.from('proxy-user:proxy-password').toString('base64'),
      'User-Agent': 'My-Agent',
      'Cookie': 'over18=1'
    });
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
  require("@electron/remote/main").enable(win.webContents)
  // win.webContents.openDevTools();
  win.loadFile(path.join(__dirname, './file/index.html')) // load the home page
  // win.loadURL('http://localhost:8080') // load the home page
}

app.whenReady().then(createWindow)
