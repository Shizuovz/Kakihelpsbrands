import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import logger from './logger.js';
import crypto from 'crypto';
import { Resend } from 'resend';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const resend = new Resend(process.env.RESEND_API_KEY);
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
    
    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry
    
    await usersCollection.updateOne(
      { id: user.id },
      { $set: { resetToken, resetTokenExpiry, updatedAt: new Date().toISOString() } }
    );
    
    // Determine frontend URL
    const origin = req.headers.origin || 'http://localhost:5173';
    const resetLink = `${origin}/reset-password?token=${resetToken}`;
    
    // Send Email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key_here') {
      try {
        const emailResponse = await resend.emails.send({
          from: 'Hoardings <noreply@kakihelpsbrands.com>',
          to: user.email,
          subject: 'Password Reset Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
              <h2 style="color: #6d28d9;">Password Reset Request</h2>
              <p>Hi ${user.name || 'there'},</p>
              <p>You recently requested to reset your password for your Hoardings account. Click the button below to reset it. <strong>This link is only valid for 1 hour.</strong></p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset is only valid for the next 1 hour.</p>
              <p>Thanks,<br>The Hoardings Team</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #999;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
              <p style="font-size: 12px; color: #6d28d9; word-break: break-all;">${resetLink}</p>
            </div>
          `
        });
        
        if (emailResponse.error) {
          throw new Error(emailResponse.error.message || 'Resend API Error');
        }
      } catch (emailError) {
        logger.error('💥 [AUTH] Email send failed:', emailError);
        // Log the link so the user can test locally even if Resend is failing
        logger.info(`📧 [FALLBACK] Reset link generated for ${user.email}: ${resetLink}`);
      }
    } else {
      logger.info(`📧 [MOCK EMAIL] Reset link generated for ${user.email}: ${resetLink}`);
    }

    res.json({ 
      success: true, 
      message: 'If an account exists with this email, you will receive password reset instructions.' 
    });
  } catch (error) {
    logger.error('💥 [AUTH] Recovery Error:', error.message);
    res.status(500).json({ success: false, message: 'Recovery failed' });
  }
};

const confirmReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const usersCollection = await initUsersCollection();
    
    const user = await usersCollection.findOne({ 
      resetToken: token
    });
    
    if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await usersCollection.updateOne(
      { id: user.id },
      { 
        $set: { password: hashedPassword, updatedAt: new Date().toISOString() },
        $unset: { resetToken: "", resetTokenExpiry: "" }
      }
    );
    
    res.json({ 
      success: true, 
      message: 'Your password has been successfully reset. You can now log in.' 
    });
  } catch (error) {
    logger.error('💥 [AUTH] Confirm Reset Error:', error.message);
    res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};

export { authMiddleware, register, login, getCurrentUser, verifyToken, generateToken, initUsersCollection, resetPassword, confirmReset };
