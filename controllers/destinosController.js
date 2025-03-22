const { getConnection, sql } = require('../db');

// Obtener todos los destinos
exports.getAllDestinos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM destinos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear nuevo destino
exports.createDestino = async (req, res) => {
    const { name, image, description, rating, price, duration, location, category } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('image', sql.VarChar, image)
            .input('description', sql.VarChar, description)
            .input('rating', sql.Decimal(2, 1), rating)
            .input('price', sql.Decimal(10, 2), price)
            .input('duration', sql.Int, duration)
            .input('location', sql.VarChar, location)
            .input('category', sql.VarChar, category)
            .query(`
                INSERT INTO destinos (name, image, description, rating, price, duration, location, category)
                VALUES (@name, @image, @description, @rating, @price, @duration, @location, @category)
            `);

        res.status(201).json({ message: 'Destino agregado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchDestinoByName = async (req, res) => {
    const { name } = req.query;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('name', sql.VarChar, `%${name}%`)
            .query(`
                SELECT * FROM destinos
                WHERE name LIKE @name
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
