import express from "express";

import {
    getMenu,
    updateMenu,
} from "../controllers/menuController.js";

const router = express.Router();

router.get("/", getMenu);

router.patch("/:id", updateMenu);

export default router;