import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

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
  }, JWT_ADMIN_SECRET, { expiresIn: '12h' });
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
    return res.status(401).json({ error: 'Invalid or expired admin token' });
  }
};

export const adminLogin = (req, res) => {
  const { email, password } = req.body;
  const admins = loadAdmins();
  
  const admin = admins.find(a => a.email.toLowerCase() === email?.toLowerCase() && a.password === password);
  
  if (admin) {
    const token = generateAdminToken(admin);
    const { password: _, ...adminData } = admin;
    res.json({
      success: true,
      data: { admin: adminData, token }
    });
  } else {
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
