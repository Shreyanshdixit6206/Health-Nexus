const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { VAULT_FILE, readJson, writeJson, JWT_SECRET, setCorsHeaders, initDataDir, generateId } = require('./_shared');

const UPLOADS_DIR = '/tmp/uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const upload = multer({ dest: UPLOADS_DIR, limits: { fileSize: 5 * 1024 * 1024 } });

function authMiddleware(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('No token');
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    throw new Error('Invalid token');
  }
}

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

module.exports = async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const user = authMiddleware(req);
    initDataDir();
    
    if (req.method === 'GET') {
      const vault = readJson(VAULT_FILE);
      const userDocs = vault.filter(d => d.aadhaar === user.aadhaar);
      return res.status(200).json(userDocs);
    }
    
    if (req.method === 'POST') {
      await runMiddleware(req, res, upload.single('file'));
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file' });
      }
      
      const vault = readJson(VAULT_FILE);
      const doc = {
        id: generateId(10),
        aadhaar: user.aadhaar,
        filename: req.file.filename,
        originalname: req.file.originalname,
        uploadedAt: new Date().toISOString()
      };
      vault.push(doc);
      writeJson(VAULT_FILE, vault);
      return res.status(200).json(doc);
    }
    
    if (req.method === 'DELETE') {
      const id = req.url.split('/').pop();
      const vault = readJson(VAULT_FILE);
      const doc = vault.find(d => d.id === id && d.aadhaar === user.aadhaar);
      
      if (!doc) {
        return res.status(404).json({ error: 'Not found' });
      }
      
      const filePath = path.join(UPLOADS_DIR, doc.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      const updated = vault.filter(d => d.id !== id);
      writeJson(VAULT_FILE, updated);
      return res.status(200).json({ message: 'Deleted' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};
