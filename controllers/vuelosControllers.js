const { getConnection, sql } = require('../db');

// Obtener todos los vuelos
exports.getAllVuelos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM vuelos');
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
        await pool.request()
            .input('codigoVuelo', sql.VarChar, codigoVuelo)
            .input('origen', sql.VarChar, origen)
            .input('destino', sql.VarChar, destino)
            .input('fechaSalida', sql.DateTime, fechaSalida)
            .input('fechaLlegada', sql.DateTime, fechaLlegada)
            .input('estado', sql.VarChar, estado)
            .input('aerolinea', sql.VarChar, aerolinea)
            .input('precio', sql.Decimal(10, 2), precio)
            .query('INSERT INTO vuelos (codigoVuelo, origen, destino, fechaSalida, fechaLlegada, estado, aerolinea, precio) VALUES (@codigoVuelo, @origen, @destino, @fechaSalida, @fechaLlegada, @estado, @aerolinea, @precio)');
        res.status(201).json({ message: 'Vuelo agregado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
