import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and Password are required' })
        }

        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        )

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' })
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' })
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                id: user.id,
                username: user.username
            }
        })

    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ message: 'Server error login' })
    }
}