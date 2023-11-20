import { pool } from '../src/database/database.js';
import bcrypt from 'bcrypt';

const authServices = {
    login: async (username, password) => {
        try {
            // Buscar el usuario por nombre de usuario
            const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

            if (user.length === 0) {
                return { success: false, message: 'Invalid username or password' };
            }

            // Comparar la contraseña proporcionada con la contraseña almacenada cifrada
            const passwordMatch = await bcrypt.compare(password, user[0].password);

            if (passwordMatch) {
                return { success: true, message: 'Login successful' };
            } else {
                return { success: false, message: 'Invalid username or password' };
            }
        } catch (error) {
            console.error('Error during login:', error);
            return { success: false, message: 'Internal Server Error' };
        }
    },
    register: async (username, password) => {
        try {
            // Check if the username already exists
            const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

            if (existingUser.length > 0) {
                return { success: false, message: 'Username already exists' };
            }

            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert the new user with the hashed password
            await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

            return { success: true, message: 'Registration successful' };
        } catch (error) {
            console.error('Error during registration:', error);
            return { success: false, message: 'Internal Server Error' };
        }
    }
};

export default authServices;