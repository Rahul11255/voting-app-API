const express = require("express");
const morgan = require("morgan");
const cors = require("cors")
const body_parser = require("body-parser")
require("dotenv").config()
const app = express();
const db = require("./db")
const fileupload = require('express-fileupload')

// Controll All routes 
const auth_route = require("./routes/auth");
const candidate_route = require("./routes/candidate")

// Port 
const PORT = process.env.PORT 

// Middleware
app.use(fileupload({
  useTempFiles:true
}))
app.use(morgan("tiny"));
app.use(body_parser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use(express.static("images"))

app.get("/", (req, res) => {
  res.json({message:"Server in Running"});
});

// Middleware
app.use("", auth_route);
app.use("",candidate_route)


app.listen(PORT, () => {
  console.log(`Server is running at Port : ${PORT}`);
});
