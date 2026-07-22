import db from "../config/db.js";

export const getExpenses = (req, res) => {

    db.query("SELECT * FROM expenses", (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch expenses",
            });
        }

        res.json(results);
    });

};

export const createExpense = (req, res) => {

    const {
        title,
        amount,
        category,
        month,
        year,
    } = req.body;

    const sql =
        "INSERT INTO expenses (title, amount, category, month, year) VALUES (?, ?, ?, ?, ?)";

    db.query(
        sql,
        [title, amount, category, month, year],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to add expense",
                });
            }

            res.status(201).json({
                id: result.insertId,
                title,
                amount,
                category,
                month,
                year,
            });

        }
    );

};

export const updateExpense = (req, res) => {

    const { id } = req.params;

    const {
        title,
        amount,
        category,
        month,
        year,
    } = req.body;

    const sql =
        "UPDATE expenses SET title=?, amount=?, category=?, month=?, year=? WHERE id=?";

    db.query(
        sql,
        [title, amount, category, month, year, id],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to update expense",
                });
            }

            res.json({
                success: true,
            });

        }
    );

};

export const deleteExpense = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM expenses WHERE id=?",
        [id],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to delete expense",
                });
            }

            res.json({
                success: true,
            });

        }
    );

};