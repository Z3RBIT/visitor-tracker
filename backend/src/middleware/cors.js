const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // Frontend en Docker
  "http://localhost:4000", // Backend
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, Power BI, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = cors(corsOptions);
