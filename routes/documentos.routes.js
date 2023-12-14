import express from 'express';
import DocumentoService from '../services/documentos.service.js';
import multer from 'multer';
import path from 'path';

import { URL } from 'url';

const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;

const router = express.Router();
const documentoService = new DocumentoService();


const upload = multer({ storage: storage });
// Ruta para crear un nuevo documento
router.post('/', upload.single('archivoDocumento'), async (req, res) => {
    try {
        const { numeroDocumento, numeroFolio, personaDirigido, ubicacion, descripcion, publico, activo, perdido, uuidUsuario, uuidArchivador } = req.body;

        // Obtener datos del usuario y archivador
        const usuario = await documentoService.Usuario.findOne({ where: { uuid_usuario: uuidUsuario } });
        const archivador = await documentoService.Archivador.findOne({ where: { uuid_archivador: uuidArchivador } });

        if (!usuario || !archivador) {
            throw new Error('Usuario o archivador no encontrado');
        }

        // Crear nuevo documento en la base de datos
        const nuevoDocumento = await documentoService.crearDocumento({
            numeroDocumento,
            numeroFolio,
            personaDirigido,
            ubicacion,
            descripcion,
            publico,
            activo,
            perdido,
            uuidUsuario,
            uuidArchivador,
        });

        res.status(201).json(nuevoDocumento);
    } catch (error) {
        console.error('Error al crear documento:', error);
        res.status(500).json({ error: 'Error al crear el documento' });
    }
});


// Ruta para obtener todos los documentos
router.get('/:uuidUsuario/:uuidArchivador', async (req, res) => {

    const { uuidUsuario, uuidArchivador } = req.params;

    try {
        const documentos = await documentoService.obtenerTodosLosDocumentos(uuidUsuario, uuidArchivador);
        res.json({ success: true, documentos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta para obtener un documento por su UUID
router.get('/:uuidDocumento', async (req, res) => {
    const { uuidDocumento } = req.params;
    try {
        const documento = await documentoService.obtenerDocumentoPorUUID(uuidDocumento);
        if (documento) {
            res.json(documento);
        } else {
            res.status(404).json({ error: 'Documento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener documento por UUID', message: error.message });
    }
});

// Ruta para actualizar un documento por su UUID
router.put('/:uuidDocumento', async (req, res) => {
    const { uuidDocumento } = req.params;
    const {
        numeroDocumento,
        numeroFolio,
        personaDirigido,
        ubicacion,
        descripcion,
        publico,
        activo,
        perdido,
        fechaCreacion,
    } = req.body;

    try {
        const documentoActualizado = await documentoService.actualizarDocumento(
            uuidDocumento,
            numeroDocumento,
            numeroFolio,
            personaDirigido,
            ubicacion,
            descripcion,
            publico,
            activo,
            perdido,
            fechaCreacion
        );

        if (documentoActualizado) {
            res.json(documentoActualizado);
        } else {
            res.status(404).json({ error: 'Documento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar documento', message: error.message });
    }
});

// Ruta para eliminar un documento por su UUID
router.delete('/:uuidDocumento', async (req, res) => {
    const { uuidDocumento } = req.params;
    try {
        const eliminado = await documentoService.eliminarDocumento(uuidDocumento);
        if (eliminado) {
            res.json({ mensaje: 'Documento eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Documento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar documento', message: error.message });
    }
});

export default router;
