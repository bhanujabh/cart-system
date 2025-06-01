const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = authenticate;
