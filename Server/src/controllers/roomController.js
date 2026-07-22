import db from "../config/db.js";

export const getRooms = (req, res) => {
    db.query("SELECT * FROM rooms", (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch rooms",
            });
        }

        res.json(results);
    });
};