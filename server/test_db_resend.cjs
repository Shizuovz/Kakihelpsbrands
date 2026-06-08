const { MongoClient } = require('mongodb');
const { Resend } = require('resend');

const uri = 'mongodb+srv://kakitech25_db_user:4VFbbdhtNCmvKLxp@kaki-hoardings.bktagno.mongodb.net/?appName=kaki-hoardings';
const resendApiKey = 're_3pwutMFR_LjD43jrRujtemB1NXNAZLJ16';

async function test() {
  // Test MongoDB
  try {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('kaki_hoardings');
    const users = await db.collection('users').find({}).toArray();
    console.log('Users in DB:');
    users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));
    await client.close();
  } catch (err) {
    console.error('MongoDB Error:', err);
  }

  // Test Resend API
  try {
    console.log('\nTesting Resend API...');
    const resend = new Resend(resendApiKey);
    const response = await resend.emails.send({
      from: 'Hoardings <noreply@kakihelpsbrands.com>',
      to: 'delivered@resend.dev', // safe test email
      subject: 'Test Email',
      html: '<p>Test</p>'
    });
    console.log('Resend response:', response);
  } catch (err) {
    console.error('Resend Error:', err);
  }
}

test();
