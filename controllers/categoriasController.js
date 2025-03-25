const { getConnection, sql } = require('../db'); // Asegúrate de que 'db' es el archivo que gestiona la conexión con la base de datos.

exports.getCategorias = async (req, res) => {
    try {
        const pool = await getConnection();

        // Consultamos todas las categorías en la base de datos
        const result = await pool.request().query('SELECT * FROM categoria');

        // Si no hay categorías, respondemos con un error
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'No se encontraron categorías' });
        }

        // Enviamos la lista de categorías al frontend
        res.status(200).json({ categories: result.recordset });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: error.message });
    }
};
