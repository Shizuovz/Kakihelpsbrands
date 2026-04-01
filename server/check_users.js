import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaki_hoardings');

async function debugLoginSystem() {
  try {
    await client.connect();
    const db = client.db('kaki_hoardings');
    const users = await db.collection('users').find({}).toArray();
    
    console.log('\n===== DATABASE USER DUMP =====');
    if (users.length === 0) {
      console.log('NO USERS IN DATABASE!');
    } else {
      users.forEach(u => {
        console.log(`- [${u.email}] -> PW: [${u.password}] | ROLE: [${u.role}]`);
      });
    }
    console.log('============================\n');
    
    // Check if vinotovzzhimo@gmail.com exists
    const searchEmail = 'vinotovzzhimo@gmail.com';
    const user = await db.collection('users').findOne({ email: searchEmail });
    if (user) {
      console.log(`✅ USER FOUND: ${searchEmail}`);
      console.log(`✅ PASSWORD IS: ${user.password}`);
      if (user.password !== 'kaki123') {
        console.log('⚠️ WARNING: Password is NOT kaki123. Resetting it now...');
        await db.collection('users').updateOne({ email: searchEmail }, { $set: { password: 'kaki123' } });
        console.log('✅ FIXED: Password reset to kaki123');
      }
    } else {
      console.log(`❌ USER NOT FOUND: ${searchEmail}`);
      console.log('🛡️ Creating it now for you...');
      await db.collection('users').insertOne({
        id: 'provider-' + Date.now(),
        name: 'Vino',
        email: searchEmail,
        password: 'kaki123',
        role: 'provider',
        isActive: true,
        createdAt: new Date().toISOString()
      });
      console.log('✅ ACCOUNT CREATED: Use vinotovzzhimo@gmail.com / kaki123');
    }

  } catch (err) {
    console.error('DB ERROR:', err.message);
  } finally {
    await client.close();
  }
}

debugLoginSystem();
