const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

// login
router.post("/login", controller.loginUser);

// signup
router.post("/signup", controller.signupUser);

// profile
router.get("/profile", protect, controller.profile);

// logout
router.get("/logout", controller.logout);

module.exports = router;