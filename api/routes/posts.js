const express = require("express");
const router = express.Router();
const pool = require("../../database/index");
const imageUploader = require("../../utils/multer_util");

router.get("/:start", async (req, res, next) => {
    const [rows, fields] = await pool.query("SELECT * FROM posts ORDER BY id DESC LIMIT 20 OFFSET ?", [parseInt(req.params.start)]);
    res.status(200).json(rows);
});

router.post("/", imageUploader.single('image'),async (req, res, next) => {
    const body = req.body;
    const title = body.title;
    const context = body.context;
    const filePath = req.file.path;
    const sql = "INSERT INTO posts(title, context, imagePath) value(?,?,?)";
    const [rows, fields] = await pool.query(sql, [title, context, filePath]);
    res.status(200).json({
        "success": "post created"
    });
});

module.exports = router;