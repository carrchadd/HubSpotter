const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
       app.listen(port, host , () => {
         console.log('Server is running on port', process.env.PORT);
     });
})
.catch(err => console.log(err.message))


app.use("/users", userRoutes);

app.listen(5001, () => {
   console.log("Server started on port 5001")
   console.log(process.env.PORT)
})