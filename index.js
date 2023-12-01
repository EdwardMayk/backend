import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './src/routes.js';
import { pool } from './src/database/database.js';
import { PORT } from './config.js';

const app = express();
const port = PORT;

// Configuración de CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de las rutas
app.use('/api', routes);
console.log('Routes configured');

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    //routes
    console.log('Press Ctrl+C to quit.');
});
