const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { VAULT_FILE, readJson, writeJson, JWT_SECRET, setCorsHeaders, initDataDir } = require('../_shared');

const UPLOADS_DIR = '/tmp/uploads';

function authMiddleware(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('No token');
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    throw new Error('Invalid token');
  }
}

module.exports = async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const user = authMiddleware(req);
    initDataDir();
    
    if (req.method === 'DELETE') {
      // Get document ID from query parameter
      const id = req.query.id;
      
      console.log('DELETE request - ID from query:', id);
      
      if (!id) {
        return res.status(400).json({ error: 'Document ID required' });
      }
      
      const vault = readJson(VAULT_FILE);
      const doc = vault.find(d => d.id === id && d.aadhaar === user.aadhaar);
      
      if (!doc) {
        console.log('Document not found. ID:', id, 'User:', user.aadhaar);
        console.log('Available docs:', vault.filter(d => d.aadhaar === user.aadhaar).map(d => d.id));
        return res.status(404).json({ error: 'Document not found' });
      }
      
      const filePath = path.join(UPLOADS_DIR, doc.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }
      
      const updated = vault.filter(d => d.id !== id);
      writeJson(VAULT_FILE, updated);
      console.log('Document deleted successfully:', id);
      return res.status(200).json({ message: 'Deleted' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Error in vault delete:', err);
    return res.status(401).json({ error: err.message });
  }
};
