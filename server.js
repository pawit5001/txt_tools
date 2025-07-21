const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 4000;

// ใช้งาน CORS เพื่ออนุญาตการร้องขอจากโดเมนอื่น
app.use(cors());

// Set up proxy to forward requests to the Roblox website
app.use('/proxy', createProxyMiddleware({
    target: 'https://www.roblox.com',  // เปลี่ยนเป็น target ที่ถูกต้อง
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '', // ลบ '/proxy' ออกจาก URL เพื่อให้ตรงกับ URL ของ roblox
    },
    followRedirects: true,  // ติดตามการรีไดเร็กต์
    onProxyReq: (proxyReq, req, res) => {
        if (req.headers.cookie) {
            proxyReq.setHeader('Cookie', req.headers.cookie);  // ใช้คุกกี้ที่ได้รับจาก client
        }
    }
}));

// เริ่ม Proxy Server
app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
