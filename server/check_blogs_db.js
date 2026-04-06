const { MongoClient } = require('mongodb');

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
        console.log(`Page: ${e.page} | Keys: ${Object.keys(e.data || {})}`);
        if (e.page === 'blogs') {
            console.log('Blogs Data Length:', e.data ? e.data.length : 'N/A');
            console.log('First Blog Title:', e.data?.[0]?.title);
        }
    });

    // Check individual entry for 'all' too if it exists
    const allEntry = await collection.findOne({ page: 'all' });
    if (allEntry) {
        console.log('\n--- ALL PAGE ENTRY ---');
        console.log('Keys in "all":', Object.keys(allEntry.data || {}));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkBlogs();
