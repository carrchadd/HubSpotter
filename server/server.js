const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// routes
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
       app.listen(process.env.PORT, process.env.HOST , () => {
         console.log('Server is running on port', process.env.PORT);
     });
})
.catch(err => console.log(err.message))

app.use("/users", userRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/location", locationRoutes);