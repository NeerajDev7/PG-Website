import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mysql from "mysql2";
import cors from "cors";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import bcrypt from "bcryptjs";
import multer from 'multer';
import path from 'path';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }
  console.log("MySQL connected!");
});

const MySQLSessionStore = MySQLStore(session);
const sessionStore = new MySQLSessionStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(
  session({
    secret: "My first session",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  }),
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

app.post("/api/login", (req, res) => {
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
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      res.json({ success: true, role: user.role });
    },
  );
});

app.get("/api/me", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, role: req.session.role });
  } else if (req.session.tenantId) {
    res.json({
      loggedIn: true,
      role: "tenant",
      tenantId: req.session.tenantId,
    });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

app.post("/api/tenant-login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM tenants WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Login failed" });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const tenant = results[0];
      const match = await bcrypt.compare(password, tenant.password_hash);

      if (!match) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      req.session.tenantId = tenant.id;
      req.session.role = "tenant";

      res.json({ success: true, tenantId: tenant.id, name: tenant.name });
    },
  );
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "Server is alive" });
});

app.get("/api/tenants", (req, res) => {
  db.query("SELECT * FROM tenants", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch tenants" });
    }
    res.json(results);
  });
});

app.post("/api/tenants", (req, res) => {
  const { name, room, rent, paid } = req.body;
  const sql = "INSERT INTO tenants (name,room,rent,paid) VALUES (?,?,?,?)";
  db.query(sql, [name, room, rent, paid ?? false], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add tenant" });
    }
    res
      .status(201)
      .json({ id: result.insertId, name, room, rent, paid: paid ?? false });
  });
});

app.patch("/api/tenants/profile", (req, res) => {
  const tenantId = req.session.tenantId;
  if (!tenantId) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }
  const { phone, email, hometown, address, mealType, emergencyContact } =
    req.body;

  const sql = `UPDATE tenants SET 
    phone = ?, email = ?, hometown = ?, address = ?, meal_type = ?,
    emergency_name = ?, emergency_phone = ?, emergency_relation = ?
    WHERE id = ?`;

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
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update profile" });
      }
      res.json({ success: true });
    },
  );
});

app.get("/api/rooms", (req, res) => {
  db.query("SELECT * FROM rooms", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch rooms" });
    }
    res.json(results);
  });
});

app.patch("/api/tenants/:id/paid", (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE tenants SET paid = true WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update tenant" });
      }
      res.json({ success: true });
    },
  );
});

app.delete("/api/tenants/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tenants WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete tenant" });
    }
    res.json({ success: true });
  });
});

app.patch("/api/tenants/reset-month", (req, res) => {
  db.query("UPDATE tenants SET paid = false", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to reset month" });
    }
    res.json({ success: true });
  });
});

app.get("/api/menu", (req, res) => {
  db.query("SELECT * FROM menu", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch menu" });
    }
    res.json(results);
  });
});

app.patch("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  const { mealType, items } = req.body;

  if (!["breakfast", "lunch", "dinner"].includes(mealType)) {
    return res.status(400).json({ error: "Invalid meal type" });
  }

  const sql = `UPDATE menu SET ${mealType} = ? WHERE id = ?`;
  db.query(sql, [JSON.stringify(items), id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update menu" });
    }
    res.json({ success: true });
  });
});

app.get("/api/complaints", (req, res) => {
  db.query("SELECT * FROM complaints", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch complaints" });
    }
    res.json(results);
  });
});

app.post("/api/complaints", (req, res) => {
  const { tenantId, tenantName, room, category, description } = req.body;
  const createdAt = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const sql =
    "INSERT INTO complaints (tenant_id, tenant_name, room, category, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [tenantId, tenantName, room, category, description, "pending", createdAt],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add complaint" });
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
    },
  );
});

app.patch("/api/complaints/:id/resolve", (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE complaints SET status = ? WHERE id = ?",
    ["resolved", id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to resolve complaint" });
      }
      res.json({ success: true });
    },
  );
});

app.delete("/api/complaints/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM complaints WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete complaint" });
    }
    res.json({ success: true });
  });
});

app.get("/api/expenses", (req, res) => {
  db.query("SELECT * FROM expenses", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch expenses" });
    }
    res.json(results);
  });
});

app.post("/api/expenses", (req, res) => {
  const { title, amount, category, month, year } = req.body;
  const sql =
    "INSERT INTO expenses (title, amount, category, month, year) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [title, amount, category, month, year], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add expense" });
    }
    res
      .status(201)
      .json({ id: result.insertId, title, amount, category, month, year });
  });
});

app.patch("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  const { title, amount, category, month, year } = req.body;
  const sql =
    "UPDATE expenses SET title = ?, amount = ?, category = ?, month = ?, year = ? WHERE id = ?";
  db.query(sql, [title, amount, category, month, year, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update expense" });
    }
    res.json({ success: true });
  });
});

app.delete("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM expenses WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete expense" });
    }
    res.json({ success: true });
  });
});

app.post('/api/documents', upload.single('file'), (req, res) => {
  const tenantId = req.session.tenantId;
  if (!tenantId) return res.status(401).json({ error: 'Please login first' });

  const uploadedAt = new Date().toLocaleDateString('en-IN');
  const sql = 'INSERT INTO documents (tenant_id, filename, original_name, uploaded_at) VALUES (?, ?, ?, ?)';
  db.query(sql, [tenantId, req.file.filename, req.file.originalname, uploadedAt], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save document' });
    }
    res.status(201).json({
      id: result.insertId, tenantId, filename: req.file.filename,
      originalName: req.file.originalname, uploadedAt
    });
  });
});

app.get('/api/documents/:tenantId', (req, res) => {
  db.query('SELECT * FROM documents WHERE tenant_id = ?', [req.params.tenantId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
    res.json(results);
  });
});

app.delete('/api/documents/:id', (req, res) => {
  db.query('DELETE FROM documents WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete document' });
    }
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running.....");
});