// Test MongoDB connection with different options
const testMongoConnection = async () => {
  try {
    console.log('🔍 TESTING MONGODB CONNECTION OPTIONS\n');
    
    const { MongoClient } = await import('mongodb');
    
    // Test 1: Original connection string
    console.log('1️⃣ Testing original connection string...');
    const originalURI = 'mongodb+srv://kakitech25_db_user:4VFbbdhtNCmvKLxp@kaki-hoardings.bktagno.mongodb.net/?appName=kaki-hoardings';
    
    try {
      const client1 = new MongoClient(originalURI);
      await client1.connect();
      console.log('✅ Original connection successful');
      await client1.close();
    } catch (error1) {
      console.error('❌ Original connection failed:', error1.message);
    }
    
    // Test 2: With SSL options
    console.log('\n2️⃣ Testing with SSL options...');
    try {
      const client2 = new MongoClient(originalURI, {
        sslValidate: false,
        connectTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000
      });
      await client2.connect();
      console.log('✅ SSL-disabled connection successful');
      await client2.close();
    } catch (error2) {
      console.error('❌ SSL-disabled connection failed:', error2.message);
    }
    
    // Test 3: Direct MongoDB (no Atlas)
    console.log('\n3️⃣ Testing local MongoDB...');
    try {
      const client3 = new MongoClient('mongodb://localhost:27017/kaki_hoardings');
      await client3.connect();
      console.log('✅ Local MongoDB connection successful');
      await client3.close();
    } catch (error3) {
      console.error('❌ Local MongoDB failed:', error3.message);
    }
    
    // Test 4: With retry and different options
    console.log('\n4️⃣ Testing with comprehensive options...');
    try {
      const client4 = new MongoClient(originalURI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Try IPv4 first
        ssl: true,
        sslValidate: false,
        retryWrites: true,
        w: 'majority'
      });
      await client4.connect();
      console.log('✅ Comprehensive options connection successful');
      
      // Test database operations
      const db = client4.db('kaki_hoardings');
      const testDoc = { test: 'connection', timestamp: new Date() };
      await db.collection('test').insertOne(testDoc);
      const found = await db.collection('test').findOne({ test: 'connection' });
      console.log('✅ Database operations successful:', found);
      await db.collection('test').deleteMany({});
      
      await client4.close();
    } catch (error4) {
      console.error('❌ Comprehensive connection failed:', error4.message);
      console.error('Full error:', error4);
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
};

testMongoConnection();
