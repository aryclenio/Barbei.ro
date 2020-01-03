import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authCOnfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // Descarta a primeira posição e pega apenas o token
  const [, token] = authHeader.split(' ');

  try {
    // promisify regula o jwt para que ele use uma estrutura de callback
    // com async await e retnroando uma função
    const decoded = await promisify(jwt.verify)(token, authCOnfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
