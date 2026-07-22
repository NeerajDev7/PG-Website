import db from "../config/db.js";

export const getMenu = (req, res) => {
    db.query("SELECT * FROM menu", (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch menu",
            });
        }

        res.json(results);
    });
};

export const updateMenu = (req, res) => {
    const { id } = req.params;
    const { mealType, items } = req.body;

    if (!["breakfast", "lunch", "dinner"].includes(mealType)) {
        return res.status(400).json({
            error: "Invalid meal type",
        });
    }

    const sql = `UPDATE menu SET ${mealType} = ? WHERE id = ?`;

    db.query(
        sql,
        [JSON.stringify(items), id],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to update menu",
                });
            }

            res.json({
                success: true,
            });

        }
    );
};