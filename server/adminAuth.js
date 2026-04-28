import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import logger from './logger.js';

dotenv.config();

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || 'your-admin-secret-key';
const ADMINS_FILE = path.join(process.cwd(), 'data', 'admins.json');

const loadAdmins = () => {
  try {
    if (fs.existsSync(ADMINS_FILE)) {
      return JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading admins:', err);
  }
  return [];
};

export const generateAdminToken = (admin) => {
  return jwt.sign({ 
    id: admin.id, 
    email: admin.email, 
    role: 'admin',
    isAdmin: true 
  }, JWT_ADMIN_SECRET, { expiresIn: '4h' }); // Reduced from 12h to 4h
};

export const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No admin token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
    if (!decoded.isAdmin) {
      throw new Error('Not an admin token');
    }
    req.admin = decoded;
    next();
  } catch (error) {
    logger.warn(`🛑 [SECURITY] Invalid admin token attempt: ${error.message}`);
    return res.status(401).json({ error: 'Invalid or expired admin token' });
  }
};

export const adminLogin = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid request format' });
  }

  const { email, password } = req.body;
  const admins = loadAdmins();
  
  const admin = admins.find(a => a.email.toLowerCase() === email?.toLowerCase());
  
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  // Check if it's a hashed password or plain text (migration fallback)
  let isMatch = false;
  if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$')) {
    isMatch = await bcrypt.compare(password, admin.password);
  } else {
    // Fallback for plain text passwords - allow once and update to hash
    isMatch = admin.password === password;
    if (isMatch) {
      console.log(`⚠️ ADMIN AUTH: Plain text password detected for [${admin.email}]. Updating to hash...`);
      const newHash = await bcrypt.hash(password, 10);
      admin.password = newHash;
      // Save updated admins list back to file
      try {
        fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), 'utf8');
      } catch (err) {
        console.error('Error updating admin password to hash:', err);
      }
    }
  }
  
  if (isMatch) {
    logger.info(`✅ [ADMIN] Login Success: ${admin.email}`);
    const token = generateAdminToken(admin);
    const { password: _, ...adminData } = admin;
    res.json({
      success: true,
      data: { admin: adminData, token }
    });
  } else {
    logger.warn(`🛑 [SECURITY] Failed Admin login attempt: ${email}`);
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
};

export const getAdminMe = (req, res) => {
  const admins = loadAdmins();
  const admin = admins.find(a => a.id === req.admin.id);
  
  if (admin) {
    const { password: _, ...adminData } = admin;
    res.json({ success: true, data: adminData });
  } else {
    res.status(404).json({ error: 'Admin not found' });
  }
};
