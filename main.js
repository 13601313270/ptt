const { app, BrowserWindow, session, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');

function createWindow() {

  require("http").createServer(function (req, res) {
    
    console.log('==================')
    console.log(req.url)
    console.log(JSON.stringify(req.url))
    let pttData;
    if (req.url === '/index.html') {
      pttData = fs.readFileSync(path.join(__dirname, './file/index.html'));
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else {
      pttData = fs.readFileSync(path.join(__dirname, './file/pttchrome.581e13b2b29a997cac7c.js'));
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
    res.end(pttData.toString());
  }).listen(9000)


  // // 创建一个服务器来拦截请求
  // const server = net.createServer(socket => {
  //   socket.on('data', data => {
  //     // 处理接收到的请求数据
  //     // 这里你可以解析HTTP请求，然后做出响应
  //   });

  //   socket.write('HTTP/1.1 200 OK\r\nContent-Length: 12\r\n\r\nHello World!');
  //   socket.end();
  // });

  // // 监听本地端口
  // server.listen(9000, '127.0.0.1', () => {
  //   // 修改Electron的代理设置，将请求指向服务器
  //   session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
  //     callback({
  //       cancel: false,
  //       requestHeaders: {
  //         ...details.requestHeaders,
  //         'Host': '127.0.0.1:9000'
  //       }
  //     });
  //   });
  // });

  session.defaultSession.webRequest.onBeforeRequest({
    urls: ['https://term.ptt.cc/assets/pttchrome.581e13b2b29a997cac7c.js']
  }, (details, callback) => {
    console.log('WebSocket request-------:', details.url);
    if (details.url === 'https://term.ptt.cc/assets/pttchrome.581e13b2b29a997cac7c.js') {
      callback({
        redirectURL: 'http://localhost:9000/pttchrome.581e13b2b29a997cac7c.js'
      })
      return;
    }
    // 可以在这里修改details以改变请求行为
    callback({ cancel: false }); // 允许连接
  });
  // 捕获WebSocket连接
  // session.defaultSession.webRequest.onBeforeRequest({
  //   urls: ['ws://*/*', 'wss://*/*']
  // }, (details, callback) => {
  //   console.log('WebSocket request=======:', details.url);
  //   // 可以在这里修改details以改变请求行为
  //   callback({ cancel: false }); // 允许连接
  // });
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: true, // Enable DevTools
      // 预加载脚本来设置CSP
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.webContents.openDevTools();
  // win.loadFile(path.join(__dirname, './file/index.html')) // load the home page
  win.loadURL('https://term.ptt.cc/index.html') // load the home page
  // win.loadFile(path.join(__dirname, './public/index.html')) // load the home page

  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg); // 打印渲染进程发送的消息
    event.reply('asynchronous-reply', '主进程回复');
  });
  
}

app.whenReady().then(createWindow)
