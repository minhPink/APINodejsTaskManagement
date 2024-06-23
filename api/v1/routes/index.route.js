const taskRouter = require("./task.route");
const userRouter = require("./user.route");

const authMiddleware = require("../middleware/auth.middleware");

module.exports = (app) => {
    const version = "/api/v1";

    app.use(version + "/tasks", authMiddleware.requireAuth, taskRouter);

    app.use(version + "/users", userRouter);
}