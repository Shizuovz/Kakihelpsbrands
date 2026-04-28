import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../server/.env' });

async function checkHoardings() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('kaki_hoardings');
    const collection = db.collection('hoardings');
    
    const allHoardings = await collection.find({}).toArray();
    console.log(`Total hoardings: ${allHoardings.length}`);
    
    const missingOwner = allHoardings.filter(h => !h.ownerId);
    console.log(`Hoardings missing ownerId: ${missingOwner.length}`);
    
    missingOwner.forEach(h => {
      console.log(`- ID: ${h.id || h._id}, Title: ${h.title}`);
    });

    const owners = [...new Set(allHoardings.map(h => h.ownerId).filter(Boolean))];
    console.log(`Unique owners: ${owners.length}`);
    owners.forEach(o => {
      const count = allHoardings.filter(h => h.ownerId === o).length;
      console.log(`- Owner: ${o}, Hoardings: ${count}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkHoardings();
