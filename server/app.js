const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// routes
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const locationRoutes = require("./routes/locationRoutes");
const allowedOrigin = 'http://localhost:5173';

const app = express();

app.use(cors({
  origin: allowedOrigin,
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(morgan('tiny'));

app.use("/users", userRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/location", locationRoutes);


module.exports = app;