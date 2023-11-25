import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../sequelize/sequelize.js';

class AreaService {
    constructor() {
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
        this.Periodo = sequelize.define('periodo', {
            id_periodo: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid_periodo: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            periodo: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            activo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            id_usuario: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        });
    }

    async crearArea(nombreArea, descripcion, publico, uuidPeriodo) {
        try {
            // Buscar el periodo por su uuid
            const periodo = await this.Periodo.findOne({ where: { uuid_periodo: uuidPeriodo } });

            if (!periodo) {
                throw new Error('Periodo no encontrado');
            }

            const nuevaArea = await this.Area.create({
                uuid_area: uuidv4(),
                nombre_area: nombreArea,
                descripcion,
                publico,
                id_periodo: periodo.id_periodo,
            });
            return nuevaArea;
        } catch (error) {
            console.error('Error al crear área:', error);
            throw error;
        }
    }

    async obtenerTodasLasAreas(uuidPeriodo) {
        try {

            const periodo = await this.Periodo.findOne({ where: { uuid_periodo: uuidPeriodo } });

            if (!periodo) {
                throw new Error('Periodo no encontrado');
            }

            const areas = await this.Area.findAll({ where: { id_periodo: periodo.id_periodo } });
            return areas;
        } catch (error) {
            console.error('Error al obtener áreas:', error);
            throw error;
        }
    }

    async obtenerAreaPorUUID(uuidArea) {
        try {
            const area = await this.Area.findOne({ where: { uuid_area: uuidArea } });
            return area;
        } catch (error) {
            console.error('Error al obtener área por UUID:', error);
            throw error;
        }
    }

    async actualizarArea(uuidArea, nombreArea, descripcion, publico) {
        try {
            const [numFilasActualizadas, areasActualizadas] = await this.Area.update(
                { nombre_area: nombreArea, descripcion, publico },
                { where: { uuid_area: uuidArea }, returning: true }
            );
            return numFilasActualizadas > 0 ? areasActualizadas[0] : null;
        } catch (error) {
            console.error('Error al actualizar área:', error);
            throw error;
        }
    }

    async eliminarArea(uuidArea) {
        try {
            const numFilasEliminadas = await this.Area.destroy({ where: { uuid_area: uuidArea } });
            return numFilasEliminadas > 0;
        } catch (error) {
            console.error('Error al eliminar área:', error);
            throw error;
        }
    }
}

export default AreaService;
