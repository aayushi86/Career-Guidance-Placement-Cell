const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { askAI } = require("../controllers/assistantController");

router.post("/", protect, askAI);

module.exports = router;