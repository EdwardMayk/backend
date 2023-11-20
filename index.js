import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './src/routes.js';
import { pool } from './src/database/database.js';

const app = express();
const port = 3000;

// Configuración de CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de las rutas
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
