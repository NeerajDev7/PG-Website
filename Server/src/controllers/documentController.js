import db from "../config/db.js";

export const uploadDocument = (req, res) => {

    const tenantId = req.session.tenantId;

    if (!tenantId) {
        return res.status(401).json({
            error: "Please login first",
        });
    }

    const uploadedAt = new Date().toLocaleDateString("en-IN");

    const sql = `
        INSERT INTO documents
        (
            tenant_id,
            filename,
            original_name,
            uploaded_at
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            tenantId,
            req.file.filename,
            req.file.originalname,
            uploadedAt,
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to save document",
                });
            }

            res.status(201).json({
                id: result.insertId,
                tenantId,
                filename: req.file.filename,
                originalName: req.file.originalname,
                uploadedAt,
            });

        }
    );

};

export const getDocuments = (req, res) => {

    const { tenantId } = req.params;

    db.query(
        "SELECT * FROM documents WHERE tenant_id = ?",
        [tenantId],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to fetch documents",
                });
            }

            res.json(results);

        }
    );

};

export const deleteDocument = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM documents WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to delete document",
                });
            }

            res.json({
                success: true,
            });

        }
    );

};