const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgres://postgres.qnbbjehbgadiroscfttj:Yashpatel%409510@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

async function runMigration() {
    const client = new Client({ connectionString });

    try {
        console.log('Connecting to Supabase...');
        await client.connect();

        console.log('Reading migration file...');
        const sqlPath = path.join(__dirname, 'supabase', 'migrations', '20260308000000_add_achievements_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL...');
        await client.query(sql);

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
