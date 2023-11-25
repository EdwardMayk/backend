import express from 'express';
import AuthService from '../services/login.service.js';

const router = express.Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
    const { nombre, apellido, dni, telefono, email, usuario, contraseña, rol } = req.body;
    try {
        const nuevoUsuario = await authService.registrarUsuario(
            nombre,
            apellido,
            dni,
            telefono,
            email,
            usuario,
            contraseña,
            rol
        );
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario', message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { usuario, contraseña } = req.body;
    try {
        const usuarioAutenticado = await authService.autenticarUsuario(usuario, contraseña);
        if (usuarioAutenticado) {
            res.json({ mensaje: 'Autenticación exitosa', usuario: usuarioAutenticado });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al autenticar usuario', message: error.message });
    }
});

export default router;
