const otps = {};
const OTP_TTL_MS = 1000 * 60 * 5;

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
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
  otps[aadhaar] = { otp, expiresAt: Date.now() + OTP_TTL_MS };
  console.log(`[DEV] OTP for ${aadhaar}: ${otp}`);
  
  return res.status(200).json({ message: 'OTP sent', otp });
};
