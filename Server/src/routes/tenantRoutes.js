import express from "express";

import {
    getTenants,
    createTenant,
    updateTenantProfile,
    markTenantPaid,
    deleteTenant,
    resetMonth,
} from "../controllers/tenantController.js";

const router = express.Router();

router.get("/", getTenants);

router.post("/", createTenant);

router.patch("/profile", updateTenantProfile);

router.patch("/:id/paid", markTenantPaid);

router.delete("/:id", deleteTenant);

router.patch("/reset-month", resetMonth);

export default router;