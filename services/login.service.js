import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';
import { v4 as uuidv4 } from 'uuid';

class AuthService {
    constructor() {
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

    async registrarUsuario(nombre, apellido, dni, telefono, email, usuario, contraseña, rol) {
        try {
            const nuevoUsuario = await this.Usuario.create({
                uuid_usuario: uuidv4(),
                nombre,
                apellido,
                dni,
                telefono,
                email,
                usuario,
                contraseña,
                activo: true,  // Nuevo usuario activo por defecto
                rol,
            });
            return nuevoUsuario;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    }

    async autenticarUsuario(usuario, contraseña) {
        try {
            const usuarioAutenticado = await this.Usuario.findOne({
                where: { usuario, contraseña, activo: true },
            });
            return usuarioAutenticado;
        } catch (error) {
            console.error('Error al autenticar usuario:', error);
            throw error;
        }
    }
}

export default AuthService;
