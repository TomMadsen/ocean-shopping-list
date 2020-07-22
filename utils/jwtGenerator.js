const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (id) => {
  const payload = {
    user: {id}
  }
  return jwt.sign(payload, process.env.jwtSecret, {expiresIn: 7200})
} 