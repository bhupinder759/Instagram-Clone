import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js";

dotenv.config({});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    return res.status(200).json({message: "I am coming" , success: true})
})

app.use("/api/v1/user", userRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    connectDB();
    console.log(`server listen at ${PORT}`)
})