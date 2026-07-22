import db from "../config/db.js";

export const getComplaints = (req, res) => {
    db.query("SELECT * FROM complaints", (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch complaints",
            });
        }

        res.json(results);
    });
};

export const createComplaint = (req, res) => {

    const {
        tenantId,
        tenantName,
        room,
        category,
        description,
    } = req.body;

    const createdAt = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const sql = `
        INSERT INTO complaints
        (
            tenant_id,
            tenant_name,
            room,
            category,
            description,
            status,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            tenantId,
            tenantName,
            room,
            category,
            description,
            "pending",
            createdAt,
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to add complaint",
                });
            }

            res.status(201).json({
                id: result.insertId,
                tenantId,
                tenantName,
                room,
                category,
                description,
                status: "pending",
                createdAt,
            });
        }
    );
};

export const resolveComplaint = (req, res) => {

    const { id } = req.params;

    db.query(
        "UPDATE complaints SET status = ? WHERE id = ?",
        ["resolved", id],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to resolve complaint",
                });
            }

            res.json({
                success: true,
            });
        }
    );
};

export const deleteComplaint = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM complaints WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to delete complaint",
                });
            }

            res.json({
                success: true,
            });
        }
    );
};