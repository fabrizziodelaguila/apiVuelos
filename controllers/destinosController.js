const { getConnection, sql } = require('../db');

// Obtener todos los destinos con su categoría
exports.getAllDestinos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT d.*, c.name AS category_name
            FROM destinos d
            LEFT JOIN categoria c ON d.categoria_id = c.id
        `);
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

        // Primero, obtener el id de la categoría basado en el nombre
        const categoryResult = await pool.request()
            .input('category', sql.VarChar, category)
            .query('SELECT id FROM categoria WHERE name = @category');
        
        if (categoryResult.recordset.length === 0) {
            return res.status(400).json({ error: 'Categoría no encontrada' });
        }

        const categoryId = categoryResult.recordset[0].id;

        // Inserta el nuevo destino en la base de datos
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('image', sql.VarChar, image)
            .input('description', sql.VarChar, description)
            .input('rating', sql.Decimal(2, 1), rating)
            .input('price', sql.Decimal(10, 2), price)
            .input('duration', sql.Int, duration)
            .input('location', sql.VarChar, location)
            .input('categoryId', sql.Int, categoryId)
            .query(`
                INSERT INTO destinos (name, image, description, rating, price, duration, location, categoria_id)
                VALUES (@name, @image, @description, @rating, @price, @duration, @location, @categoryId)
            `);

        res.status(201).json({ message: 'Destino agregado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Buscar destinos por nombre
exports.searchDestinoByName = async (req, res) => {
    const { name } = req.query;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('name', sql.VarChar, `%${name}%`)
            .query(`
                SELECT d.*, c.name AS category_name
                FROM destinos d
                LEFT JOIN categoria c ON d.categoria_id = c.id
                WHERE d.name LIKE @name
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener destino por ID con su categoría
exports.getDestinoById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT d.*, c.name AS category_name
                FROM destinos d
                LEFT JOIN categoria c ON d.categoria_id = c.id
                WHERE d.id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Destino no encontrado' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
