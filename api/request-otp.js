const { saveOtp, setCorsHeaders } = require('./_shared');

const OTP_TTL_MS = 1000 * 60 * 5;

module.exports = async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { aadhaar } = req.body;
  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).json({ error: 'Invalid Aadhaar' });
  }
  
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + OTP_TTL_MS;
  saveOtp(aadhaar, otp, expiresAt);
  console.log(`[DEV] Saved OTP for ${aadhaar}: ${otp}, expires: ${new Date(expiresAt).toISOString()}`);
  
  return res.status(200).json({ message: 'OTP sent', otp, aadhaar });
};
