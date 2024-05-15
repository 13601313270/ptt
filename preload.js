// 通过 'content-security-policy' 头部来设置CSP
self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(new Request(event.request.url, {
        mode: 'no-cors',
        redirect: 'follow',
        referrer: 'https://term.ptt.cc',
        headers: {
          Origin: 'https://term.ptt.cc',
        }
      })).then(response => {
        return response;
      }).catch(error => {
        console.error('Fetch error:', error);
      })
    );
  }
});