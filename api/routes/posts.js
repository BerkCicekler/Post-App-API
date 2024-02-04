const express = require("express");
const router = express.Router();
const pool = require("../../database/index");
const imageUploader = require("../../utils/multer_util");
const checkAuth = require("../middleware/check_auth");

router.get("/:start", async (req, res, next) => {
    const sql = `SELECT posts.id, posts.title, posts.context, posts.imagePath, posts.userId, users.photoPath as 'userPhoto',  users.name as 'userName' FROM posts INNER JOIN users ON posts.userId = users.id ORDER BY posts.id DESC LIMIT 20 OFFSET ?`;
    const [rows, fields] = await pool.query(sql, [parseInt(req.params.start)]);

    const transformedRows = rows.map(row => {
        return {
            id: row.id,
            title: row.title,
            context: row.context,
            imagePath: row.imagePath,
            senderUser: {
            userId: row.userId,
            userPhoto: row.userPhoto,
            userName: row.userName
        }
        };
    });

    res.status(200).json(transformedRows);
});

router.post("/", imageUploader.single('image'), checkAuth,async (req, res, next) => {
    const body = req.body;
    const title = body.title;
    const context = body.context;
    const userData = req.userData;
    const filePath = req.file != null ? req.file.path : '';
    const sql = "INSERT INTO posts(title, context, imagePath, userId) value(?,?,?,?)";
    const [rows, fields] = await pool.query(sql, [title, context, filePath, userData.id]);
    res.status(200).json({
        "success": "post created"
    });
});

module.exports = router;