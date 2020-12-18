const uniqid = require("uniqid");
const createUserId = (req, res, next) => {
	req.headers.userId = "user" + "-" + uniqid();
	next();
};

module.exports = createUserId;
