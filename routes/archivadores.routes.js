import express from 'express';
import ArchivadorService from '../services/archivadores.service.js';

const router = express.Router();
const archivadorService = new ArchivadorService();

// Ruta para crear un nuevo archivador
router.post('/', async (req, res) => {
    const { nombreArchivador, codigo, estante, modulo, descripcion, publico, uuidArea } = req.body;
    try {
        const nuevoArchivador = await archivadorService.crearArchivador(nombreArchivador, codigo, estante, modulo, descripcion, publico, uuidArea);
        res.status(201).json(nuevoArchivador);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear archivador', message: error.message });
    }
});

// Ruta para obtener todos los archivadores
router.get('/:uuidArea', async (req, res) => {

    const { uuidArea } = req.params;

    try {
        const archivadores = await archivadorService.obtenerTodosLosArchivadores(uuidArea);
        res.json(archivadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener archivadores', message: error.message });
    }
});

// Ruta para obtener un archivador por su UUID
router.get('/:uuidArchivador', async (req, res) => {
    const { uuidArchivador } = req.params;
    try {
        const archivador = await archivadorService.obtenerArchivadorPorUUID(uuidArchivador);
        if (archivador) {
            res.json(archivador);
        } else {
            res.status(404).json({ error: 'Archivador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener archivador por UUID', message: error.message });
    }
});

// Ruta para actualizar un archivador por su UUID
router.put('/:uuidArchivador', async (req, res) => {
    const { uuidArchivador } = req.params;
    const { nombreArchivador, codigo, estante, modulo, descripcion, publico } = req.body;
    try {
        const archivadorActualizado = await archivadorService.actualizarArchivador(uuidArchivador, nombreArchivador, codigo, estante, modulo, descripcion, publico);
        if (archivadorActualizado) {
            res.json(archivadorActualizado);
        } else {
            res.status(404).json({ error: 'Archivador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar archivador', message: error.message });
    }
});

// Ruta para eliminar un archivador por su UUID
router.delete('/:uuidArchivador', async (req, res) => {
    const { uuidArchivador } = req.params;
    try {
        const eliminado = await archivadorService.eliminarArchivador(uuidArchivador);
        if (eliminado) {
            res.json({ mensaje: 'Archivador eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Archivador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar archivador', message: error.message });
    }
});

export default router;
