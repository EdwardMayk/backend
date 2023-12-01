import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import periodsRoutes from '../routes/period.routes.js';
import areasRoutes from '../routes/areas.routes.js';
import archivadoresRoutes from '../routes/archivadores.routes.js';
import documentosRoutes from '../routes/documentos.routes.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to my application.',
    });
}
);
router.use('/auth', authRoutes);
router.use('/periods', periodsRoutes);
router.use('/areas', areasRoutes)
router.use('/archivadores', archivadoresRoutes)
router.use('/documentos', documentosRoutes)


export default router;
