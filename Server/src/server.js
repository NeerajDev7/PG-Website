import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import configureSession from "./config/session.js";

import authRoutes from "./routes/authRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://pg-website-omega.vercel.app",
    credentials: true,
  }),
);


app.use(express.json());

configureSession(app);

app.get("/test2", (req, res) => {
    res.json({ success: true });
});

app.use("/uploads", express.static("uploads"));

app.use("/api", authRoutes);

app.use("/api/tenants", tenantRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/menu", menuRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running.....");
});
