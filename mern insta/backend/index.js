import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server } from "./socket/socket.js"
import path from "path";

dotenv.config({});

// const __dirname = path.resolve();

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
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// app.use(express.static(path.join(__dirname, "./frontend/dist")));
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// })

const PORT = process.env.PORT;

server.listen(PORT, () => {
    connectDB();
    console.log(`server listen at ${PORT}`)
})