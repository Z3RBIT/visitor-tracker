require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const corsMiddleware = require("./middleware/cors");
const visitorsRouter = require("./routes/visitors");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(corsMiddleware);
app.use(express.json());

// Rutas
app.use("/api/visitors", visitorsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
