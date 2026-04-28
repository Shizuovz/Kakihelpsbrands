import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://shizuovz:Mv8fB2z40hVofAEv@kaki.iomnd.mongodb.net/kaki_hoardings?retryWrites=true&w=majority";

async function checkData() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db('kaki_hoardings');
        
        console.log('--- HOARDINGS ---');
        const hoardings = await db.collection('hoardings').find({ status: 'Booked' }).toArray();
        hoardings.forEach(h => {
            console.log(`ID: ${h._id}, Title: ${h.title}, Status: ${h.status}`);
        });

        console.log('\n--- ALL INQUIRIES for these hoardings ---');
        const hoardingIds = hoardings.map(h => h._id.toString());
        const inquiries = await db.collection('inquiries').find({ hoardingId: { $in: hoardingIds } }).toArray();
        inquiries.forEach(i => {
            console.log(`ID: ${i._id}, HoardingId: ${i.hoardingId}, Name: ${i.name}, Status: ${i.status}, Dates: ${JSON.stringify(i.selectedDates)}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

checkData();
