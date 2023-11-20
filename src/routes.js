import express from 'express';
import { pool } from './database/database.js';
import bcrypt from 'bcrypt';
import authServices from '../routes/login.service.js';
import periodService from '../routes/periodo.Service.js';  // Asegúrate de proporcionar la ruta correcta al servicio de periodos



const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const result = await authServices.login(username, password);

    if (result.success) {
        res.json(result);
    } else {
        res.status(401).json(result);
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const result = await authServices.register(username, password);

    if (result.success) {
        res.json(result);
    } else {
        res.status(401).json(result);
    }
});

router.get('/periods', async (req, res) => {
    const result = await periodService.getAllPeriods();

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});

router.post('/periods', async (req, res) => {
    const { periodo, descripcion, activo } = req.body;

    // Validar que 'periodo' sea un rango de años en el formato correcto
    const yearRangeRegex = /^\d{4}-\d{4}$/;
    if (!yearRangeRegex.test(periodo)) {
        return res.status(400).json({ success: false, message: 'Invalid year range format' });
    }

    const result = await periodService.createPeriod(periodo, descripcion, activo);

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});

router.put('/periods/:id', async (req, res) => {
    const { periodo, descripcion, activo } = req.body;
    const periodId = req.params.id;

    const result = await periodService.updatePeriod(periodo, descripcion, activo, periodId);

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});

router.delete('/periods/:id', async (req, res) => {
    const periodId = req.params.id;

    const result = await periodService.deletePeriod(periodId);

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});


export default router;
