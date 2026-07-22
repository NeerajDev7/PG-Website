import db from "../config/db.js";

export const getTenants = (req, res) => {
    db.query("SELECT * FROM tenants", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch tenants",
            });
        }

        res.json(results);
    });
};

export const createTenant = (req, res) => {

    const { name, room, rent, paid } = req.body;

    const sql =
        "INSERT INTO tenants (name,room,rent,paid) VALUES (?,?,?,?)";

    db.query(
        sql,
        [name, room, rent, paid ?? false],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to add tenant",
                });
            }

            res.status(201).json({
                id: result.insertId,
                name,
                room,
                rent,
                paid: paid ?? false,
            });

        }
    );
};

export const updateTenantProfile = (req, res) => {

    const tenantId = req.session.tenantId;

    if (!tenantId) {
        return res.status(401).json({
            success: false,
            message: "Please login first",
        });
    }

    const {
        phone,
        email,
        hometown,
        address,
        mealType,
        emergencyContact,
    } = req.body;

    const sql = `
        UPDATE tenants
        SET
            phone = ?,
            email = ?,
            hometown = ?,
            address = ?,
            meal_type = ?,
            emergency_name = ?,
            emergency_phone = ?,
            emergency_relation = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            phone,
            email,
            hometown,
            address,
            mealType,
            emergencyContact?.name,
            emergencyContact?.phone,
            emergencyContact?.relation,
            tenantId,
        ],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to update profile",
                });
            }

            res.json({
                success: true,
            });

        }
    );
};

export const markTenantPaid = (req, res) => {

    const { id } = req.params;

    db.query(
        "UPDATE tenants SET paid = true WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to update tenant",
                });
            }

            res.json({
                success: true,
            });

        }
    );
};

export const deleteTenant = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM tenants WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to delete tenant",
                });
            }

            res.json({
                success: true,
            });

        }
    );
};

export const resetMonth = (req, res) => {

    db.query(
        "UPDATE tenants SET paid = false",
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to reset month",
                });
            }

            res.json({
                success: true,
            });

        }
    );
};