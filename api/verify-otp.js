const jwt = require('jsonwebtoken');
const { USERS_FILE, readJson, writeJson, JWT_SECRET, setCorsHeaders, getOtp, deleteOtp } = require('./_shared');

module.exports = async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { aadhaar, otp } = req.body;
  const record = getOtp(aadhaar);
  
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }
  
  deleteOtp(aadhaar);
  
  let users = readJson(USERS_FILE);
  let user = users.find(u => u.aadhaar === aadhaar);
  if (!user) {
    user = { aadhaar, createdAt: new Date().toISOString() };
    users.push(user);
    writeJson(USERS_FILE, users);
  }
  
  const token = jwt.sign({ aadhaar }, JWT_SECRET, { expiresIn: '7d' });
  return res.status(200).json({ token, user });
};
