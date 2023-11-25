import express from 'express';
import PeriodoService from '../services/periodo.Service.js';

const router = express.Router();
const periodoService = new PeriodoService();

// Obtener todos los periodos
router.get('/periodos/:uuidUsuario', async (req, res) => {
    try {
        const { uuidUsuario } = req.params;
        const periodos = await periodoService.obtenerTodosLosPeriodos(uuidUsuario);
        res.json(periodos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener periodos', message: error.message });
    }
});

// Obtener un periodo por su UUID
router.get('/periodos/:uuidPeriodo', async (req, res) => {
    const { uuidPeriodo } = req.params;
    try {
        const periodo = await periodoService.obtenerPeriodoPorUUID(uuidPeriodo);
        if (periodo) {
            res.json(periodo);
        } else {
            res.status(404).json({ error: 'Periodo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener periodo por UUID', message: error.message });
    }
});

// Crear un nuevo periodo
router.post('/periodos', async (req, res) => {
    const { periodo, descripcion, activo, uuidUsuario } = req.body;
    try {
        const nuevoPeriodo = await periodoService.crearPeriodo(periodo, descripcion, activo, uuidUsuario);
        res.status(201).json(nuevoPeriodo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear periodo', message: error.message });
    }
});

// Actualizar un periodo por su UUID
router.put('/periodos/:uuidPeriodo', async (req, res) => {
    const { uuidPeriodo } = req.params;
    const { periodo, descripcion, activo } = req.body;
    try {
        const periodoActualizado = await periodoService.actualizarPeriodo(uuidPeriodo, periodo, descripcion, activo);
        if (periodoActualizado) {
            res.json(periodoActualizado);
        } else {
            res.status(404).json({ error: 'Periodo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar periodo', message: error.message });
    }
});

// Eliminar un periodo por su UUID
router.delete('/periodos/:uuidPeriodo', async (req, res) => {
    const { uuidPeriodo } = req.params;
    try {
        const eliminado = await periodoService.eliminarPeriodo(uuidPeriodo);
        if (eliminado) {
            res.json({ mensaje: 'Periodo eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Periodo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar periodo', message: error.message });
    }
});

export default router;
