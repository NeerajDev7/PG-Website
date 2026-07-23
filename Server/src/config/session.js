// import session from "express-session";
// import MySQLStore from "express-mysql-session";

// export default function configureSession(app) {
//   console.log("DB CONFIG:", {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//   });

//   const MySQLSessionStore = MySQLStore(session);

//   const sessionStore = new MySQLSessionStore({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   });

//   app.use(
//     session({
//       secret: "My first session",
//       resave: false,
//       saveUninitialized: false,
//       store: sessionStore,
//       cookie: {
//         maxAge: 1000 * 60 * 60 * 24,
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//       },
//     }),
//   );
// }

import session from "express-session";
import MySQLStore from "express-mysql-session";

export default function configureSession(app) {
    const MySQLSessionStore = MySQLStore(session);

    console.log("Creating session store...");

    const sessionStore = new MySQLSessionStore({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    sessionStore.onReady()
        .then(() => {
            console.log("✅ Session store connected!");
        })
        .catch((err) => {
            console.error("❌ Session store failed:", err);
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
                secure: true,
                sameSite: "none",
            },
        })
    );
}
