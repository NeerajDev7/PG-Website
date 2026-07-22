import express from "express";

import {
    getComplaints,
    createComplaint,
    resolveComplaint,
    deleteComplaint,
} from "../controllers/complaintController.js";

const router = express.Router();

router.get("/", getComplaints);

router.post("/", createComplaint);

router.patch("/:id/resolve", resolveComplaint);

router.delete("/:id", deleteComplaint);

export default router;