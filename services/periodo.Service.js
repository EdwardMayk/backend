import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../sequelize/sequelize.js';

class PeriodoService {
    constructor() {
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
    }

    async crearPeriodo(periodo, descripcion, activo, uuidUsuario) {
        try {
            // Buscar el usuario por su uuid
            const usuario = await this.Usuario.findOne({ where: { uuid_usuario: uuidUsuario } });

            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }

            const nuevoPeriodo = await this.Periodo.create({
                uuid_periodo: uuidv4(),
                periodo,
                descripcion,
                activo,
                id_usuario: usuario.id_usuario,  // Usamos el id del usuario encontrado
            });
            return nuevoPeriodo;
        } catch (error) {
            console.error('Error al crear periodo:', error);
            throw error;
        }
    }

    async obtenerTodosLosPeriodos(uuidUsuario) {
        try {
            // Buscar el usuario por su uuid
            const usuario = await this.Usuario.findOne({ where: { uuid_usuario: uuidUsuario } });

            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }

            const periodos = await this.Periodo.findAll({ where: { id_usuario: usuario.id_usuario } });
            return periodos;
        } catch (error) {
            console.error('Error al obtener periodos:', error);
            throw error;
        }
    }
    async obtenerPeriodoPorUUID(uuidPeriodo) {
        try {
            const periodo = await this.Periodo.findOne({ where: { uuid_periodo: uuidPeriodo } });
            return periodo;
        } catch (error) {
            console.error('Error al obtener periodo por UUID:', error);
            throw error;
        }
    }

    async actualizarPeriodo(uuidPeriodo, periodo, descripcion, activo) {
        try {
            const [numFilasActualizadas, periodosActualizados] = await this.Periodo.update(
                { periodo, descripcion, activo },
                { where: { uuid_periodo: uuidPeriodo }, returning: true }
            );
            return numFilasActualizadas > 0 ? periodosActualizados[0] : null;
        } catch (error) {
            console.error('Error al actualizar periodo:', error);
            throw error;
        }
    }

    async eliminarPeriodo(uuidPeriodo) {
        try {
            const numFilasEliminadas = await this.Periodo.destroy({ where: { uuid_periodo: uuidPeriodo } });
            return numFilasEliminadas > 0;
        } catch (error) {
            console.error('Error al eliminar periodo:', error);
            throw error;
        }
    }
}

export default PeriodoService;
