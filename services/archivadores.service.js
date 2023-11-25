import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../sequelize/sequelize.js';

class ArchivadorService {
    constructor() {
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
        this.Area = sequelize.define('Area', {
            id_area: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid_area: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            nombre_area: {
                type: DataTypes.STRING(255),
                allowNull: false,
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
            id_periodo: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        });
    }

    async crearArchivador(nombreArchivador, codigo, estante, modulo, descripcion, publico, uuidArea) {
        try {
            // Buscar el área por su uuid
            const area = await this.Area.findOne({ where: { uuid_area: uuidArea } });

            if (!area) {
                throw new Error('Área no encontrada');
            }

            const nuevoArchivador = await this.Archivador.create({
                uuid_archivador: uuidv4(),
                nombre_archivador: nombreArchivador,
                codigo,
                estante,
                modulo,
                descripcion,
                publico,
                id_area: area.id_area,
            });
            return nuevoArchivador;
        } catch (error) {
            console.error('Error al crear archivador:', error);
            throw error;
        }
    }

    async obtenerTodosLosArchivadores(uuidArea) {
        try {
            const area = await this.Area.findOne({ where: { uuid_area: uuidArea } });

            if (!area) {
                throw new Error('Área no encontrada');
            }

            const archivadores = await this.Archivador.findAll({ where: { id_area: area.id_area } });
            return archivadores;
        } catch (error) {
            console.error('Error al obtener archivadores:', error);
            throw error;
        }
    }

    async obtenerArchivadorPorUUID(uuidArchivador) {
        try {
            const archivador = await this.Archivador.findOne({ where: { uuid_archivador: uuidArchivador } });
            return archivador;
        } catch (error) {
            console.error('Error al obtener archivador por UUID:', error);
            throw error;
        }
    }

    async actualizarArchivador(uuidArchivador, nombreArchivador, codigo, estante, modulo, descripcion, publico) {
        try {
            const [numFilasActualizadas, archivadoresActualizados] = await this.Archivador.update(
                { nombre_archivador: nombreArchivador, codigo, estante, modulo, descripcion, publico },
                { where: { uuid_archivador: uuidArchivador }, returning: true }
            );
            return numFilasActualizadas > 0 ? archivadoresActualizados[0] : null;
        } catch (error) {
            console.error('Error al actualizar archivador:', error);
            throw error;
        }
    }

    async eliminarArchivador(uuidArchivador) {
        try {
            const numFilasEliminadas = await this.Archivador.destroy({ where: { uuid_archivador: uuidArchivador } });
            return numFilasEliminadas > 0;
        } catch (error) {
            console.error('Error al eliminar archivador:', error);
            throw error;
        }
    }
}

export default ArchivadorService;
