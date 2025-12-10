const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const { ORDERS_FILE, readJson, writeJson, JWT_SECRET, setCorsHeaders } = require('./_shared');

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
    
    if (req.method === 'GET') {
      const orders = readJson(ORDERS_FILE);
      const userOrders = orders.filter(o => o.aadhaar === user.aadhaar);
      return res.status(200).json(userOrders);
    }
    
    if (req.method === 'POST') {
      const { items, customerDetails, paymentDetails } = req.body;
      const orders = readJson(ORDERS_FILE);
      const order = {
        id: nanoid(10),
        aadhaar: user.aadhaar,
        items,
        customerDetails,
        paymentDetails,
        status: 'processing',
        createdAt: new Date().toISOString()
      };
      orders.push(order);
      writeJson(ORDERS_FILE, orders);
      return res.status(200).json(order);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};
