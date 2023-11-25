import express from 'express';
import AreaService from '../services/areas.service.js';

const router = express.Router();
const areaService = new AreaService();

// Ruta para crear un nuevo área
router.post('/', async (req, res) => {
    const { nombreArea, descripcion, publico, uuidPeriodo } = req.body;
    try {
        const nuevaArea = await areaService.crearArea(nombreArea, descripcion, publico, uuidPeriodo);
        res.status(201).json(nuevaArea);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear área', message: error.message });
    }
});

// Ruta para obtener todas las áreas
router.get('/:uuidPeriodo', async (req, res) => {
    const { uuidPeriodo } = req.params;

    try {
        const areas = await areaService.obtenerTodasLasAreas(uuidPeriodo);
        if (areas) {
            res.json(areas);
        } else {
            res.status(404).json({ error: 'Áreas no encontradas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener áreas', message: error.message });
    }
});

// Ruta para obtener un área por su UUID
router.get('/:uuidArea', async (req, res) => {
    const { uuidArea } = req.params;
    try {
        const area = await areaService.obtenerAreaPorUUID(uuidArea);
        if (area) {
            res.json(area);
        } else {
            res.status(404).json({ error: 'Área no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener área por UUID', message: error.message });
    }
});

// Ruta para actualizar un área por su UUID
router.put('/:uuidArea', async (req, res) => {
    const { uuidArea } = req.params;
    const { nombreArea, descripcion, publico } = req.body;
    try {
        const areaActualizada = await areaService.actualizarArea(uuidArea, nombreArea, descripcion, publico);
        if (areaActualizada) {
            res.json(areaActualizada);
        } else {
            res.status(404).json({ error: 'Área no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar área', message: error.message });
    }
});

// Ruta para eliminar un área por su UUID
router.delete('/:uuidArea', async (req, res) => {
    const { uuidArea } = req.params;
    try {
        const eliminada = await areaService.eliminarArea(uuidArea);
        if (eliminada) {
            res.json({ mensaje: 'Área eliminada exitosamente' });
        } else {
            res.status(404).json({ error: 'Área no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar área', message: error.message });
    }
});

export default router;
