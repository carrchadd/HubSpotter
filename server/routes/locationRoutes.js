const express = require("express");
const router = express.Router();
const controller = require("../controllers/locationController");
const protect = require("../middleware/authMiddleware");

// save location and save it to user
router.post("/save", protect, controller.saveLocation);

module.exports = router;