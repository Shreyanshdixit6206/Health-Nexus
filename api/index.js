// Vercel Serverless Function Handler
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const multer = require('multer');
const { nanoid } = require('nanoid');

// Use /tmp for Vercel's writable directory
const DATA_DIR = '/tmp/data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MEDS_FILE = path.join(DATA_DIR, 'medicines.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const VAULT_FILE = path.join(DATA_DIR, 'vault.json');

// Initialize data directory and copy initial data
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  
  // Copy initial data from server/data to /tmp/data
  const sourceDataDir = path.join(__dirname, '../server/data');
  if (fs.existsSync(sourceDataDir)) {
    const files = ['users.json', 'medicines.json', 'orders.json', 'vault.json'];
    files.forEach(file => {
      const src = path.join(sourceDataDir, file);
      const dest = path.join(DATA_DIR, file);
      if (fs.existsSync(src) && !fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
      }
    });
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-health-nexus';
const OTP_TTL_MS = 1000 * 60 * 5;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(session({
  name: 'hn_sid',
  secret: process.env.SESSION_SECRET || 'dev-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const UPLOADS_DIR = '/tmp/uploads';
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
const upload = multer({ dest: UPLOADS_DIR, limits: { fileSize: 5 * 1024 * 1024 } });

const otps = {};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8') || 'null') || [];
  } catch (e) {
    return [];
  }
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8');
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Request OTP
app.post('/request-otp', (req, res) => {
  const { aadhaar } = req.body;
  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).json({ error: 'Invalid Aadhaar' });
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otps[aadhaar] = { otp, expiresAt: Date.now() + OTP_TTL_MS };
  console.log(`[DEV] OTP for ${aadhaar}: ${otp}`);
  res.json({ message: 'OTP sent', otp });
});

// Verify OTP and login
app.post('/verify-otp', (req, res) => {
  const { aadhaar, otp } = req.body;
  const record = otps[aadhaar];
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }
  delete otps[aadhaar];
  
  let users = readJson(USERS_FILE);
  let user = users.find(u => u.aadhaar === aadhaar);
  if (!user) {
    user = { aadhaar, createdAt: new Date().toISOString() };
    users.push(user);
    writeJson(USERS_FILE, users);
  }
  
  const token = jwt.sign({ aadhaar }, JWT_SECRET, { expiresIn: '7d' });
  req.session.aadhaar = aadhaar;
  res.json({ token, user });
});

// Get medicines
app.get('/medicines', (req, res) => {
  const meds = readJson(MEDS_FILE);
  res.json(meds);
});

// Create order
app.post('/orders', authMiddleware, (req, res) => {
  const { items, customerDetails, paymentDetails } = req.body;
  const orders = readJson(ORDERS_FILE);
  const order = {
    id: nanoid(10),
    aadhaar: req.user.aadhaar,
    items,
    customerDetails,
    paymentDetails,
    status: 'processing',
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  writeJson(ORDERS_FILE, orders);
  res.json(order);
});

// Get orders
app.get('/orders', authMiddleware, (req, res) => {
  const orders = readJson(ORDERS_FILE);
  const userOrders = orders.filter(o => o.aadhaar === req.user.aadhaar);
  res.json(userOrders);
});

// Vault - upload
app.post('/vault', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const vault = readJson(VAULT_FILE);
  const doc = {
    id: nanoid(10),
    aadhaar: req.user.aadhaar,
    filename: req.file.filename,
    originalname: req.file.originalname,
    uploadedAt: new Date().toISOString()
  };
  vault.push(doc);
  writeJson(VAULT_FILE, vault);
  res.json(doc);
});

// Vault - list
app.get('/vault', authMiddleware, (req, res) => {
  const vault = readJson(VAULT_FILE);
  const userDocs = vault.filter(d => d.aadhaar === req.user.aadhaar);
  res.json(userDocs);
});

// Vault - delete
app.delete('/vault/:id', authMiddleware, (req, res) => {
  const vault = readJson(VAULT_FILE);
  const doc = vault.find(d => d.id === req.params.id && d.aadhaar === req.user.aadhaar);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  
  const filePath = path.join(UPLOADS_DIR, doc.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  
  const updated = vault.filter(d => d.id !== req.params.id);
  writeJson(VAULT_FILE, updated);
  res.json({ message: 'Deleted' });
});

module.exports = app;
