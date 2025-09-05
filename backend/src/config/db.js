import mongoose from "mongoose";

let notesDB;
let usersDB;

export const connectDB = async () => {
  try {
    notesDB = await mongoose.createConnection(process.env.MONGO_URI_NOTES );

    usersDB = await mongoose.createConnection(process.env.MONGO_URI_USERS);

    console.log("Both DBs connected successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

export const getNotesDB = () => notesDB;
export const getUsersDB = () => usersDB;
