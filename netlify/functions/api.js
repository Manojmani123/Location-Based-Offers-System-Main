const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "https://your-real-admin-site.netlify.app",
  "https://your-real-customer-site.netlify.app",
  "https://your-real-superadmin-site.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, message: "Backend is running" });
});

app.post("/api/login", (req, res) => {
  const { username } = req.body;
  res.json({ success: true, username });
});

module.exports.handler = serverless(app);