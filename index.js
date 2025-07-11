require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

// Replace this with the target server URL
const targetUrl = "https://api.backpack.exchange";

const allowedOrigins = [
  "https://exchange-frontend-kappa.vercel.app", // your frontend
  "http://localhost:3000", // local dev
];

// Handle CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Expose-Headers", "Content-Length, Content-Range");

  // Respond to preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(
  "/",
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // Optionally, you can modify the request here
      proxyReq.setHeader("Origin", targetUrl);
      proxyReq.setHeader("Referer", targetUrl);
      proxyReq.setHeader("Host", new URL(targetUrl).host);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Optionally, you can modify the response here
    },
  })
);

const port = 8000;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
