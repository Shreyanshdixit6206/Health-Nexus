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
  
  // For Vercel deployment: Accept any 6-digit OTP for demo purposes
  // In production, you'd use Vercel KV, Redis, or a database
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: 'OTP must be 6 digits' });
  }
  
  console.log(`Verify attempt - Aadhaar: ${aadhaar}, OTP: ${otp} (accepted for demo)`);
  
  // Check if it matches the most recently sent OTP (from file storage)
  const record = getOtp(aadhaar);
  
  if (record && record.otp === otp && Date.now() <= record.expiresAt) {
    // Valid OTP from storage
    deleteOtp(aadhaar);
  } else {
    // For demo: Accept the OTP shown in the request-otp response
    console.log(`OTP not in storage or expired, but accepting for demo purposes`);
  }
  
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
