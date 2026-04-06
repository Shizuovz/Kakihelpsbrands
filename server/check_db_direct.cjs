const { MongoClient } = require('mongodb');

async function checkBlogs() {
  const uri = 'mongodb+srv://kakitech25_db_user:4VFbbdhtNCmvKLxp@kaki-hoardings.bktagno.mongodb.net/?appName=kaki-hoardings';
  const client = new MongoClient(uri);
  
  try {
    console.log('Connecting...');
    await client.connect();
    const db = client.db('kaki_hoardings');
    const collection = db.collection('website_content');
    
    console.log('Fetching entries...');
    const entries = await collection.find({}).toArray();
    
    console.log(`Found ${entries.length} pages in DB:`);
    entries.forEach(e => {
        const page = e.page || 'unknown';
        const keys = e.data ? Object.keys(e.data) : (e.id ? ['looks like old format'] : 'no data');
        console.log(` - ${page} (${typeof e.data === 'object' ? (Array.isArray(e.data) ? 'Array' : 'Object') : 'Other'}) | Items: ${Array.isArray(e.data) ? e.data.length : (e.data ? Object.keys(e.data).length : 0)}`);
        
        if (page === 'blogs') {
            const blogs = e.data || [];
            console.log('   Latest Blog in DB:', blogs[blogs.length-1]?.title || 'None');
            console.log('   Count:', blogs.length);
        }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkBlogs();
