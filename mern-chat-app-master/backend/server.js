// backend/server.js
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend/.env
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve the built frontend (../frontend/dist relative to backend/)
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

try {
  await connectToMongoDB(); // ensure DB is connected before listening
  server.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
  });
} catch (err) {
  console.error("Error connecting to MongoDB", err.message);
  process.exit(1);
}
