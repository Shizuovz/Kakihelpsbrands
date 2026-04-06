const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkBlogs() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaki_hoardings';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('kaki_hoardings');
    const collection = db.collection('website_content');
    
    console.log('--- COLLECTIONS ---');
    const collections = await db.listCollections().toArray();
    console.log(collections.map(c => c.name));
    
    console.log('\n--- WEBSITES CONTENT ENTRIES ---');
    const entries = await collection.find({}).toArray();
    entries.forEach(e => {
        console.log(`Page: ${e.page || e.id} | Keys: ${Object.keys(e.data || e || {}).filter(k => k !== '_id')}`);
        if (e.page === 'blogs') {
            console.log('Blogs Data Length:', e.data ? e.data.length : 'N/A');
            console.log('First Blog Title:', e.data?.[0]?.title);
        }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkBlogs();
