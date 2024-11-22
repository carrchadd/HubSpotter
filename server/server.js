const app = require("../app");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
       app.listen(PORT, process.env.HOST , () => {
         console.log('Server is running on port', PORT);
     });
})
.catch(err => console.log(err.message))

module.exports = { app, server };