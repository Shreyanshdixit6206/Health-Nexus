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
      
      console.log('All vault docs:', vault);
      console.log('Looking for ID:', id, 'User:', user.aadhaar);
      
      const doc = vault.find(d => d.id === id && d.aadhaar === user.aadhaar);
      
      if (!doc) {
        // Document might have been uploaded in different function instance
        // Try to delete by ID anyway (for Vercel ephemeral storage)
        const docAny = vault.find(d => d.id === id);
        if (docAny) {
          console.log('Found doc but wrong user. Doc user:', docAny.aadhaar, 'Request user:', user.aadhaar);
          return res.status(403).json({ error: 'Not authorized to delete this document' });
        }
        console.log('Document not found in vault database. ID:', id);
        console.log('Available doc IDs:', vault.map(d => d.id));
        return res.status(404).json({ error: 'Document not found. It may have been uploaded in a previous session.' });
      }
      
      // Try to delete the physical file (may not exist due to Vercel's ephemeral storage)
      const filePath = path.join(UPLOADS_DIR, doc.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log('Physical file deleted:', filePath);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      } else {
        console.log('Physical file not found (ephemeral storage):', filePath);
      }
      
      // Remove from database
      const updated = vault.filter(d => d.id !== id);
      writeJson(VAULT_FILE, updated);
      console.log('Document removed from database:', id);
      return res.status(200).json({ message: 'Deleted' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Error in vault delete:', err);
    return res.status(401).json({ error: err.message });
  }
};
