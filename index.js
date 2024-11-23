import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path";

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to mongoDB")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

const _dirname = path.resolve();

// to make input as json
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }))

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname, "frontend","dist","index.html"))
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})

// import routes
import authRouter from "./routes/auth.route.js"
import noteRouter from "./routes/note.route.js"

app.use("/api/auth", authRouter)
app.use("/api/note", noteRouter)

// error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Serer Error"

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
