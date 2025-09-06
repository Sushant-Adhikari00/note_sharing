import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { getUsersDB } from "../config/db.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    resetCode: String,
    resetCodeExpiry: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

let userModel;
export const getUserModel = () => {
  if (userModel) return userModel;
  const db = getUsersDB();
  if (!db) throw new Error("Users database not initialized");
  userModel = db.model("User", userSchema);
  return userModel;
};
