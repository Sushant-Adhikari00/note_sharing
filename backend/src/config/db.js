import mongoose from "mongoose";

let notesDB;
let usersDB;

// Connect both DBs
export const connectDB = async () => {
  try {
    notesDB = await mongoose.createConnection(process.env.MONGO_URI_NOTES);

    usersDB = await mongoose.createConnection(process.env.MONGO_URI_USERS);

    console.log("Both DBs connected successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

// Get Notes DB
export const getNotesDB = () => {
  if (!notesDB) throw new Error("Notes DB not initialized. Call connectDB first.");
  return notesDB;
};

// Get Users DB
export const getUsersDB = () => {
  if (!usersDB) throw new Error("Users DB not initialized. Call connectDB first.");
  return usersDB;
};
