const express = require("express");
const cors = require("cors");
const { sql, config } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

//Manejo de todas las llamadas a la api

// consulta a tipos
app.get("/api/tipos", async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM tipos ORDER BY nombre");
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error interno" });
    }
});

// listar todos
app.get("/api/productos", async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT p.id, p.nombre, p.precio, p.tipos_id, t.nombre AS tipo_nombre
            FROM productos p
            INNER JOIN tipos t ON p.tipos_id = t.id
            ORDER BY p.id
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error interno" });
    }
});

// obtener producto por id (incluye infor de tipo)
app.get("/api/productos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT p.id, p.nombre, p.precio, p.tipos_id, t.nombre AS tipo_nombre
                FROM productos p
                INNER JOIN tipos t ON p.tipos_id = t.id
                WHERE p.id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error interno" });
    }
});

// insertar producto
app.post("/api/productos", async (req, res) => {
    try {
        const { nombre, precio, tipos_id } = req.body;

        if (!nombre || precio <= 0 || !tipos_id) {
            return res.status(422).json({ mensaje: "Datos inválidos" });
        }

        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("nombre", sql.VarChar(150), nombre)
            .input("precio", sql.Decimal(10, 2), precio)
            .input("tipos_id", sql.Int, tipos_id)
            .query(`
                INSERT INTO productos (nombre, precio, tipos_id)
                VALUES (@nombre, @precio, @tipos_id);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        res.status(201).json({ id: result.recordset[0].id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error interno" });
    }
});

// update producto
app.put("/api/productos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, precio, tipos_id } = req.body;

        if (!nombre || precio <= 0 || !tipos_id) {
            return res.status(422).json({ mensaje: "Datos inválidos" });
        }

        const pool = await sql.connect(config);

        await pool.request()
            .input("id", sql.Int, id)
            .input("nombre", sql.VarChar(150), nombre)
            .input("precio", sql.Decimal(10, 2), precio)
            .input("tipos_id", sql.Int, tipos_id)
            .query(`
                UPDATE productos 
                SET nombre = @nombre, precio = @precio, tipos_id = @tipos_id
                WHERE id = @id
            `);

        res.json({ mensaje: "Producto actualizado" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error interno" });
    }
});

// delete producto
app.delete("/api/productos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const pool = await sql.connect(config);

        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM productos WHERE id = @id");

        res.json({ mensaje: "Producto eliminado" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error interno" });
    }
});

app.listen(3001, () => {
    console.log("API corriendo en http://localhost:3001");
});
