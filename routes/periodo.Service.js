import { pool } from '../src/database/database.js';

const periodService = {
    getAllPeriods: async () => {
        try {
            const periods = await pool.query('SELECT * FROM periods');
            return { success: true, periods };
        } catch (error) {
            console.error('Error fetching periods:', error);
            return { success: false, message: 'Internal Server Error' };
        }
    },

    createPeriod: async (period, description, isActive) => {
        try {
            // Validar que 'period' sea un rango de años en el formato correcto
            const yearRangeRegex = /^\d{4}-\d{4}$/;
            if (!yearRangeRegex.test(period)) {
                return { success: false, message: 'Invalid year range format' };
            }

            await pool.query('INSERT INTO periods (periodo, descripcion, activo) VALUES (?, ?, ?)', [period, description, isActive]);
            return { success: true, message: 'Period created successfully' };
        } catch (error) {
            console.error('Error creating period:', error);
            return { success: false, message: 'Internal Server Error' };
        }
    },


    updatePeriod: async (period, description, isActive, periodId) => {
        try {
            await pool.query('UPDATE periods SET periodo = ?, descripcion = ?, activo = ? WHERE id = ?', [period, description, isActive, periodId]);
            return { success: true, message: 'Period updated successfully' };
        } catch (error) {
            console.error('Error updating period:', error);
            return { success: false, message: 'Internal Server Error' };
        }
    },

    deletePeriod: async (periodId) => {
        try {
            await pool.query('DELETE FROM periods WHERE id = ?', [periodId]);
            return { success: true, message: 'Period deleted successfully' };
        } catch (error) {
            console.error('Error deleting period:', error);
            return { success: false, message: 'Internal Server Error' };
        }
    }
};

export default periodService;
