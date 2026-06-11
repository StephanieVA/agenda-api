require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((error) => {
  if (error) {
    console.error("Error conectando a MySQL:", error);
    return;
  }

  console.log("MySQL conectado");
});

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor ejecutándose en puerto ${process.env.PORT || 3000}`);
});

app.get("/documentos", (req, res) => {
  db.query("SELECT * FROM documentos ORDER BY id DESC", (error, resultados) => {
    if (error) {
      return res.status(500).json(error);
    }

    res.json(resultados);
  });
});

app.post("/documentos", (req, res) => {
  const { numero, asunto, descripcion } = req.body;

  db.query(
    `
        INSERT INTO documentos
        (
            numero,
            asunto,
            descripcion
        )
        VALUES (?, ?, ?)
        `,
    [numero, asunto, descripcion],
    (error, resultado) => {
      if (error) {
        return res.status(500).json(error);
      }

      res.json({
        mensaje: "Documento registrado",
      });
    },
  );
});
app.put("/documentos/:id/estado", (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  let sql = "";
  let valores = [];

  if (estado === "atencion") {
    sql = `
            UPDATE documentos
            SET estado = ?, fecha_inicio = NOW()
            WHERE id = ?
        `;

    valores = [estado, id];
  } else if (estado === "finalizado") {
    sql = `
            UPDATE documentos
            SET estado = ?, fecha_fin = NOW()
            WHERE id = ?
        `;

    valores = [estado, id];
  } else {
    sql = `
            UPDATE documentos
            SET estado = ?
            WHERE id = ?
        `;

    valores = [estado, id];
  }

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      return res.status(500).json(error);
    }

    res.json({
      mensaje: "Estado actualizado",
    });
  });
});
app.post("/seguimientos", (req, res) => {
  const { documento_id, detalle } = req.body;

  db.query(
    `
        INSERT INTO seguimientos
        (
            documento_id,
            detalle
        )
        VALUES (?, ?)
        `,
    [documento_id, detalle],
    (error, resultado) => {
      if (error) {
        return res.status(500).json(error);
      }

      res.json({
        mensaje: "Seguimiento registrado",
      });
    },
  );
});
app.get("/seguimientos/:documentoId", (req, res) => {
  const documentoId = req.params.documentoId;

  db.query(
    `
        SELECT *
        FROM seguimientos
        WHERE documento_id = ?
        ORDER BY fecha DESC
        `,
    [documentoId],
    (error, resultados) => {
      if (error) {
        return res.status(500).json(error);
      }

      res.json(resultados);
    },
  );
});
app.put("/seguimientos/:id", (req, res) => {
  const id = req.params.id;
  const { detalle } = req.body;

  db.query(
    `
        UPDATE seguimientos
        SET detalle = ?
        WHERE id = ?
        `,
    [detalle, id],
    (error, resultado) => {
      if (error) {
        return res.status(500).json(error);
      }

      res.json({
        mensaje: "Seguimiento actualizado",
      });
    },
  );
});
app.delete("/seguimientos/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    `
        DELETE FROM seguimientos
        WHERE id = ?
        `,
    [id],
    (error, resultado) => {
      if (error) {
        return res.status(500).json(error);
      }

      res.json({
        mensaje: "Seguimiento eliminado",
      });
    },
  );
});
