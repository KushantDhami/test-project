import express from 'express'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoute from "./routes/userRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js";
dotenv.config({});

  
const app=express()
const PORT= process.env.PORT || 3000


const corsOptions = {
 origin: "http://localhost:5173",
 optionsSuccessStatus: 200,
  credentials : true
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use("/api/users", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);

app.listen(PORT,()=>{
    connectDB()
    console.log(`the port is running on ${PORT}`) 
})