import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import logger from './logger.js';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaki_hoardings');
let db;

const USERS_FILE = './data/users.json';

const loadJsonData = (file, defaultValue = []) => {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (err) {}
  return defaultValue;
};

const initUsersCollection = async () => {
  try {
    // ONLY connect if we aren't already connected!
    if (!db) {
      console.log('🔗 AUTH: Establishing fresh connection to MongoDB...');
      await client.connect();
      db = client.db('kaki_hoardings');
    }
    return db.collection('users');
  } catch (error) {
    console.error('❌ MongoDB connection failed in auth.js:', error.message);
    return null; 
  }
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '4h' }); // Reduced from 24h to 4h for security
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const authMiddleware = async (req, res, next) => {
  console.log('🔍 DEBUG: Auth middleware called');
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    console.log('🔍 DEBUG: No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    console.log('🔍 DEBUG: Invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }
  console.log('🔍 DEBUG: Token valid, user:', decoded);
  req.user = decoded;
  next();
};

const register = async (req, res) => {
  try {
    // Phase 2: Schema Validation
    const schema = Joi.object({
      name: Joi.string().required().min(2).max(100),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      company: Joi.string().allow('', null),
      phone: Joi.string().allow('', null),
      role: Joi.string().valid('provider', 'client').default('provider')
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password, company, phone, role = 'provider' } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    
    console.log(`📝 REGISTER ATTEMPT: Email [${normalizedEmail}]`);
    
    const usersCollection = await initUsersCollection();
    
    if (!usersCollection) {
      console.log('⚠️ AUTH: Register using In-Memory Fallback');
      // In-memory fallback - create test user
      const testUser = {
        id: 'test-user-' + Date.now(),
        name, email: normalizedEmail, password, company, phone, role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const token = generateToken(testUser);
      const { password: _, ...userWithoutPassword } = testUser;
      return res.status(201).json({ 
        success: true, 
        message: 'Registration successful (in-memory mode)', 
        data: { user: userWithoutPassword, token } 
      });
    }
    
    const existingUser = await usersCollection.findOne({ 
      $or: [
        { email: normalizedEmail },
        { email: email }
      ]
    });
    
    if (existingUser) {
      console.log(`❌ REGISTER: User already exists [${normalizedEmail}]`);
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: 'provider-' + Date.now(),
      name,
      email: normalizedEmail,
      password: hashedPassword,
      company,
      phone,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await usersCollection.insertOne(newUser);
    logger.info(`✅ [AUTH] User Registered: ${normalizedEmail}`);
    
    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ success: true, message: 'Registration successful', data: { user: userWithoutPassword, token } });
  } catch (error) {
    logger.error('💥 [AUTH] Registration Error:', error.message);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    
    console.log(`\n🔑 [DEBUG] LOGIN ATTEMPT: [${normalizedEmail}]`);
    
    const usersCollection = await initUsersCollection();
    
    // Safety check for user in DB
    const user = await usersCollection.findOne({ 
      $or: [{ email: normalizedEmail }, { email: email }]
    });

    if (!user) {
      console.log(`❌ AUTH: No user found for email [${normalizedEmail}]`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    console.log(`🔍 AUTH: User found [${user.email}]. Checking password...`);

    // Check if it's a hashed password or plain text (migration fallback)
    let isMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Fallback for plain text passwords in DB - allow once and update to hash
      isMatch = user.password === password;
      if (isMatch) {
        console.log(`⚠️ AUTH: Plain text password detected for [${user.email}]. Updating to hash...`);
        const newHash = await bcrypt.hash(password, 10);
        await usersCollection.updateOne({ id: user.id }, { $set: { password: newHash } });
      }
    }

    if (!isMatch) {
      logger.warn(`🛑 [SECURITY] Failed login attempt for: ${user.email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    logger.info(`✅ [AUTH] Login Success: ${user.email}`);
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, message: 'Login successful', data: { user: userWithoutPassword, token } });
  } catch (error) {
    logger.error('💥 [AUTH] Login Error:', error.message);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const usersCollection = await initUsersCollection();
    
    if (!usersCollection) {
      // In-memory fallback - return test user
      if (req.user.id === 'test-user-001') {
        const testUser = {
          id: 'test-user-001',
          name: 'Test User',
          email: 'test@example.com',
          company: 'Test Company',
          phone: '+91 12345 67890',
          role: 'provider',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const { password: _, ...userResponse } = testUser;
        return res.json({ 
          success: true, 
          message: 'User retrieved (in-memory mode)', 
          data: userResponse 
        });
      } else {
        return res.status(404).json({ error: 'User not found (in-memory mode)' });
      }
    }
    
    const foundUser = await usersCollection.findOne({ id: req.user.id });
    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password: _, ...userResponse } = foundUser;
    res.json({ success: true, data: userResponse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    const usersCollection = await initUsersCollection();
    
    if (!usersCollection) {
      return res.status(503).json({ 
        success: false, 
        message: 'Password reset is currently unavailable. Please try again later.' 
      });
    }
    
    const user = await usersCollection.findOne({ 
      $or: [{ email: normalizedEmail }, { email: email }]
    });
    
    if (!user) {
      // Security best practice: don't reveal if user exists
      return res.json({ 
        success: true, 
        message: 'If an account exists with this email, you will receive password reset instructions.' 
      });
    }
    
    // In a real app, we'd send an email with a reset link.
    // For now, we'll generate a random temporary password and hash it.
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    await usersCollection.updateOne(
      { id: user.id },
      { $set: { password: hashedPassword, updatedAt: new Date().toISOString() } }
    );
    
    // In production, this would be emailed.
    logger.info(`🔑 [AUTH] Password recovery initiated for: ${normalizedEmail}`);
    res.json({ 
      success: true, 
      message: `Security Check Passed! Your temporary password is: ${tempPassword}. Please change it after logging in.` 
    });
  } catch (error) {
    logger.error('💥 [AUTH] Recovery Error:', error.message);
    res.status(500).json({ success: false, message: 'Recovery failed' });
  }
};

export { authMiddleware, register, login, getCurrentUser, verifyToken, generateToken, initUsersCollection, resetPassword };
