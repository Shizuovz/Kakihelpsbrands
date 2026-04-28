import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaki_hoardings');
try {
  await client.connect();
  const users = await client.db('kaki_hoardings').collection('users').find({}).toArray();
  console.log(JSON.stringify(users.map(u => ({ email: u.email, id: u.id, _id: u._id, passwordStart: u.password?.substring(0, 7) })), null, 2));
} catch (e) {
  console.error(e);
} finally {
  await client.close();
}
