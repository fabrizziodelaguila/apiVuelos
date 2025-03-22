const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta raíz que muestra botón
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>API Destinos</title>
            </head>
            <body style="font-family: Arial; text-align: center; margin-top: 50px;">
                <h1>Bienvenido a la API de Destinos ✈️</h1>
                <p>Haz clic para ver los destinos disponibles:</p>
                <a href="/api/destinos">
                    <button style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Ver Destinos</button>
                </a>
            </body>
        </html>
    `);
});

// Rutas API
const vuelosRoutes = require('./routes/vuelosRoutes');
app.use('/api/vuelos', vuelosRoutes);

const destinosRoutes = require('./routes/destinosRoutes');
app.use('/api/destinos', destinosRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
