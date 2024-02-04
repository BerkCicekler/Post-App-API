const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const imageUploader = require("../../utils/multer_util");
const router = express.Router();

const env = require("../../env.json")
const pool = require("../../database/index");

router.get("/", async (req, res, next) => {
    const body = req.body;
    const mail = body.mail;
    const password = body.password;
    if (mail == undefined || password == undefined) {
        res.status(400).json({
            "error": "Invalid request",
            "message": "Mail and password must be provided in the request body."
        })
        return;
    }
    const [users, fields] = await pool.query(
        'SELECT * FROM `users` WHERE mail = ?', [mail]
    );
    if (users[0] == null) {
        res.status(401).json({
            "error": "Invalid Mail",
            "message": "There is no matching account with the given mail in users"
        })
        return;
    }

    const isPasswordMatch = bcrypt.compareSync(password, users[0].password);
    if (!isPasswordMatch) {
        res.status(401).json({
            "error": "Invalid Password",
            "message": "The password given does not match with this account's email address"
        })
        return;
    }
    delete users[0]["password"];

    const token = jwt.sign({
        mail: users[0].mail,
        id: users[0].id
    }, env.JWT_KEY, {expiresIn: "1h"});

    users[0].authToken = token;

    res.status(200).json(users[0]);
});

router.post("/", imageUploader.single('profileImage'),async (req, res, next) => {
    const body = req.body;
    const name = body.name;
    const mail = body.mail;
    const password = body.password;
    if (name == undefined || mail == undefined || password == undefined) {
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
    const hashedPassword = bcrypt.hashSync(password, 10);
    const [rows, fields] = await pool.query(sql, [req.file != null ? req.file.path : '',name, mail,hashedPassword]);
    res.status(200).json({
        "success": "User created"
    });
});

module.exports = router;