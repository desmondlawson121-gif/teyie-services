const express = require("express");
const path = require("path");
const jwt = require ("jsonwebtoken")
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


// HOME / API TEST
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Teyie Services API is working!"
    });
});


// CREATE SERVICE REQUEST
app.post("/api/service-requests", async (req, res) => {

    const {
        name,
        phone,
        service,
        location,
        date,
        message
    } = req.body;

    if (!name || !phone || !service) {
        return res.status(400).json({
            success: false,
            message: "Name, phone and service are required."
        });
    }

    try {

        let sql;
        let params;

        if (db.dbType === "postgres") {

            sql = `
                INSERT INTO service_requests
                (name, phone, service, location, date, message)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `;

            params = [
                name,
                phone,
                service,
                location || null,
                date || null,
                message || null
            ];

        } else {

            sql = `
                INSERT INTO service_requests
                (name, phone, service, location, date, message)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            params = [
                name,
                phone,
                service,
                location || null,
                date || null,
                message || null
            ];
        }

        const result = await db.run(sql, params);

        res.status(201).json({
            success: true,
            message: "Service request received!",
            id: result.lastInsertRowid
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not save service request."
        });

    }

});


// GET ALL SERVICE REQUESTS
app.get("/api/service-requests", authenticateToken, async (req, res) => {

    try {

        const requests = await db.all(`
            SELECT *
            FROM service_requests
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            requests: requests
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// UPDATE SERVICE REQUEST STATUS
app.patch("/api/service-requests/:id/status", authenticateToken, async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Status is required."
        });
    }

    try {

        let sql;
        let params;

        if (db.dbType === "postgres") {

            sql = `
                UPDATE service_requests
                SET status = $1
                WHERE id = $2
            `;

            params = [status, id];

        } else {

            sql = `
                UPDATE service_requests
                SET status = ?
                WHERE id = ?
            `;

            params = [status, id];
        }

        const result = await db.run(sql, params);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Service request not found."
            });
        }

        res.json({
            success: true,
            message: "Request status updated."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not update request status."
        });

    }

});


// DELETE SERVICE REQUEST
app.delete("/api/service-requests/:id", authenticateToken, async (req, res) => {

    const { id } = req.params;

    try {

        let sql;
        let params;

        if (db.dbType === "postgres") {

            sql = `
                DELETE FROM service_requests
                WHERE id = $1
            `;

            params = [id];

        } else {

            sql = `
                DELETE FROM service_requests
                WHERE id = ?
            `;

            params = [id];
        }

        const result = await db.run(sql, params);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Service request not found."
            });
        }

        res.json({
            success: true,
            message: "Service request deleted."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not delete service request."
        });

    }

});


// ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {

    const { username, password } = req.body;

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        const token = jwt.sign(
            {username},
            JWT_SECRET,
            {expiresIn: "2h"}
        );

        return res.json({
            success: true,
            message: "Login successful.",
            token: token
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password."
    });

});

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required."
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        req.user = user;
        next();
    });
}



// START SERVER
app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Teyie Services API running on http://localhost:${PORT}`
    );

});