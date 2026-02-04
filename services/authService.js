import db from '../config/db.js';
import bcrypt from 'bcrypt';


export const findUserByUsername = async (username) => {
    const [users] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
    )

    return users.length > 0 ? users[0] : null;
}


export const verifyUserCredentials = async (username, password) => {
    const user = await findUserByUsername(username);

    if (!user) {
        return {
            success: false,
            message: 'Invalid username or password'
        };
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return {
            success: false,
            message: 'Invalid username or password'
        };
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
        success: true,
        user: userWithoutPassword
    };
};


export const createUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
    );

    const [newUser] = await db.query(
        'SELECT id, username, created_at FROM users WHERE id = ?',
        [result.insertId]
    );

    return newUser[0];
};