import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Login failed" });
      }

      if (results.length === 0) {
        return res.status(401).json({
          error: "Invalid username or password",
        });
      }

      const user = results[0];

      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({
          error: "Invalid username or password",
        });
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      res.json({
        success: true,
        role: user.role,
      });
    },
  );
};

export const tenantLogin = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM tenants WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Login failed",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          error: "Invalid username or password",
        });
      }

      const tenant = results[0];

      const match = await bcrypt.compare(password, tenant.password_hash);

      if (!match) {
        return res.status(401).json({
          error: "Invalid username or password",
        });
      }

      req.session.tenantId = tenant.id;
      req.session.role = "tenant";

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({
            error: "Session save failed",
          });
        }
        console.log("LOGIN Session ID:", req.sessionID);
        console.log("LOGIN Session:", req.session);

        res.json({
          success: true,
          tenantId: tenant.id,
          name: tenant.name,
        });
      });
    },
  );
};

export const me = (req, res) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);

  if (req.session.userId) {
    return res.json({
      loggedIn: true,
      role: req.session.role,
    });
  }

  if (req.session.tenantId) {
    return res.json({
      loggedIn: true,
      role: "tenant",
      tenantId: req.session.tenantId,
    });
  }

  return res.json({
    loggedIn: false,
  });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Failed to logout",
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      success: true,
    });
  });
};
