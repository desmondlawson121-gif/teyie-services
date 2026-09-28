const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// HOME / API TEST
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Teyei Services API is working!"
    });
});


// CREATE SERVICE REQUEST
app.post("/api/service-requests", (req, res) => {

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

    const result = db.prepare(`
        INSERT INTO service_requests
        (name, phone, service, location, date, message)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        name,
        phone,
        service,
        location || null,
        date || null,
        message || null
    );

    res.status(201).json({
        success: true,
        message: "Service request received!",
        id: result.lastInsertRowid
    });

});


// GET ALL SERVICE REQUESTS
app.get("/api/service-requests", (req, res) => {

    try {

        const requests = db.prepare(`
            SELECT *
            FROM service_requests
            ORDER BY id DESC
        `).all();

        res.json({
            success: true,
            requests: requests
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not retrieve service requests."
        });

    }

});

// UPDATE SERVICE REQUEST STATUS
app.patch("/api/service-requests/:id/status", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Status is required."
        });
    }

    try {

        const result = db.prepare(`
            UPDATE service_requests
            SET status = ?
            WHERE id = ?
        `).run(status, id);

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
app.delete("/api/service-requests/:id", (req, res) => {

    const { id } = req.params;

    try {

        const result = db.prepare(`
            DELETE FROM service_requests
            WHERE id = ?
        `).run(id);

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

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {
        return res.json({
            success: true,
            message: "Login successful."
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password."
    });

});

app.get("/api/service-requests", (req, res) => {
    const requests = db.prepare(`
        SELECT *
        FROM service_requests
        ORDER BY id DESC
    `).all();

    res.json({
        success: true,
        requests: requests
    });
});


// START SERVER
app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Teyei Services API running on http://localhost:${PORT}`
    );

});