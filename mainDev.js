const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');
const { } = require('electron')
const remote = require("@electron/remote/main");
remote.initialize();


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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
  require("@electron/remote/main").enable(win.webContents)
  win.webContents.openDevTools();
  win.loadFile(path.join(__dirname, './dist/index.html')) // load the home page
  // win.loadURL('http://localhost:8080') // load the home page
  // win.loadURL('https://term.ptt.cc/index.html') // load the home page
}

app.whenReady().then(createWindow)
