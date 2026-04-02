import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import { authMiddleware, register, login, getCurrentUser, resetPassword } from './auth.js';
import { adminAuthMiddleware, adminLogin, getAdminMe } from './adminAuth.js';

const app = express();
const port = process.env.PORT || 3001;

// 1. GLOBAL MIDDLEWARE (MUST BE FIRST)
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://kakihelpsbrands.vercel.app',
      'https://kakihelpsbrands-git-main-shizuovzs-projects.vercel.app'
    ];
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.options('*', cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));


// Path for JSON fallback storage
const DATA_DIR = path.join(process.cwd(), 'data');
const HOARDINGS_FILE = path.join(DATA_DIR, 'hoardings.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const AVAILABILITY_FILE = path.join(DATA_DIR, 'availability.json');
const WEBSITE_CONTENT_FILE = path.join(DATA_DIR, 'website_content.json');

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
            const result = col.filter(item => {
              for (const key in query) {
                if (key === '$text' || key === 'price' || key === 'hoardingId' || key === 'ownerId') {
                  if (key === 'ownerId' && query[key] !== item[key]) return false;
                  continue; 
                }
                if (query[key] !== undefined && item[key] !== query[key]) return false;
              }
              return true;
            });
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
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Authentication endpoints
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/reset-password', resetPassword);
app.get('/api/auth/me', authMiddleware, getCurrentUser);

// Separate ADMIN only auth routes
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/me', adminAuthMiddleware, getAdminMe);
app.post('/api/admin/upload', adminAuthMiddleware, upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const uploadedFiles = req.files.map(file => ({
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    }));
    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// File upload endpoint
app.post('/api/upload', authMiddleware, upload.array('images', 5), (req, res) => {
  try {
    console.log('Upload request received:', req.files);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    }));

    console.log('Files processed:', uploadedFiles);

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: db?.isMock ? 'Fallback (JSON/Memory)' : 'MongoDB Atlas',
    isMock: !!db?.isMock,
    uploads: fs.existsSync('./uploads')
  });
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    success: true,
    isMock: !!db?.isMock,
    storageType: db?.isMock ? 'JSON Files (Persistent Fallback)' : 'MongoDB Atlas',
    warning: db?.isMock ? '⚠️ System is in Fallback Mode. Data is saved in server/data/ but not in MongoDB cloud.' : null
  });
});

// Test upload endpoint without authentication (for debugging)
app.post('/api/upload-test', upload.array('images', 5), (req, res) => {
  try {
    console.log('Test upload request received:', req.files);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    }));

    console.log('Test files processed:', uploadedFiles);

    res.json({
      success: true,
      message: 'Test upload successful',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error in test upload:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
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

app.get('/api/user/hoardings', authMiddleware, async (req, res) => {
  try {
    if (!db) {
      console.log('Database not connected - cannot fetch user hoardings');
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }
    
    const collection = db.collection('hoardings');
    const { region, type, maxPrice, searchQuery, sortBy } = req.query;
    
    // Build query - only return hoardings owned by this user
    const query = { ownerId: req.user.id };
    
    console.log('🔍 DEBUG: User hoardings - Collection type:', typeof collection);
    console.log('🔍 DEBUG: User hoardings - Collection methods:', Object.keys(collection));
    
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
    console.error('Error fetching user hoardings:', error);
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
    } catch (e) {}
    
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

// Contact form submission endpoint
app.post('/api/inquiries', async (req, res) => {
  try {
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
    
    console.log('New inquiry received and saved to MongoDB:', inquiryData.id);
    
    res.json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiryId: inquiryData.id
    });
    
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry'
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

// Get all inquiries (for admin purposes)
app.get('/api/inquiries', async (req, res) => {
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

// Delete an inquiry
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, message: 'Database not connected' });
    const { id } = req.params;
    
    // Check both id string and MongoDB ObjectID
    const result = await db.collection('inquiries').deleteOne({ 
      $or: [
        { id: id },
        { _id: id }
      ] 
    });
    
    if (result.deletedCount === 1) {
      res.json({ success: true, message: 'Inquiry deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update inquiry status (Mark as read)
app.put('/api/inquiries/:id/status', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ success: false, message: 'Database not connected' });
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await db.collection('inquiries').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: { status: status || 'read' } }
    );
    
    if (result.matchedCount === 1) {
      res.json({ success: true, message: 'Inquiry status updated' });
    } else {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Availability endpoints
app.get('/api/hoardings/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[API] Fetching availability for ID: ${id}`);
    
    let availability = [];
    if (db) {
      // Robust lookup: check both hoardingId and potentially id if it was saved differently
      const doc = await db.collection('availability').findOne({ 
        $or: [
          { hoardingId: id },
          { id: id }
        ]
      });
      
      if (doc) {
        availability = doc.data || [];
        console.log(`[API] Found ${availability.length} dates for ${id}`);
      } else {
        console.log(`[API] No custom availability found for ${id}, using default`);
      }
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

app.post('/api/hoardings/:id/availability', async (req, res) => {
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
app.get('/api/admin/hoardings', async (req, res) => {
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

app.post('/api/admin/hoardings', async (req, res) => {
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

app.put('/api/admin/hoardings/:id', async (req, res) => {
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
    } catch (e) {}

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

app.delete('/api/admin/hoardings/:id', async (req, res) => {
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
    } catch (e) {}
    
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
    let content = null;
    
    if (page === 'all') {
      const allContent = loadJsonData(WEBSITE_CONTENT_FILE, {});
      res.json({ success: true, data: allContent });
      return;
    }

    if (db) {
      const collection = db.collection('website_content');
      content = await collection.findOne({ page: page }) || await collection.findOne({ id: page });
    }
    
    if (content) {
      res.json({ success: true, data: content.data || content });
    } else {
      const allContent = loadJsonData(WEBSITE_CONTENT_FILE, {});
      const pageContent = allContent[page];
      if (pageContent) {
        res.json({ success: true, data: pageContent });
      } else {
        res.status(404).json({ success: false, message: 'Content not found' });
      }
    }
  } catch (error) {
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
        for (const p of pages) {
          await collection.updateOne(
            { page: p },
            { $set: { data: contentData[p], updatedAt: new Date(), updatedBy: req.admin.id } },
            { upsert: true }
          );
        }
      }
      res.json({ success: true, message: 'All content updated successfully', data: contentData });
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

// Test hoarding creation endpoint without authentication (for debugging)
app.post('/api/user/hoardings-test', async (req, res) => {
  try {
    console.log('POST /api/user/hoardings-test - Request received');
    console.log('Request body:', req.body);
    
    const newHoardingData = req.body;
    
    // Generate new hoarding with mock user info
    const newHoarding = {
      ...newHoardingData,
      ownerId: 'test-user-001',
      ownerName: 'Test User',
      ownerCompany: 'Test Company',
      ownerPhone: '+91 12345 67890',
      ownerEmail: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Use first uploaded image as primary, or fallback to generated image
      imageUrl: (newHoardingData.images && newHoardingData.images.length > 0) 
        ? newHoardingData.images[0] 
        : (newHoardingData.imageUrl || generateImageUrl(newHoardingData.title || 'New Hoarding', 0)),
      totalSqft: newHoardingData.totalSqft || 1000,
      printingCharges: newHoardingData.printingCharges || 0,
      mountingCharges: newHoardingData.mountingCharges || 0,
      totalCharges: newHoardingData.totalCharges || (newHoardingData.price || 0) + (newHoardingData.printingCharges || 0) + (newHoardingData.mountingCharges || 0),
      availability: newHoardingData.availability || 'available',
    };
    
    // Insert into MongoDB
    const collection = db.collection('hoardings');
    const result = await collection.insertOne(newHoarding);
    
    console.log('Created new test hoarding:', result.insertedId);
    console.log('Hoarding images:', newHoarding.images);
    console.log('Hoarding imageUrl:', newHoarding.imageUrl);
    
    res.json({
      success: true,
      message: 'Test hoarding created successfully',
      data: { ...newHoarding, _id: result.insertedId }
    });
    
  } catch (error) {
    console.error('Error creating test hoarding:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test hoarding'
    });
  }
});

// User-specific hoarding endpoints
app.get('/api/user/hoardings', authMiddleware, async (req, res) => {
  try {
    if (!db) {
       return res.status(500).json({ success: false, message: 'Database not available' });
    }
    const userId = req.user.id;
    
    // Get hoardings owned by this user
    const userHoardings = await db.collection('hoardings').find({ ownerId: userId }).toArray();
    const mappedUserHoardings = userHoardings.map(h => ({
      ...h,
      id: h.id || (h._id ? h._id.toString() : null)
    }));
    
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
    } catch (e) {}

    // Find hoarding and ensure it belongs to the authenticated user
    const hoarding = await collection.findOne(query);
    
    if (!hoarding) {
      return res.status(404).json({
        success: false,
        message: 'Hoarding not found'
      });
    }
    
    if (hoarding.ownerId !== req.user.id) {
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
    } catch (e) {}

    // Find hoarding and ensure it belongs to the authenticated user
    const hoarding = await collection.findOne(query);
    
    if (!hoarding) {
      return res.status(404).json({
        success: false,
        message: 'Hoarding not found'
      });
    }
    
    if (hoarding.ownerId !== req.user.id) {
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

app.listen(port, '0.0.0.0', async () => {
  // Connect to MongoDB first
  await connectDB();
  console.log(`Hoardings API listening at http://0.0.0.0:${port}`);
});
