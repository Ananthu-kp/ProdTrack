import * as authService from '../services/authService.js';


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const result = await authService.verifyUserCredentials(username, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                id: result.user.id,
                username: result.user.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};