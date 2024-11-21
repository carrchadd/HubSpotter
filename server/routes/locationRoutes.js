const express = require("express");
const router = express.Router();
const controller = require("../controllers/locationController");

// save location and save it to user
router.post("/save", controller.saveLocation);

module.exports = router;