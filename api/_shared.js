const fs = require('fs');
const path = require('path');

const DATA_DIR = '/tmp/data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MEDS_FILE = path.join(DATA_DIR, 'medicines.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const VAULT_FILE = path.join(DATA_DIR, 'vault.json');

function initDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  const sourceDataDir = path.join(__dirname, '../server/data');
  const files = ['users.json', 'medicines.json', 'orders.json', 'vault.json'];
  files.forEach(file => {
    const src = path.join(sourceDataDir, file);
    const dest = path.join(DATA_DIR, file);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      try {
        fs.copyFileSync(src, dest);
      } catch (err) {
        console.error(`Error copying ${file}:`, err);
      }
    }
  });
}

function readJson(file) {
  try {
    initDataDir();
    return JSON.parse(fs.readFileSync(file, 'utf8') || 'null') || [];
  } catch (e) {
    return [];
  }
}

function writeJson(file, obj) {
  initDataDir();
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-health-nexus';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = {
  DATA_DIR,
  USERS_FILE,
  MEDS_FILE,
  ORDERS_FILE,
  VAULT_FILE,
  readJson,
  writeJson,
  JWT_SECRET,
  setCorsHeaders,
  initDataDir
};
