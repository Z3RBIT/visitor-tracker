const { Router } = require("express");
const {
  createVisitor,
  getAllVisitors,
  getOneVisitor,
  getStatistics,
  generateLog,
} = require("../controllers/visitorsController");
const validateVisitor = require("../middleware/validateVisitor");

const router = Router();

router.get("/stats", getStatistics);
router.get("/logs/download", generateLog);
router.get("/", getAllVisitors);
router.get("/:id", getOneVisitor);
router.post("/", validateVisitor, createVisitor);

module.exports = router;
