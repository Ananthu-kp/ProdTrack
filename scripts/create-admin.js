import bcrypt from 'bcrypt';
import db from '../config/db.js';


const createAdmin = async () => {
    try {
        const username = 'admin';
        const password = 'admin123';

        console.log('Creating admin user...');

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        console.log('✅ Admin user created successfully!');
        console.log('================================');
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log(`User ID: ${result.insertId}`);
        console.log('================================');

        process.exit(0);

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('⚠️  Admin user already exists!');
        } else {
            console.error('❌ Error creating admin user:', error.message);
        }

        process.exit(1);
    }
};

createAdmin();