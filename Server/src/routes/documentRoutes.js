import express from "express";

import upload from "../config/multer.js";

import {
    uploadDocument,
    getDocuments,
    deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

router.post(
    "/",
    upload.single("file"),
    uploadDocument
);

router.get(
    "/:tenantId",
    getDocuments
);

router.delete(
    "/:id",
    deleteDocument
);

export default router;