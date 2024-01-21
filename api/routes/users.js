const express = require("express");
const bcrypt = require("bcrypt");
const imageUploader = require("../../utils/multer_util");
const router = express.Router();

const pool = require("../../database/index");

router.get("/", async (req, res, next) => {
    const body = req.body;
    if (body.mail == null || body.password == null) {
        res.status(400).json({
            "error": "Invalid request",
            "message": "Mail and password must be provided in the request body."
        })
        return;
    }
    const [user, fields] = await pool.query(
        'SELECT * FROM `users` WHERE mail = ? AND password = ?', [body.mail, body.password]
    );
    if (user.length == 0) {
        res.status(401).json({
            "error": "Invalid account",
            "message": "There is no matching account with the given mail and password in users"
        })
        return;
    }
    res.status(200).json(user);
});

router.post("/", imageUploader.single('profileImage'),async (req, res, next) => {
    const body = req.body;
    const name = body.name;
    const mail = body.mail;
    const password = body.password;
    if (name == null || mail == null || password == null) {
        res.status(400).json({
            "error": "Invalid request",
            "message": "All there parameters must be given in the body"
        });
        return;
    }
    const [userCount, field] = await pool.query(
        'SELECT * FROM `users` WHERE mail = ?', [mail]
    );
    if (userCount.length > 0) {
        res.status(409).send({
            "error": "Conflict",
            "message": "A user with the provided email address already exists."
        });
        return;
    }
    const sql = "INSERT INTO users(photoPath, name,mail,password) value(?,?,?,?)";
    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows, fields] = await pool.query(sql, [req.file.path,name, mail,hashedPassword]);
    res.status(200).json({
        "success": "User created"
    });
});

module.exports = router;