const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

// login
router.post("/login", controller.loginUser);

// signup
router.post("/signup", controller.signupUser);

module.exports = router;