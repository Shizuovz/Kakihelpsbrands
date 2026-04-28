import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaki_hoardings';
const ADMINS_FILE = path.join(process.cwd(), 'data', 'admins.json');

async function migratePasswords() {
  console.log('🚀 Starting Password Migration Utility...');
  
  // 1. Migrate MongoDB Users
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('kaki_hoardings');
    const usersCollection = db.collection('users');
    
    const users = await usersCollection.find({}).toArray();
    console.log(`🔍 Found ${users.length} users in database.`);
    
    let userCount = 0;
    for (const user of users) {
      if (!user.password) continue;
      
      // Check if already hashed
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        continue;
      }
      
      console.log(`  - Hashing password for user: ${user.email}`);
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword, updatedAt: new Date().toISOString() } }
      );
      userCount++;
    }
    console.log(`✨ Successfully hashed ${userCount} user passwords.`);
    
  } catch (err) {
    console.error('❌ MongoDB Migration Error:', err.message);
  } finally {
    await client.close();
  }

  // 2. Migrate Local Admins
  if (fs.existsSync(ADMINS_FILE)) {
    try {
      const adminsData = JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8'));
      console.log(`🔍 Found ${adminsData.length} admins in local file.`);
      
      let adminCount = 0;
      const updatedAdmins = await Promise.all(adminsData.map(async (admin) => {
        if (admin.password && !(admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$'))) {
          console.log(`  - Hashing password for admin: ${admin.email}`);
          admin.password = await bcrypt.hash(admin.password, 10);
          adminCount++;
        }
        return admin;
      }));
      
      if (adminCount > 0) {
        fs.writeFileSync(ADMINS_FILE, JSON.stringify(updatedAdmins, null, 2), 'utf8');
        console.log(`✨ Successfully hashed ${adminCount} admin passwords.`);
      } else {
        console.log('ℹ️ All admin passwords are already hashed.');
      }
    } catch (err) {
      console.error('❌ Admin Migration Error:', err.message);
    }
  } else {
    console.log('ℹ️ No admins.json file found to migrate.');
  }

  console.log('\n✅ Migration Complete!');
  process.exit(0);
}

migratePasswords();
