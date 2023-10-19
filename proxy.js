const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer({});

app.all('/api/v1.0/*', (req, res) => {
    proxy.web(req, res, { target: 'http://127.0.0.1:5000' });
});

app.listen(5500, () => {
    console.log('Proxy server is running on http://127.0.0.1:5500');
});
