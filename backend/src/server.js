import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path'


import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import { uploadNotes } from "./middleware/uploadNotes.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


//middleware
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use (express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(rateLimiter);



app.use("/api/notes", notesRoutes);

connectDB().then(() =>{

    app.listen(PORT, ()=> {
        console.log("Server started on PORT:",PORT);
    });

});

