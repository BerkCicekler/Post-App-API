const jwt = require("jsonwebtoken");
const env = require("../../env.json")


module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, env.JWT_KEY);
        req.userDate = decoded;
    }catch {
        return res.status(401).json({
            message: "Auth Failed"
        })
    }
    next();
}