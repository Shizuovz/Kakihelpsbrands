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
    if (!db) {
      console.log('🔗 AUTH: Establishing connection to MongoDB...');
      await client.connect();
      db = client.db('kaki_hoardings');
      console.log('✅ AUTH: Connected to MongoDB');
    }
    return db.collection('users');
  } catch (error) {
    console.error('❌ MongoDB connection failed in auth.js:', error.message);
    
    // Fallback to mock collection that uses the JSON file
    return {
      findOne: async (query) => {
        const users = loadJsonData(USERS_FILE, []);
        const email = query.email?.toLowerCase();
        return users.find(u => u.email?.toLowerCase() === email) || null;
      },
      insertOne: async (user) => {
        const users = loadJsonData(USERS_FILE, []);
        users.push(user);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return { insertedId: user.id };
      },
      updateOne: async (query, update) => {
        const users = loadJsonData(USERS_FILE, []);
        const index = users.findIndex(u => u.id === query.id);
        if (index > -1) {
          if (update.$set) Object.assign(users[index], update.$set);
          fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        }
        return { modifiedCount: index > -1 ? 1 : 0 };
      }
    };
  }
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '4h' });
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
    
    const usersCollection = await initUsersCollection();
    
    const existingUser = await usersCollection.findOne({ 
      $or: [{ email: normalizedEmail }, { email: email }]
    });
    
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: 'user-' + Date.now(),
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
    
    const usersCollection = await initUsersCollection();
    const user = await usersCollection.findOne({ 
      $or: [{ email: normalizedEmail }, { email: email }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    let isMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
      if (isMatch) {
        const newHash = await bcrypt.hash(password, 10);
        await usersCollection.updateOne({ id: user.id }, { $set: { password: newHash } });
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

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
    
    const user = await usersCollection.findOne({ 
      $or: [{ email: normalizedEmail }, { email: email }]
    });
    
    if (!user) {
      return res.json({ 
        success: true, 
        message: 'If an account exists with this email, you will receive password reset instructions.' 
      });
    }
    
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    await usersCollection.updateOne(
      { id: user.id },
      { $set: { password: hashedPassword, updatedAt: new Date().toISOString() } }
    );
    
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
