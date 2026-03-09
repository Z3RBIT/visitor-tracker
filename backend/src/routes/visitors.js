const { Router } = require("express");
const {
  createVisitor,
  getAllVisitors,
  getOneVisitor,
  getStatistics,
} = require("../controllers/visitorsController");
const validateVisitor = require("../middleware/validateVisitor");

const router = Router();

// GET /api/visitors/stats
router.get("/stats", getStatistics);

// GET /api/visitors
router.get("/", getAllVisitors);

// GET /api/visitors/:id
router.get("/:id", getOneVisitor);

// POST /api/visitors  ← agregamos validateVisitor
router.post("/", validateVisitor, createVisitor);

module.exports = router;
