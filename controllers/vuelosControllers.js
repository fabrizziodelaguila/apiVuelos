const { getConnection, sql } = require('../db');

// Obtener todos los vuelos con información de los destinos de origen y destino
exports.getAllVuelos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT v.id, v.codigoVuelo, d1.name AS origen, d2.name AS destino, 
                   v.fechaSalida, v.fechaLlegada, v.estado, v.aerolinea, v.precio
            FROM vuelos v
            LEFT JOIN destinos d1 ON v.origen = d1.id
            LEFT JOIN destinos d2 ON v.destino = d2.id
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Agregar nuevo vuelo
exports.createVuelo = async (req, res) => {
    const { codigoVuelo, origen, destino, fechaSalida, fechaLlegada, estado, aerolinea, precio } = req.body;

    try {
        const pool = await getConnection();

        // Verificar si los destinos de origen y destino existen en la base de datos
        const origenResult = await pool.request()
            .input('origen', sql.Int, origen)
            .query('SELECT id FROM destinos WHERE id = @origen');
        
        const destinoResult = await pool.request()
            .input('destino', sql.Int, destino)
            .query('SELECT id FROM destinos WHERE id = @destino');

        if (origenResult.recordset.length === 0 || destinoResult.recordset.length === 0) {
            return res.status(400).json({ error: 'Origen o destino no encontrados' });
        }

        await pool.request()
            .input('codigoVuelo', sql.VarChar, codigoVuelo)
            .input('origen', sql.Int, origen)
            .input('destino', sql.Int, destino)
            .input('fechaSalida', sql.DateTime, fechaSalida)
            .input('fechaLlegada', sql.DateTime, fechaLlegada)
            .input('estado', sql.VarChar, estado)
            .input('aerolinea', sql.VarChar, aerolinea)
            .input('precio', sql.Decimal(10, 2), precio)
            .query(`
                INSERT INTO vuelos (codigoVuelo, origen, destino, fechaSalida, fechaLlegada, estado, aerolinea, precio)
                VALUES (@codigoVuelo, @origen, @destino, @fechaSalida, @fechaLlegada, @estado, @aerolinea, @precio)
            `);

        res.status(201).json({ message: 'Vuelo agregado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getVuelosByEstado = async (req, res) => {
    try {
        const pool = await getConnection();

        // Consulta para obtener el total de vuelos por estado
        const result = await pool.request().query(`
            SELECT v.estado, COUNT(*) AS total_vuelos
            FROM vuelos v
            GROUP BY v.estado
        `);

        // Procesamos los datos para el gráfico de barras
        const estadosData = result.recordset.map(item => ({
            estado: item.estado,
            total_vuelos: item.total_vuelos
        }));

        // Enviar los datos procesados para el gráfico
        res.json(estadosData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener el precio promedio de los vuelos por destino
exports.getPrecioPromedioPorDestino = async (req, res) => {
    try {
        const pool = await getConnection();

        // Consulta para obtener el precio promedio por destino
        const result = await pool.request().query(`
            SELECT d1.name AS destino, AVG(v.precio) AS precio_promedio
            FROM vuelos v
            LEFT JOIN destinos d1 ON v.destino = d1.id
            GROUP BY d1.name
        `);

        // Procesamos los datos para el gráfico
        const preciosPorDestino = result.recordset.map(item => ({
            destino: item.destino,
            precio_promedio: item.precio_promedio
        }));

        // Enviar los datos procesados para el gráfico
        res.json(preciosPorDestino);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener el total de vuelos por fecha de salida para un gráfico de líneas o barras
exports.getVuelosPorFecha = async (req, res) => {
    try {
        const pool = await getConnection();

        // Consulta para obtener el total de vuelos por fecha de salida
        const result = await pool.request().query(`
            SELECT CAST(v.fechaSalida AS DATE) AS fecha, COUNT(*) AS total_vuelos
            FROM vuelos v
            GROUP BY CAST(v.fechaSalida AS DATE)
            ORDER BY fecha
        `);

        // Procesamos los datos para el gráfico
        const vuelosPorFecha = result.recordset.map(item => ({
            fecha: item.fecha,
            total_vuelos: item.total_vuelos
        }));

        // Enviar los datos procesados para el gráfico
        res.json(vuelosPorFecha);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
