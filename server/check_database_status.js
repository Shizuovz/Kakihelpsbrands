// Check if data is actually being stored in MongoDB
const checkDatabaseStatus = async () => {
  try {
    console.log('🔍 CHECKING DATABASE STATUS\n');
    
    // Test 1: Check MongoDB connection
    console.log('1️⃣ Testing MongoDB connection...');
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaki_hoardings');
    
    try {
      await client.connect();
      console.log('✅ MongoDB connection successful');
      
      const db = client.db('kaki_hoardings');
      
      // Test 2: Check if collections exist
      console.log('\n2️⃣ Checking collections...');
      const collections = await db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
      
      // Test 3: Check hoardings collection
      console.log('\n3️⃣ Checking hoardings collection...');
      const hoardingsCollection = db.collection('hoardings');
      const hoardingsCount = await hoardingsCollection.countDocuments();
      console.log('Hoardings count:', hoardingsCount);
      
      if (hoardingsCount > 0) {
        const sampleHoarding = await hoardingsCollection.findOne();
        console.log('Sample hoarding:', sampleHoarding);
      }
      
      // Test 4: Check users collection
      console.log('\n4️⃣ Checking users collection...');
      const usersCollection = db.collection('users');
      const usersCount = await usersCollection.countDocuments();
      console.log('Users count:', usersCount);
      
      if (usersCount > 0) {
        const sampleUser = await usersCollection.findOne();
        console.log('Sample user:', sampleUser);
      }
      
      await client.close();
      
      console.log('\n🎯 DATABASE STATUS SUMMARY:');
      console.log('✅ MongoDB: Connected');
      console.log('✅ Collections:', collections.length);
      console.log('✅ Hoardings:', hoardingsCount);
      console.log('✅ Users:', usersCount);
      
      if (hoardingsCount > 0 || usersCount > 0) {
        console.log('🎉 DATA IS PERSISTING IN MONGODB!');
      } else {
        console.log('⚠️  NO DATA FOUND IN MONGODB - using in-memory fallback');
      }
      
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      console.log('📝 System is using IN-MEMORY FALLBACK MODE');
      console.log('⚠️  DATA IS NOT PERSISTING - will be lost on restart');
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
};

checkDatabaseStatus();
