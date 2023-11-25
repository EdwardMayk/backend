import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../sequelize/sequelize.js';
import multer from 'multer';
import path from 'path';
import { URL } from 'url';

const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;
// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../files'); // Ajusta la ruta según tu estructura de carpetas
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

class DocumentoService {
    constructor() {
        this.Documento = sequelize.define('Documento', {
            id_documento: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid_documento: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            archivo_documento: {
                type: DataTypes.BLOB('long'),  // Especifica un tamaño 'long'
                allowNull: false,
            },
            numero_documento: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            numero_folio: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            persona_dirigido: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            ubicacion: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            publico: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            activo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            perdido: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            fecha_creacion: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            id_usuario_creador: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            id_archivador: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        });

        this.Usuario = sequelize.define('usuario', {
            id_usuario: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid_usuario: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            nombre: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            apellido: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            dni: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            telefono: {
                type: DataTypes.STRING(15),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            usuario: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            contraseña: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            activo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            rol: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
        }, {
            tableName: 'usuario',
        });

        this.Archivador = sequelize.define('archivadores', {
            id_archivador: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid_archivador: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            nombre_archivador: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            codigo: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            estante: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            modulo: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            publico: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            id_area: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        });

    }

    async crearDocumento(req, res) {
        try {
            const { numeroDocumento, numeroFolio, personaDirigido, ubicacion, descripcion, publico, activo, perdido, uuidUsuario, uuidArchivador } = req.body;

            // Obtener datos del usuario y archivador
            const usuario = await this.Usuario.findOne({ where: { uuid_usuario: uuidUsuario } });
            const archivador = await this.Archivador.findOne({ where: { uuid_archivador: uuidArchivador } });

            if (!usuario || !archivador) {
                throw new Error('Usuario o archivador no encontrado');
            }

            // Utilizar multer para manejar la carga de archivos
            upload.single('archivoDocumento')(req, res, async (err) => {
                if (err) {
                    throw new Error('Error al subir el archivo');
                }

                // Guardar la ruta del archivo en la base de datos
                const nuevoDocumento = await this.Documento.create({
                    uuid_documento: uuidv4(),
                    archivo_documento: req.file.path, // Utilizar la ruta proporcionada por multer
                    numero_documento: numeroDocumento,
                    numero_folio: numeroFolio,
                    persona_dirigido: personaDirigido,
                    ubicacion,
                    descripcion,
                    publico,
                    activo,
                    perdido,
                    fecha_creacion: new Date(),
                    id_usuario_creador: usuario.id_usuario,
                    id_archivador: archivador.id_archivador,
                });

                return nuevoDocumento;
            });
        } catch (error) {
            console.error('Error al crear documento:', error);
            throw error;
        }
    }

    async obtenerTodosLosDocumentos(uuidUsuario, uuidArchivador) {
        try {
            const usuario = await this.Usuario.findOne({ where: { uuid_usuario: uuidUsuario } });

            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }

            const archivador = await this.Archivador.findOne({ where: { uuid_archivador: uuidArchivador } });

            if (!archivador) {
                throw new Error('Archivador no encontrado');
            }

            const documentos = await this.Documento.findAll({ where: { id_usuario_creador: usuario.id_usuario, id_archivador: archivador.id_archivador } });
            return documentos;
        } catch (error) {
            console.error('Error al obtener documentos:', error);
            throw error;
        }
    }

    async obtenerDocumentoPorUUID(uuidDocumento) {
        try {
            const documento = await this.Documento.findOne({ where: { uuid_documento: uuidDocumento } });
            return documento;
        } catch (error) {
            console.error('Error al obtener documento por UUID:', error);
            throw error;
        }
    }

    async actualizarDocumento(uuidDocumento, numeroDocumento, numeroFolio, personaDirigido, ubicacion, descripcion, publico, activo, perdido, fechaCreacion) {
        try {
            const [numFilasActualizadas, documentosActualizados] = await this.Documento.update(
                { numero_documento, numero_folio, persona_dirigido, ubicacion, descripcion, publico, activo, perdido, fecha_creacion: fechaCreacion },
                { where: { uuid_documento: uuidDocumento }, returning: true }
            );
            return numFilasActualizadas > 0 ? documentosActualizados[0] : null;
        } catch (error) {
            console.error('Error al actualizar documento:', error);
            throw error;
        }
    }

    async eliminarDocumento(uuidDocumento) {
        try {
            const numFilasEliminadas = await this.Documento.destroy({ where: { uuid_documento: uuidDocumento } });
            return numFilasEliminadas > 0;
        } catch (error) {
            console.error('Error al eliminar documento:', error);
            throw error;
        }
    }
}

export default DocumentoService;
