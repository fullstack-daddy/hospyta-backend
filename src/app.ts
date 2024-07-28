import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

export default app;
