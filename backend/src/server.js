import dotenv from "dotenv";
dotenv.config();

import express from "express"
import cors from "cors"
import authRouters from "./routes/auth.js"

const port = 8080;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouters);

app.listen(port, ()=>{
  console.log("Listening...")
})