// 通过 'content-security-policy' 头部来设置CSP
import { contextBridge, ipcRenderer } from "electron";

console.log('!!!!!!!!!!!!!!!!')
console.log('!!!!!!!!!!!!!!!!')
console.log('!!!!!!!!!!!!!!!!')
console.log('!!!!!!!!!!!!!!!!')
console.log('!!!!!!!!!!!!!!!!')
// contextBridge.exposeInMainWorld("electron", {
//   ipcRenderer,
// });
// self.addEventListener('fetch', event => {
//   if (event.request.method === 'GET') {
//     event.respondWith(
//       fetch(new Request(event.request.url, {
//         mode: 'no-cors',
//         redirect: 'follow',
//         referrer: 'https://term.ptt.cc',
//         headers: {
//           Origin: 'https://term.ptt.cc',
//         }
//       })).then(response => {
//         return response;
//       }).catch(error => {
//         console.error('Fetch error:', error);
//       })
//     );
//   }
// });