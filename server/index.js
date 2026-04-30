import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import sanitize from 'mongo-sanitize';
import Joi from 'joi';
import morgan from 'morgan';
import logger from './logger.js';
import { fileTypeFromFile } from 'file-type';

// Load environment variables FIRST
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware, register, login, getCurrentUser, resetPassword, socialLogin } from './auth.js';
import { adminAuthMiddleware, adminLogin, getAdminMe } from './adminAuth.js';

// Cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const port = process.env.PORT || 3001;

// 1. SECURITY MIDDLEWARE (MUST BE FIRST)
// Use Helmet to set various security-related HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  contentSecurityPolicy: false,
}));

// Rate limiting to prevent brute force and DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration - Lockdown
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:8081',
  'https://kakihelpsbrands.com', // Production domain
  'https://www.kakihelpsbrands.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Body parser with sensible limits
app.use(express.json({ limit: '10kb' })); // Small limit for typical JSON
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization - xss-clean removed due to compatibility issues with Express 5

// Prevent HTTP Parameter Pollution
app.use(hpp());

// NoSQL Injection Protection
app.use((req, res, next) => {
  try {
    if (req.body) req.body = sanitize(req.body);
    
    // For req.query and req.params, we only sanitize if we can
    // but we avoid overwriting the objects themselves to prevent crashes
    if (req.query && typeof req.query === 'object') {
      const sanitized = sanitize({ ...req.query });
      if (Object.isExtensible(req.query)) {
        Object.keys(req.query).forEach(key => delete req.query[key]);
        Object.assign(req.query, sanitized);
      }
    }
    
    if (req.params && typeof req.params === 'object') {
      const sanitized = sanitize({ ...req.params });
      if (Object.isExtensible(req.params)) {
        Object.keys(req.params).forEach(key => delete req.params[key]);
        Object.assign(req.params, sanitized);
      }
    }
  } catch (e) {
    console.error('Sanitization warning:', e.message);
  }
  next();
});

// Logging middleware - Development
app.use(morgan('dev', {
  skip: (req, res) => res.statusCode < 400
}));

// Production Auditing
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  logger.info(`${req.method} ${req.url} - Origin: ${origin}`);
  next();
});

// Special large body limit for specific upload routes ONLY
app.post('/api/upload', express.json({ limit: '500mb' }));
app.post('/api/admin/upload', express.json({ limit: '500mb' }));


// Path for JSON fallback storage
const DATA_DIR = path.join(process.cwd(), 'data');
const HOARDINGS_FILE = path.join(DATA_DIR, 'hoardings.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const AVAILABILITY_FILE = path.join(DATA_DIR, 'availability.json');
const WEBSITE_CONTENT_FILE = path.join(DATA_DIR, 'website_content.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Data Load/Save Helpers for JSON Persistence
const loadJsonData = (file, defaultValue = []) => {
  try {
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error loading ${file}:`, err);
  }
  return defaultValue;
};

const saveJsonData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error saving ${file}:`, err);
    return false;
  }
};

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaki_hoardings');
let db;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await client.connect();
    db = client.db('kaki_hoardings');
    console.log('Connected to MongoDB successfully');

    // Initialize collections if they don't exist
    const hoardingsCollection = db.collection('hoardings');
    const count = await hoardingsCollection.countDocuments();

    if (count === 0) {
      console.log('Database is empty - ready for real hoardings data');
    } else {
      console.log(`Database ready with ${count} hoardings`);
    }

    // Seed a test user if none exists
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();

    if (userCount === 0) {
      const testUser = {
        id: 'test-user-001',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        company: 'Test Company',
        phone: '+91 12345 67890',
        role: 'provider',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await usersCollection.insertOne(testUser);
      console.log('Created test user: test@example.com');
    }

  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Set up a functional PERSISTENT JSON fallback instead of just in-memory
    console.log('📝 Setting up PERSISTENT JSON fallback mode (saves to server/data/*.json)...');

    const mockStore = {
      users: loadJsonData(USERS_FILE, [
        {
          id: 'test-user-001',
          name: 'Test User',
          email: 'test@example.com',
          company: 'Test Company',
          phone: '+91 12345 67890',
          role: 'provider',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]),
      hoardings: loadJsonData(HOARDINGS_FILE),
      inquiries: loadJsonData(INQUIRIES_FILE),
      availability: loadJsonData(AVAILABILITY_FILE),
      website_content: loadJsonData(WEBSITE_CONTENT_FILE, {
        index: {
          hero: { title: "We Build Brands", subtitle: "KAKI delivers full-service digital marketing", videoUrl: "/video/kaki.mp4" },
          departments: [],
          stats: [],
          recentWorks: [],
          socialLinks: []
        }
      })
    };

    db = {
      isMock: true,
      collection: (name) => {
        if (!mockStore[name]) mockStore[name] = [];
        const col = mockStore[name];
        const fileName = {
          'users': USERS_FILE,
          'hoardings': HOARDINGS_FILE,
          'inquiries': INQUIRIES_FILE,
          'availability': AVAILABILITY_FILE,
          'website_content': WEBSITE_CONTENT_FILE
        }[name];

        return {
          find: (query = {}) => {
            const matchesQuery = (item, q) => {
              for (const key in q) {
                if (key === '$or') {
                  if (!q.$or.some(subQ => matchesQuery(item, subQ))) return false;
                  continue;
                }
                if (key === '$and') {
                  if (!q.$and.every(subQ => matchesQuery(item, subQ))) return false;
                  continue;
                }
                if (key === '$exists') continue; // Skip complex logic for mock

                // Special handling for price/ownerId/etc in mock
                if (key === 'price' && q[key].$lte) {
                  if (item.price > q[key].$lte) return false;
                  continue;
                }

                if (q[key] !== undefined && item[key] !== q[key]) {
                  // Handle { ownerId: { $exists: false } } or null
                  if (typeof q[key] === 'object' && q[key] !== null) {
                    if (q[key].$exists === false && item[key]) return false;
                    if (q[key].$exists === true && !item[key]) return false;
                  } else if (item[key] !== q[key]) {
                    return false;
                  }
                }
              }
              return true;
            };

            const result = col.filter(item => matchesQuery(item, query));
            return {
              sort: () => ({ toArray: () => Promise.resolve(result) }),
              toArray: () => Promise.resolve(result)
            };
          },
          findOne: async (query) => {
            return col.find(item => {
              if (query.$or) {
                return query.$or.some(q => {
                  for (const key in q) {
                    if (item[key] !== q[key]) return false;
                  }
                  return true;
                });
              }
              for (const key in query) {
                if (item[key] !== query[key]) return false;
              }
              return true;
            }) || null;
          },
          insertOne: async (data) => {
            const insertedId = 'mock-' + Date.now();
            const newItem = { ...data, _id: insertedId, id: data.id || insertedId };
            col.push(newItem);
            if (fileName) saveJsonData(fileName, col);
            return { insertedId, ops: [newItem] };
          },
          updateOne: async (query, update, options) => {
            let item = col.find(i => i.hoardingId === query.hoardingId || i._id === query._id || i.id === query.id || i.id === query.hoardingId);
            if (item) {
              if (update.$set) Object.assign(item, update.$set);
            } else if (options?.upsert) {
              item = { ...query, ...(update.$set || {}) };
              col.push(item);
            }
            if (fileName) saveJsonData(fileName, col);
            return { modifiedCount: 1 };
          },
          deleteOne: async (query) => {
            const index = col.findIndex(i => i._id === query._id || i.id === query.id);
            if (index > -1) col.splice(index, 1);
            if (fileName) saveJsonData(fileName, col);
            return { deletedCount: 1 };
          },
          findOneAndDelete: async (query) => {
            const index = col.findIndex(i => i._id === query._id || i.id === query.id);
            let value = null;
            if (index > -1) {
              value = col.splice(index, 1)[0];
              if (fileName) saveJsonData(fileName, col);
            }
            return { value };
          },
          findOneAndUpdate: async (query, update, options) => {
            let item = col.find(i => i._id === query._id || i.id === query.id);
            if (item && update.$set) {
              Object.assign(item, update.$set);
              if (fileName) saveJsonData(fileName, col);
            }
            return { value: item };
          },
          countDocuments: async () => col.length,
          distinct: async (field) => [...new Set(col.map(i => i[field]))]
        };
      }
    };
  }
};

// No-op for old location


// Static assets
app.use('/uploads', express.static('uploads'));


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    console.log(`[Upload] File received: ${file.originalname}, mimetype: ${file.mimetype}`);

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.m4v', '.webm', '.ogv', '.mov'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      allowedMimeTypes.includes(file.mimetype) ||
      allowedExtensions.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype} (${file.originalname}). Only images and videos are allowed.`));
    }
  }
});

// Authentication endpoints
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/social', socialLogin);
app.post('/api/auth/reset-password', resetPassword);
app.get('/api/auth/me', authMiddleware, getCurrentUser);

// Separate ADMIN only auth routes
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/me', adminAuthMiddleware, getAdminMe);
app.post('/api/admin/upload', adminAuthMiddleware, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    console.log(`🚀 [Cloudinary] Uploading ${req.files.length} files...`);

    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: 'kaki_assets'
      })
    );

    const results = await Promise.all(uploadPromises);

    // Phase 3: File Signature Validation (Magic Numbers)
    for (const file of req.files) {
      const type = await fileTypeFromFile(file.path);
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.m4v', '.webm', '.ogv', '.mov'];
      const fileExt = path.extname(file.originalname).toLowerCase();

      if (!type || !allowedExtensions.includes(`.${type.ext}`)) {
        logger.warn(`🛑 [SECURITY] Rejected file with spoofed extension: ${file.originalname} (Detected: ${type?.mime})`);
        // Cleanup all local files
        req.files.forEach(f => { try { fs.unlinkSync(f.path); } catch (e) { } });
        return res.status(400).json({ success: false, message: 'Invalid file signature detected.' });
      }
    }

    // Cleanup local files
    req.files.forEach(file => {
      try { fs.unlinkSync(file.path); } catch (e) { }
    });

    const uploadedFiles = results.map(result => ({
      url: result.secure_url
    }));

    logger.info(`✅ [Cloudinary] Admin Upload successful: ${req.files.length} files`);
    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    logger.error('❌ [Cloudinary] Admin Upload error:', error);
    next(error); // Pass to global error handler
  }
});

// File upload endpoint
app.post('/api/upload', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    console.log(`🚀 [Cloudinary] User upload: uploading ${req.files.length} files...`);

    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: 'kaki_user_uploads'
      })
    );

    const results = await Promise.all(uploadPromises);

    // Phase 3: File Signature Validation (Magic Numbers)
    for (const file of req.files) {
      const type = await fileTypeFromFile(file.path);
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.m4v', '.webm', '.ogv', '.mov'];

      if (!type || !allowedExtensions.includes(`.${type.ext}`)) {
        logger.warn(`🛑 [SECURITY] User upload rejected (spoofed): ${file.originalname}`);
        req.files.forEach(f => { try { fs.unlinkSync(f.path); } catch (e) { } });
        return res.status(400).json({ success: false, message: 'Invalid file signature.' });
      }
    }

    // Cleanup local files
    req.files.forEach(file => {
      try { fs.unlinkSync(file.path); } catch (e) { }
    });

    const uploadedFiles = results.map((result, index) => {
      const originalFile = req.files[index];
      return {
        filename: originalFile.filename,
        originalname: originalFile.originalname,
        size: originalFile.size,
        url: result.secure_url
      };
    });

    logger.info(`✅ [Cloudinary] User upload successful: ${req.user.email}`);
    res.json({
      success: true,
      message: 'Files uploaded successfully to Cloud',
      data: uploadedFiles
    });
  } catch (error) {
    logger.error('❌ [Cloudinary] User upload error:', error);
    next(error);
  }
});

// Health check endpoint (minimal info for security)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint (Admin only)
app.get('/api/db-status', adminAuthMiddleware, (req, res) => {
  res.json({
    success: true,
    isMock: !!db?.isMock,
    storageType: db?.isMock ? 'JSON Files (Persistent Fallback)' : 'MongoDB Atlas',
  });
});

// Helper function to generate realistic impressions based on location and size
const generateImpressions = (location, totalSqft) => {
  const baseImpressions = Math.floor(totalSqft * 800); // Base calculation
  const multiplier = location.includes('MARKET') ? 1.5 :
    location.includes('JUNCTION') ? 1.3 :
      location.includes('ROAD') ? 1.1 : 1;
  const weeklyImpressions = Math.floor(baseImpressions * multiplier);
  return `${(weeklyImpressions / 1000).toFixed(1)}K / week`;
};

// Helper function to generate placeholder images
const generateImageUrl = (title, index) => {
  const seed = title.toLowerCase().replace(/\s+/g, '-');
  return `https://picsum.photos/seed/${seed}-${index}/800/600.jpg`;
};

// Helper to normalize hoarding IDs before sending to frontend
const normalizeHoarding = (h) => {
  if (!h) return h;
  const idValue = h.id || h._id;
  return {
    ...h,
    id: idValue ? idValue.toString() : null
  };
};

// Routes
app.get('/api/hoardings', async (req, res) => {
  try {
    if (!db) {
      return res.json({ success: true, data: [] });
    }

    const collection = db.collection('hoardings');
    console.log('🔍 DEBUG: Basic hoardings - Collection type:', typeof collection);
    console.log('🔍 DEBUG: Basic hoardings - Collection methods:', Object.keys(collection));
    const { region, type, maxPrice, searchQuery, sortBy } = req.query;

    // Build query
    const query = {};
    if (region && region !== 'All') query.region = region;
    if (type && type !== 'All') query.type = type;
    if (maxPrice && maxPrice < 25000) query.price = { $lte: parseInt(maxPrice) };
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'price-asc': sort = { price: 1 }; break;
      case 'price-desc': sort = { price: -1 }; break;
      default: sort = { featured: -1, createdAt: -1 };
    }

    const hoardings = await collection.find(query).sort(sort).toArray();
    const mappedHoardings = hoardings.map(normalizeHoarding);

    res.json({ success: true, data: mappedHoardings });

  } catch (error) {
    console.error('Error fetching hoardings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


app.get('/api/hoardings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const collection = db.collection('hoardings');

    // Try both ObjectId and string ID
    let query = { _id: id };
    try {
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      }
    } catch (e) { }

    const hoarding = await collection.findOne(query);

    if (hoarding) {
      res.json({
        success: true,
        data: normalizeHoarding(hoarding)
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Hoarding not found'
      });
    }
  } catch (error) {
    console.error('Error fetching hoarding:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Utility routes for filters
app.get('/api/regions', async (req, res) => {
  try {
    if (!db) {
      return res.json({ success: true, data: [] });
    }

    const collection = db.collection('hoardings');
    const regions = await collection.distinct('region');
    res.json({ success: true, data: regions.sort() });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/types', async (req, res) => {
  try {
    if (!db) {
      return res.json({ success: true, data: [] });
    }

    const collection = db.collection('hoardings');
    const types = await collection.distinct('type');
    res.json({ success: true, data: types.sort() });
  } catch (error) {
    console.error('Error fetching types:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Contact form submission endpoint with Joi validation
app.post('/api/inquiries', async (req, res) => {
  try {
    // Phase 2: Schema Validation
    const schema = Joi.object({
      name: Joi.string().required().max(100),
      email: Joi.string().email().required(),
      phone: Joi.string().allow('', null),
      companyName: Joi.string().allow('', null),
      location: Joi.string().allow('', null),
      industry: Joi.string().allow('', null),
      industryOther: Joi.string().allow('', null),
      businessBrief: Joi.string().allow('', null),
      onlinePresence: Joi.string().allow('', null),
      onlineLinks: Joi.string().allow('', null),
      serviceType: Joi.string().allow('', null),
      serviceTypeOther: Joi.string().allow('', null),
      mainGoal: Joi.string().allow('', null),
      budget: Joi.string().allow('', null),
      timeline: Joi.string().allow('', null),
      referralSource: Joi.string().allow('', null),
      referralOther: Joi.string().allow('', null),
      additionalNotes: Joi.string().allow('', null),
      message: Joi.string().allow('', null),
      hoardingId: Joi.string().allow('', null),
      hoardingTitle: Joi.string().allow('', null),
      hoardingLocation: Joi.string().allow('', null),
      hoardingPrice: Joi.number().allow(null),
      hoardingDimensions: Joi.string().allow('', null),
      hoardingType: Joi.string().allow('', null),
      hoardingPrintingCharges: Joi.number().allow(null),
      hoardingMountingCharges: Joi.number().allow(null),
      hoardingTotalCharges: Joi.number().allow(null),
    }).unknown(true);

    const { error } = schema.validate(req.body);
    if (error) {
      console.log('⚠️ Validation Error:', error.details[0].message);
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const inquiryData = {
      id: `inquiry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...req.body,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    // Store inquiry in MongoDB
    if (db) {
      await db.collection('inquiries').insertOne(inquiryData);
    }

    console.log('✅ New inquiry received for ID:', inquiryData.id);
    console.log('📦 Questionnaire Payload:', JSON.stringify(req.body, null, 2));

    // Send email via Resend
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key_here') {
      console.log('📨 Attempting to send comprehensive project email via Resend...');
      try {
        const data = req.body;

        // Find owner email if it's a hoarding inquiry
        let providerEmail = null;
        if (db && data.hoardingId) {
          try {
            const hoarding = await db.collection('hoardings').findOne({
              $or: [{ id: data.hoardingId }, { _id: data.hoardingId }]
            });
            if (hoarding && hoarding.ownerId) {
              const owner = await db.collection('users').findOne({ id: hoarding.ownerId });
              providerEmail = owner?.email;
              if (providerEmail) console.log(`📧 Found provider email: ${providerEmail}`);
            }
          } catch (dbError) {
            console.error('Error fetching owner email:', dbError);
          }
        }

        // Log the full payload for verification
        console.log('📦 Questionnaire Payload Received:', JSON.stringify(data, null, 2));

        // Define standard categories to organize the email precisely matching the form
        const categories = {
          "👤 Contact Information": ["name", "companyName", "email", "phone", "location"],
          "💼 Business Details": ["industry", "industryOther", "businessBrief", "onlinePresence", "onlineLinks"],
          "📋 Project Requirements": ["serviceType", "serviceTypeOther", "message", "mainGoal"],
          "📅 Budget & Timeline": ["budget", "timeline"],
          "📣 Final Details": ["referralSource", "referralOther", "additionalNotes"],
          "🏙️ Hoarding Details": [
            "hoardingTitle", "hoardingLocation", "hoardingPrice", "hoardingDimensions",
            "hoardingType", "hoardingPrintingCharges", "hoardingMountingCharges", "hoardingTotalCharges"
          ]
        };

        // Track which fields we've already handled
        const handledFields = new Set([
          "id", "status", "createdAt", "subject", "type", "submittedAt",
          "message", "hoardingId", "_id"
        ]);
        Object.values(categories).flat().forEach(f => handledFields.add(f));

        // Function to format field names for display
        const formatLabel = (key) => {
          return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .replace("Url", " URL")
            .replace("Id", " ID");
        };

        // Function to format values
        const formatValue = (val) => {
          if (val === null || val === undefined || val === "") return "N/A";
          if (typeof val === "object") {
            if (val.startDate && val.endDate) {
              return `${new Date(val.startDate).toLocaleDateString()} to ${new Date(val.endDate).toLocaleDateString()}`;
            }
            return `<pre style="font-size: 11px; color: #666; margin: 0;">${JSON.stringify(val, null, 2)}</pre>`;
          }
          return val.toString();
        };

        // Build sections
        let sectionsHtml = "";

        // 1. Prominent Message Section first
        if (data.message) {
          sectionsHtml += `
            <div style="background: #fdf4ff; border: 1px solid #f5d0fe; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
              <h2 style="color: #c026d3; margin: 0 0 10px 0; font-size: 18px; display: flex; items-center: center;">📝 Project Description</h2>
              <p style="margin: 0; color: #4b5563; white-space: pre-line; line-height: 1.6;">${data.message}</p>
            </div>
          `;
        }

        // 2. Map Categorized Fields
        for (const [sectionTitle, fields] of Object.entries(categories)) {
          const sectionData = fields
            .filter(f => data[f] && data[f] !== "N/A" && data[f] !== "")
            .map(f => {
              let label = formatLabel(f);
              let value = formatValue(data[f]);
              if (f === "industry" && data[f] === "Other") return null;
              if (f === "industryOther") label = "Industry";
              if (f === "serviceType" && data[f] === "Other") return null;
              if (f === "serviceTypeOther") label = "Service Type";
              if (f === "referralSource" && data[f] === "Other") return null;
              if (f === "referralOther") label = "Referral Source";
              return `<tr><td style="padding: 10px 0; font-weight: bold; width: 160px; color: #6b7280; font-size: 14px;">${label}</td><td style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 500;">${value}</td></tr>`;
            })
            .filter(Boolean);

          if (sectionData.length > 0) {
            sectionsHtml += `
              <div style="margin-top: 35px;">
                <h2 style="color: #9333ea; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 12px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">${sectionTitle}</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  ${sectionData.join("")}
                </table>
              </div>
            `;
          }
        }

        // 3. Dynamic "All Questionnaire Responses" logic (Catches everything else)
        const miscellaneousFields = Object.keys(data)
          .filter(key => !handledFields.has(key) && data[key] !== null && data[key] !== undefined && data[key] !== "")
          .map(key => `<tr><td style="padding: 10px 0; font-weight: bold; width: 160px; color: #6b7280; font-size: 14px;">${formatLabel(key)}</td><td style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 500;">${formatValue(data[key])}</td></tr>`);

        if (miscellaneousFields.length > 0) {
          sectionsHtml += `
            <div style="margin-top: 35px; background: #f9fafb; border-radius: 16px; padding: 20px;">
              <h2 style="color: #4b5563; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px; text-transform: uppercase;">🧩 Extended Questionnaire Data</h2>
              <table style="width: 100%; border-collapse: collapse;">
                ${miscellaneousFields.join("")}
              </table>
            </div>
          `;
        }

        const htmlContent = `
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 650px; margin: 20px auto; color: #111827; line-height: 1.5; border: 1px solid #e5e7eb; border-radius: 24px; overflow: hidden; background: #ffffff;">
            <div style="background: #9333ea; background: linear-gradient(135deg, #9333ea 0%, #db2777 100%); padding: 45px 30px; text-align: center; color: #ffffff;">
              <span style="background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; margin-bottom: 15px; display: inline-block;">Incoming Inquiry</span>
              <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Business Inquiry Received</h1>
              <p style="margin: 12px 0 0; opacity: 0.9; font-size: 16px; font-weight: 500;">A complete questionnaire response has been captured from your website.</p>
            </div>
            
            <div style="padding: 40px 30px;">
              ${sectionsHtml}

              <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #f3f4f6; text-align: center; font-size: 12px; color: #9ca3af;">
                <p style="margin-bottom: 10px; font-weight: 500; color: #6b7280;">Sent via KAKI Intelligent Backend Engine</p>
                <div style="font-family: monospace; background: #f9fafb; display: inline-block; padding: 4px 10px; border-radius: 6px; color: #374151; font-weight: bold; border: 1px solid #e5e7eb;">
                  ID: ${inquiryData.id}
                </div>
                <p style="margin-top: 20px;">© ${new Date().getFullYear()} KAKI Marketing. All rights reserved.</p>
              </div>
            </div>
          </div>
        `;

        const recipients = ['connect@kakihelpsbrands.com'];
        if (providerEmail) {
          recipients.push(providerEmail);
        }

        await resend.emails.send({
          from: 'Kaki Marketing <onboarding@resend.dev>',
          to: recipients,
          subject: `New Inquiry: ${data.name || 'Inquiry'} ${data.hoardingTitle ? 'for ' + data.hoardingTitle : ''}`,
          html: htmlContent,
          replyTo: data.email || 'connect@kakihelpsbrands.com'
        });

        console.log('✅ Notification email sent successfully by Backend Engine');
      } catch (emailError) {
        console.error('❌ Error sending email from backend:', emailError);
      }
    } else {
      console.warn('⚠️ EMAIL NOT SENT: RESEND_API_KEY is missing or invalid in server/.env');
    }

    res.json({
      success: true,
      message: 'Inquiry captured in database',
      inquiryId: inquiryData.id
    });

  } catch (error) {
    console.error('Submission Error:', error);
    res.status(500).json({
      success: false,
      message: 'Processing Error: ' + error.message
    });
  }
});

// Get user specific inquiries
app.get('/api/user/inquiries', authMiddleware, async (req, res) => {
  try {
    if (!db) {
      return res.json({ success: true, data: [] });
    }

    // Find hoardings owned by user to get their IDs
    const hoardings = await db.collection('hoardings').find({ ownerId: req.user.id }).toArray();
    // Some hoardings might use string id, some _id
    const hoardingIds = hoardings.map(h => h.id || (h._id ? h._id.toString() : null)).filter(Boolean);

    // Find inquiries for these hoardings
    const inquiries = await db.collection('inquiries').find({
      hoardingId: { $in: hoardingIds }
    }).sort({ createdAt: -1 }).toArray();

    res.json({
      success: true,
      data: inquiries
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all inquiries (Admin Only)
app.get('/api/inquiries', adminAuthMiddleware, async (req, res) => {
  try {
    if (!db) return res.json({ success: true, data: [] });
    // Sort by latest first
    const inquiries = await db.collection('inquiries').find({}).sort({ createdAt: -1 }).toArray();
    res.json({
      success: true,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an inquiry - Enhanced security
// This can be done by the hoarding owner OR an admin
// Delete inquiry (Admin Only - Phase 2)
app.delete('/api/inquiries/:id', adminAuthMiddleware, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, message: 'Database not connected' });
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Auth required' });

    let isAuthorized = false;
    let query = { id: id };
    try {
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
      }
    } catch (e) { }

    // 1. Try to verify as Admin first (highest privilege)
    try {
      const decodedAdmin = jwt.verify(token, process.env.JWT_ADMIN_SECRET || 'your-admin-secret-key');
      if (decodedAdmin.isAdmin) isAuthorized = true;
    } catch (adminErr) {
      // 2. Try to verify as User/Provider
      try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const inq = await db.collection('inquiries').findOne(query);
        if (inq) {
          const hoardingId = inq.hoardingId;
          let hQuery = { id: hoardingId };
          try {
            if (ObjectId.isValid(hoardingId)) {
              hQuery = { $or: [{ _id: new ObjectId(hoardingId) }, { id: hoardingId }] };
            }
          } catch (e) { }

          const h = await db.collection('hoardings').findOne(hQuery);
          if (h && h.ownerId?.toString() === decodedUser.id?.toString()) isAuthorized = true;
        }
      } catch (userErr) { }
    }

    if (!isAuthorized) return res.status(403).json({ success: false, message: 'Unauthorized' });

    const result = await db.collection('inquiries').deleteOne(query);

    if (result.deletedCount === 1) {
      res.json({ success: true, message: 'Inquiry deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update inquiry (status, notes, etc.) - For Providers
app.put('/api/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, message: 'Database not connected' });
    const { id } = req.params;
    const updateData = req.body;

    console.log(`[Inquiry Update] ID: ${id}, User: ${req.user.id}`);

    // Ownership check: Find the inquiry first
    let query = { id: id };
    try {
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
      }
    } catch (e) { }

    const inquiry = await db.collection('inquiries').findOne(query);
    if (!inquiry) {
      console.log(`[Inquiry Update] Inquiry not found: ${id}`);
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    // Find the hoarding to check owner
    const hoardingId = inquiry.hoardingId;
    let hQuery = { id: hoardingId };
    try {
      if (ObjectId.isValid(hoardingId)) {
        hQuery = { $or: [{ _id: new ObjectId(hoardingId) }, { id: hoardingId }] };
      }
    } catch (e) {
      console.log(`[Inquiry Update] Invalid hoardingId format: ${hoardingId}`);
    }

    const hoarding = await db.collection('hoardings').findOne(hQuery);

    if (!hoarding) {
      console.log(`[Inquiry Update] Associated hoarding not found: ${hoardingId}`);
      return res.status(403).json({ success: false, message: 'Access denied (Hoarding not found)' });
    }

    if (hoarding.ownerId?.toString() !== req.user.id?.toString()) {
      console.log(`[Inquiry Update] Ownership mismatch! Hoarding Owner: ${hoarding.ownerId}, Current User: ${req.user.id}`);
      return res.status(403).json({ success: false, message: 'Access denied (Ownership mismatch)' });
    }

    const allowedFields = ['status', 'internalNotes', 'lastContacted', 'paymentStatus'];
    const filteredUpdate = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) filteredUpdate[key] = updateData[key];
    });

    filteredUpdate.updatedAt = new Date().toISOString();

    await db.collection('inquiries').updateOne(
      query,
      { $set: filteredUpdate }
    );

    // If status is confirmed, we keep the hoarding available but the calendar will block the dates
    if (filteredUpdate.status === 'confirmed') {
      console.log(`[Inquiry Update] Inquiry ${id} confirmed. Dates will be blocked in calendar.`);
      // We don't mark as 'Booked' globally unless you want it to be completely unavailable
    }

    console.log(`[Inquiry Update] Successfully updated inquiry: ${id}`);
    res.json({ success: true, message: 'Inquiry updated' });
  } catch (error) {
    console.error('[Inquiry Update] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update inquiry - FOR ADMIN CMS (Compatibility)
app.put('/api/inquiries/:id/status', adminAuthMiddleware, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, message: 'Database not connected' });
    const { id } = req.params;
    const { status } = req.body;

    await db.collection('inquiries').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: { status: status || 'read', updatedAt: new Date().toISOString() } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Availability endpoints
app.get('/api/hoardings/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[API] Fetching availability for ID: ${id}`);

    let availability = [];
    if (db) {
      // 1. Get manual availability data
      const doc = await db.collection('availability').findOne({
        $or: [
          { hoardingId: id },
          { id: id }
        ]
      });

      if (doc) {
        availability = doc.data || [];
      }

      // 2. Automatically find inquiries and mark those dates as booked
      // For now including 'contacted' as well to match user testing data
      const blockingInquiries = await db.collection('inquiries').find({
        $or: [
          { hoardingId: id },
          { hoardingId: new ObjectId(id) }
        ],
        status: { $in: ['confirmed', 'Confirmed', 'contacted', 'Contacted'] }
      }).toArray();

      blockingInquiries.forEach(inq => {
        if (inq.selectedDates && inq.selectedDates.startDate && inq.selectedDates.endDate) {
          try {
            // Use local date parts to avoid UTC shifting
            const [sYear, sMonth, sDay] = inq.selectedDates.startDate.split('-').map(Number);
            const [eYear, eMonth, eDay] = inq.selectedDates.endDate.split('-').map(Number);

            const start = new Date(sYear, sMonth - 1, sDay);
            const end = new Date(eYear, eMonth - 1, eDay);

            let count = 0;
            let current = new Date(start);
            while (current <= end && count < 366) {
              count++;
              const y = current.getFullYear();
              const m = String(current.getMonth() + 1).padStart(2, '0');
              const d = String(current.getDate()).padStart(2, '0');
              const dateStr = `${y}-${m}-${d}`;

              if (!availability.some(a => a.date === dateStr)) {
                availability.push({ date: dateStr, status: 'booked' });
              }
              current.setDate(current.getDate() + 1);
            }
          } catch (e) {
            console.error('Error processing inquiry dates:', e);
          }
        }
      });
    }

    res.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch availability' });
  }
});

// Get public bookings for a hoarding
app.get('/api/hoardings/:id/bookings', async (req, res) => {
  try {
    const { id } = req.params;
    if (!db) return res.json({ success: true, data: [] });

    const bookings = await db.collection('inquiries').find({
      $or: [
        { hoardingId: id },
        { hoardingId: new ObjectId(id) }
      ],
      status: { $in: ['confirmed', 'Confirmed', 'contacted', 'Contacted'] }
    }).project({
      name: 1,
      company: 1,
      selectedDates: 1,
      status: 1,
      submittedAt: 1
    }).sort({ 'selectedDates.startDate': 1 }).toArray();

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/hoardings/:id/availability', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    if (db) {
      await db.collection('availability').updateOne(
        { hoardingId: id },
        { $set: { data: availability, updatedAt: new Date() } },
        { upsert: true }
      );
    }

    console.log(`Updated availability for hoarding ${id}:`, availability.length, 'dates');

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: availability
    });

  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability'
    });
  }
});

// Hoarding CRUD endpoints for admin
app.get('/api/admin/hoardings', adminAuthMiddleware, async (req, res) => {
  try {
    const collection = db.collection('hoardings');
    const hoardings = await collection.find({}).toArray();
    const mappedHoardings = hoardings.map(normalizeHoarding);

    res.json({
      success: true,
      data: mappedHoardings
    });
  } catch (error) {
    console.error('Error fetching admin hoardings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/hoardings', adminAuthMiddleware, async (req, res) => {
  try {
    const newHoarding = req.body;

    // Generate new hoarding with defaults
    const hoardingToInsert = {
      ...newHoarding,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure required fields have defaults
      dimensions: newHoarding.dimensions || 'Standard',
      impressions: newHoarding.impressions || '1K / week',
      // Use first uploaded image as primary, or fallback to generated image
      imageUrl: (newHoarding.images && newHoarding.images.length > 0)
        ? newHoarding.images[0]
        : (newHoarding.imageUrl || generateImageUrl(newHoarding.title || 'New Hoarding', 0)),
      images: newHoarding.images || [],
      totalSqft: newHoarding.totalSqft || 1000,
      printingCharges: newHoarding.printingCharges || 0,
      mountingCharges: newHoarding.mountingCharges || 0,
      totalCharges: newHoarding.totalCharges || (newHoarding.price || 0) + (newHoarding.printingCharges || 0) + (newHoarding.mountingCharges || 0),
      availability: newHoarding.availability || 'available',
      lightingType: newHoarding.lightingType || 'Non-Lit',
      featured: newHoarding.featured || false,
    };

    // Insert into MongoDB
    const collection = db.collection('hoardings');
    const result = await collection.insertOne(hoardingToInsert);

    console.log('Created new admin hoarding:', result.insertedId);

    res.json({
      success: true,
      message: 'Hoarding created successfully',
      data: { ...hoardingToInsert, _id: result.insertedId, id: result.insertedId.toString() }
    });

  } catch (error) {
    console.error('Error creating hoarding:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hoarding'
    });
  }
});

app.put('/api/admin/hoardings/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedHoardingData = req.body;

    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const collection = db.collection('hoardings');

    // Try both ObjectId and string ID for maximum compatibility
    let query = { _id: id };
    try {
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      }
    } catch (e) { }

    // Find the current data to see if it exists
    const currentHoarding = await collection.findOne(query);
    if (!currentHoarding) {
      return res.status(404).json({
        success: false,
        message: 'Hoarding not found'
      });
    }

    // Combine current and updated data
    const finalUpdate = { ...updatedHoardingData, updatedAt: new Date() };
    // Remove ID fields from set to avoid immutability error in MongoDB
    delete finalUpdate._id;
    delete finalUpdate.id;

    const result = await collection.findOneAndUpdate(
      query,
      { $set: finalUpdate },
      { returnDocument: 'after' }
    );

    const finalHoarding = result.value || result;

    // Sync JSON fallback
    if (!db.isMock && fs.existsSync(HOARDINGS_FILE)) {
      const hoardings = loadJsonData(HOARDINGS_FILE);
      const normalized = normalizeHoarding(finalHoarding);
      const existingIndex = hoardings.findIndex(h => (h.id || h._id?.toString()) === id);
      if (existingIndex > -1) {
        hoardings[existingIndex] = normalized;
      } else {
        hoardings.push(normalized);
      }
      saveJsonData(HOARDINGS_FILE, hoardings);
    }

    console.log('Updated hoarding (admin):', id);

    res.json({
      success: true,
      message: 'Hoarding updated successfully',
      data: normalizeHoarding(finalHoarding)
    });

  } catch (error) {
    console.error('Error updating hoarding:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hoarding'
    });
  }
});

app.delete('/api/admin/hoardings/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }

    const collection = db.collection('hoardings');

    // Try both ObjectId and string ID for maximum compatibility
    let query = { _id: id };
    try {
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      }
    } catch (e) { }

    const result = await collection.findOneAndDelete(query);

    if (!result.value && !result) {
      return res.status(404).json({
        success: false,
        message: 'Hoarding not found'
      });
    }

    // Also remove availability data
    await db.collection('availability').deleteOne({ hoardingId: id });

    // If in Mock/JSON mode, the save logic is already handled by the mockStore proxy
    // if using the real DB, we also want to keep the JSON fallback in sync
    if (!db.isMock && fs.existsSync(HOARDINGS_FILE)) {
      const hoardings = loadJsonData(HOARDINGS_FILE);
      const filtered = hoardings.filter(h => (h.id || h._id?.toString()) !== id);
      saveJsonData(HOARDINGS_FILE, filtered);
    }

    console.log('Deleted hoarding:', id);

    res.json({
      success: true,
      message: 'Hoarding deleted successfully',
      data: result.value || result
    });

  } catch (error) {
    console.error('Error deleting hoarding:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hoarding'
    });
  }
});

// Website Content Management
app.get('/api/content/:page', async (req, res) => {
  try {
    const { page } = req.params;
    // Load from local file first as a baseline
    let contentData = loadJsonData(WEBSITE_CONTENT_FILE, {});

    // If database is available, merge/override with live database content
    if (db) {
      try {
        const collection = db.collection('website_content');
        const dbPages = await collection.find({}).toArray();
        dbPages.forEach(doc => {
          if (doc.page && doc.data) {
            // Robust Merge Strategy:
            // 1. If it's a list (array, like blogs), only overwrite if DB version has >= content or JSON is empty
            if (Array.isArray(doc.data)) {
              const localCount = (contentData[doc.page] || []).length;
              const dbCount = doc.data.length;
              if (dbCount >= localCount || localCount === 0) {
                contentData[doc.page] = doc.data;
              } else {
                console.log(`⚠️ [Sync] Skipping DB overwrite for "${doc.page}" (array): DB(${dbCount}) < JSON(${localCount})`);
              }
            }
            // 2. Specialized handling for "works" (object with projects list)
            else if (doc.page === 'works' && doc.data.projects && Array.isArray(doc.data.projects)) {
              const localCount = (contentData.works?.projects || []).length;
              const dbCount = doc.data.projects.length;
              if (dbCount >= localCount || localCount === 0) {
                contentData.works = doc.data;
              } else {
                console.log(`⚠️ [Sync] Skipping DB overwrite for "works" (projects): DB(${dbCount}) < JSON(${localCount})`);
              }
            }
            // 3. For other pages (objects), merge if not empty
            else if (typeof doc.data === 'object' && Object.keys(doc.data).length > 0) {
              contentData[doc.page] = doc.data;
            }
          }
        });
        console.log('✅ [Sync] Cloud content merge complete');
      } catch (dbError) {
        console.error('⚠️ [Sync] Failed to merge database content:', dbError);
      }
    }

    if (page === 'all') {
      res.json({ success: true, data: contentData });
      return;
    }

    const pageContent = contentData[page];
    if (pageContent) {
      res.json({ success: true, data: pageContent });
    } else {
      res.status(404).json({ success: false, message: 'Content not found: ' + page });
    }
  } catch (error) {
    console.error(`❌ Content API Error (${req.params.page}):`, error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/content/:page', adminAuthMiddleware, async (req, res) => {
  try {
    const { page } = req.params;
    const contentData = req.body;
    console.log(`📝 [Admin] Received content update for page: ${page} by admin: ${req.admin?.email}`);

    if (page === 'all') {
      console.log('💾 [Admin] Saving ALL website content');
      saveJsonData(WEBSITE_CONTENT_FILE, contentData);

      if (db) {
        const collection = db.collection('website_content');
        const pages = Object.keys(contentData);
        let saveFailures = [];
        for (const p of pages) {
          try {
            if (p === 'blogs') {
              console.log(`💾 [MongoDB] Syncing ${contentData[p].length} blogs to cloud...`);
            }
            await collection.updateOne(
              { page: p },
              { $set: { data: contentData[p], updatedAt: new Date(), updatedBy: req.admin?.id } },
              { upsert: true }
            );
          } catch (e) {
            console.error(`❌ [MongoDB] Failed to sync page "${p}":`, e.message);
            saveFailures.push(p);
          }
        }
        if (saveFailures.length > 0) {
          return res.status(500).json({
            success: false,
            message: `Cloud sync failed for: ${saveFailures.join(', ')}. Local save successful.`
          });
        }
      }
      res.json({ success: true, message: 'Website content updated everywhere', data: contentData });
      return;
    }

    // 1. Persist to MongoDB if available
    if (db) {
      const collection = db.collection('website_content');
      await collection.updateOne(
        { page: page },
        { $set: { data: contentData, updatedAt: new Date(), updatedBy: req.admin.id } },
        { upsert: true }
      );
      console.log(`✅ [MongoDB] Website content updated for page: ${page}`);
    } else {
      console.log(`⚠️ [MongoDB] Database disconnected. Bypassing cloud save for: ${page}`);
    }

    // 2. ALWAYS Persist to JSON Fallback for reliability
    const allContent = loadJsonData(WEBSITE_CONTENT_FILE, {});
    allContent[page] = contentData;
    saveJsonData(WEBSITE_CONTENT_FILE, allContent);
    console.log(`💾 [JSON] Content safely backed up to ${WEBSITE_CONTENT_FILE}`);

    res.json({ success: true, message: 'Content updated successfully', data: contentData });
  } catch (error) {
    console.error('❌ [Admin] Error updating website content:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// User-specific hoarding endpoints
app.get('/api/user/hoardings', authMiddleware, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }
    const userId = req.user.id;
    const { region, type, maxPrice, searchQuery, sortBy } = req.query;

    // Build query - only return hoardings owned by this user OR hoardings with no owner (legacy/unclaimed)
    const ownershipFilter = {
      $or: [
        { ownerId: userId },
        { ownerId: { $exists: false } },
        { ownerId: null },
        { ownerId: "" }
      ]
    };

    let query = { ...ownershipFilter };

    if (region && region !== 'All') query.region = region;
    if (type && type !== 'All') query.type = type;
    if (maxPrice) query.price = { $lte: parseInt(maxPrice) };
    if (searchQuery) {
      query = {
        $and: [
          ownershipFilter,
          {
            $or: [
              { title: { $regex: searchQuery, $options: 'i' } },
              { location: { $regex: searchQuery, $options: 'i' } }
            ]
          }
        ]
      };
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'price-asc': sort = { price: 1 }; break;
      case 'price-desc': sort = { price: -1 }; break;
      default: sort = { createdAt: -1 };
    }

    // Get hoardings owned by this user
    const userHoardings = await db.collection('hoardings').find(query).sort(sort).toArray();
    const mappedUserHoardings = userHoardings.map(normalizeHoarding);

    res.json({
      success: true,
      data: mappedUserHoardings
    });

  } catch (error) {
    console.error('Error fetching user hoardings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user hoardings'
    });
  }
});

app.post('/api/user/hoardings', authMiddleware, async (req, res) => {
  try {
    console.log('POST /api/user/hoardings - Request received');
    console.log('User from auth middleware:', req.user);
    console.log('Request body:', req.body);

    if (!db) {
      console.log('Database not connected - cannot create hoarding');
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

    const userId = req.user.id;

    if (!db) {
      console.log('Database not connected - cannot fetch user hoardings');
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

    // Get user from MongoDB
    const usersCollection = db.collection('users');
    let user = await usersCollection.findOne({ id: userId });

    // Fallback by email if ID is somehow mismatched
    if (!user && req.user.email) {
      user = await usersCollection.findOne({ email: req.user.email });
    }

    console.log('Found user:', user);

    const newHoardingData = req.body;

    // Validate required fields
    const requiredFields = ['title', 'location', 'region', 'price', 'type', 'status'];

    // Ensure all numeric fields are actual numbers so frontend filters/sorts work
    const priceNum = parseInt(newHoardingData.price) || 0;
    const printCost = parseInt(newHoardingData.printingCharges) || 0;
    const mountCost = parseInt(newHoardingData.mountingCharges) || 0;

    const newHoarding = {
      ...newHoardingData,
      price: priceNum,
      printingCharges: printCost,
      mountingCharges: mountCost,
      ownerId: req.user.id,
      ownerName: user?.name || req.user.name || 'Unknown Provider',
      ownerCompany: user?.company || req.user.company || 'Unknown Company',
      ownerPhone: user?.phone || req.user.phone || 'Not provided',
      ownerEmail: user?.email || req.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure required fields have defaults
      dimensions: newHoardingData.dimensions || 'Standard',
      impressions: newHoardingData.impressions || '1K / week',
      // Use first uploaded image as primary, or fallback to generated image
      imageUrl: (newHoardingData.images && newHoardingData.images.length > 0)
        ? newHoardingData.images[0]
        : (newHoardingData.imageUrl || generateImageUrl(newHoardingData.title || 'New Hoarding', 0)),
      images: newHoardingData.images || [],
      totalSqft: parseInt(newHoardingData.totalSqft) || 1000,
      totalCharges: newHoardingData.totalCharges || (priceNum + printCost + mountCost),
      availability: newHoardingData.availability || 'available',
      lightingType: newHoardingData.lightingType || 'Non-Lit',
      featured: false, // Only admin can feature
    };

    // Insert into MongoDB
    if (!db) {
      console.log('Database not connected - cannot create hoarding');
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

    const collection = db.collection('hoardings');
    const result = await collection.insertOne(newHoarding);

    const savedHoarding = { ...newHoarding, id: result.insertedId.toString(), _id: result.insertedId };

    // Sync JSON fallback
    if (!db.isMock && fs.existsSync(HOARDINGS_FILE)) {
      const hoardings = loadJsonData(HOARDINGS_FILE);
      hoardings.push(normalizeHoarding(savedHoarding));
      saveJsonData(HOARDINGS_FILE, hoardings);
    }

    console.log('Created new user hoarding:', result.insertedId);

    res.json({
      success: true,
      message: 'Hoarding created successfully',
      data: savedHoarding
    });

  } catch (error) {
    console.error('Error creating hoarding:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hoarding'
    });
  }
});

app.put('/api/user/hoardings/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const collection = db.collection('hoardings');

    // Try both ObjectId and string ID
    let query = { _id: id };
    try {
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      }
    } catch (e) { }

    // Find hoarding and ensure it belongs to the authenticated user
    const hoarding = await collection.findOne(query);

    if (!hoarding) {
      return res.status(404).json({
        success: false,
        message: 'Hoarding not found'
      });
    }

    // Allow update if either the user owns it OR if it has no owner yet (transition/claiming)
    const isOwner = hoarding.ownerId === req.user.id;
    const isUnowned = !hoarding.ownerId || hoarding.ownerId === "" || hoarding.ownerId === null;

    if (!isOwner && !isUnowned) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own hoardings'
      });
    }

    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;
    delete updateData.id;

    // Update hoarding
    await collection.updateOne(query, { $set: updateData });
    const finalHoarding = { ...hoarding, ...updateData };

    // Sync JSON fallback
    if (!db.isMock && fs.existsSync(HOARDINGS_FILE)) {
      const hoardings = loadJsonData(HOARDINGS_FILE);
      const normalized = normalizeHoarding(finalHoarding);
      const existingIndex = hoardings.findIndex(h => (h.id || h._id?.toString()) === id);
      if (existingIndex > -1) {
        hoardings[existingIndex] = normalized;
      } else {
        hoardings.push(normalized);
      }
      saveJsonData(HOARDINGS_FILE, hoardings);
    }

    console.log('Updated hoarding (user):', id);

    res.json({
      success: true,
      message: 'Hoarding updated successfully',
      data: normalizeHoarding(finalHoarding)
    });

  } catch (error) {
    console.error('Error updating hoarding:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hoarding'
    });
  }
});

app.delete('/api/user/hoardings/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const collection = db.collection('hoardings');

    // Try both ObjectId and string ID
    let query = { _id: id };
    try {
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      }
    } catch (e) { }

    // Find hoarding and ensure it belongs to the authenticated user
    const hoarding = await collection.findOne(query);

    if (!hoarding) {
      return res.status(404).json({
        success: false,
        message: 'Hoarding not found'
      });
    }

    // Allow delete if either the user owns it OR if it has no owner yet (transition)
    const isOwner = hoarding.ownerId === req.user.id;
    const isUnowned = !hoarding.ownerId || hoarding.ownerId === "" || hoarding.ownerId === null;

    if (!isOwner && !isUnowned) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own hoardings'
      });
    }

    // Delete hoarding
    const result = await collection.deleteOne(query);

    // Sync JSON fallback
    if (!db.isMock && fs.existsSync(HOARDINGS_FILE)) {
      const hoardings = loadJsonData(HOARDINGS_FILE);
      const filtered = hoardings.filter(h => (h.id || h._id?.toString()) !== id);
      saveJsonData(HOARDINGS_FILE, filtered);
    }

    console.log('Deleted hoarding:', id);

    res.json({
      success: true,
      message: 'Hoarding deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting hoarding:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hoarding'
    });
  }
});

// 14. Update user profile
app.put('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, message: 'Database not connected' });

    const userId = req.user.id;
    const { name, email, company, phone, role } = req.body;

    const updateData = {
      name,
      company,
      phone,
      role,
      updatedAt: new Date().toISOString()
    };

    // Email is usually preserved or requires special verification, 
    // but for now we'll allow updating it if provided and unique
    if (email && email !== req.user.email) {
      const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      updateData.email = email.toLowerCase();
    }

    const result = await db.collection('users').updateOne(
      { id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 1) {
      // Get updated user data
      const updatedUser = await db.collection('users').findOne({ id: userId });
      const { password: _, ...userResponse } = updatedUser;

      // Sync JSON fallback
      if (!db.isMock && fs.existsSync(USERS_FILE)) {
        const users = loadJsonData(USERS_FILE);
        const index = users.findIndex(u => u.id === userId);
        if (index > -1) {
          users[index] = { ...users[index], ...updateData };
          saveJsonData(USERS_FILE, users);
        }
      }

      res.json({ success: true, message: 'Profile updated successfully', data: userResponse });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Global error handler for Multer and other errors
app.use((err, req, res, next) => {
  logger.error(`💥 [Global Error]: ${err.message}`, { stack: err.stack, path: req.path, method: req.method });

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File too large. Maximum size is 500MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }

  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message: isProduction ? 'An internal server error occurred.' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

// 15. Newsletter Subscribe
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    const subscriber = {
      email,
      subscribedAt: new Date(),
      source: 'blog'
    };

    // Save to JSON fallback
    let subscribers = loadJsonData(SUBSCRIBERS_FILE, []);
    if (!subscribers.some(s => s.email === email)) {
      subscribers.push(subscriber);
      saveJsonData(SUBSCRIBERS_FILE, subscribers);
    }

    // Save to MongoDB if available
    if (db) {
      const collection = db.collection('newsletter_subscribers');
      await collection.updateOne(
        { email: email },
        { $set: subscriber },
        { upsert: true }
      );
    }

    res.json({ success: true, message: 'Successfully subscribed to KAKI newsletter!' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ success: false, message: 'Server error during subscription' });
  }
});

const server = app.listen(port, '0.0.0.0', async () => {
  // Connect to MongoDB first
  await connectDB();
  logger.info(`🚀 KAKI Backend Engine listening at http://0.0.0.0:${port}`);

  // Sync Content Engine (Per-page restoration)
  if (db) {
    try {
      const websiteContent = loadJsonData(WEBSITE_CONTENT_FILE, {});
      const collection = db.collection('website_content');
      const pages = Object.keys(websiteContent);

      console.log('🔄 [Sync] Checking for missing database configurations...');

      for (const page of pages) {
        // Check if page exists in DB
        const exists = await collection.findOne({ page: page });

        // Check if the current data is valid or needs restoration
        const needsRestoration = !exists ||
          (Object.keys(exists.data || {}).length === 0) ||
          (page === 'lifeAtKaki' && (!exists.data?.youtube?.apiKey));

        if (needsRestoration && websiteContent[page]) {
          console.log(`🚀 [Sync] Restoring missing, empty, or critical config for: ${page}`);
          await collection.updateOne(
            { page: page },
            { $set: { data: websiteContent[page], updatedAt: new Date(), syncStatus: 'automated-restoration' } },
            { upsert: true }
          );
        }
      }
      console.log('✅ [Sync] Verification complete');
    } catch (syncError) {
      console.error('❌ [Sync] Content sync engine failed:', syncError);
    }
  }
});

// Increase server timeout for large file uploads (10 minutes)
server.timeout = 600000;
server.keepAliveTimeout = 600000;
server.headersTimeout = 610000;
