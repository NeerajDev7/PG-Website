import express from "express";

import {
    login,
    logout,
    me,
    tenantLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.post("/tenant-login", tenantLogin);

router.get("/me", me);

router.post("/logout", logout);

export default router;