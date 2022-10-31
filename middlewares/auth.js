const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const SECRET_CODE = require('../utils/jwt_code');
const Unauthorized = require('../errors/AuthError');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new Unauthorized('Необходима авторизация');
  }
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_CODE);
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }
  req.user = payload;

  next();
};
