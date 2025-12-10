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
  
  console.log(`Verify attempt - Aadhaar: ${aadhaar}, OTP: ${otp}, Record:`, record);
  
  if (!record) {
    return res.status(401).json({ error: 'No OTP found for this Aadhaar. Please request OTP again.' });
  }
  
  if (record.otp !== otp) {
    return res.status(401).json({ error: `Invalid OTP. Expected: ${record.otp}, Got: ${otp}` });
  }
  
  if (Date.now() > record.expiresAt) {
    return res.status(401).json({ error: 'OTP expired. Please request a new one.' });
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
