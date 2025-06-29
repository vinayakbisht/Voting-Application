
const express = require("express");
const app = express();
require("dotenv").config();
require("./db");
const path = require("path");
const userRouter = require("./Routes/userRoutes");
const candidateRouter = require("./Routes/candidateRoutes");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/user", userRouter);
app.use("/candidates",candidateRouter);

app.get("/", (req,res) =>{
    res.sendFile(path.join(__dirname + "/loginform.html"));
});

app.listen(PORT, () =>{
    console.log(`Server is listening on the port : `, PORT)
})