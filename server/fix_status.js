import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://shizuovz:Mv8fB2z40hVofAEv@kaki.iomnd.mongodb.net/kaki_hoardings?retryWrites=true&w=majority";

async function fixStatus() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db('kaki_hoardings');
        
        // Change "TEST 1" status to "Limited" so it's not globally blocked
        const result = await db.collection('hoardings').updateOne(
            { title: /TEST 1/i },
            { $set: { status: 'Limited', updatedAt: new Date() } }
        );
        
        console.log(`Updated ${result.matchedCount} hoarding status to Limited`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

fixStatus();
