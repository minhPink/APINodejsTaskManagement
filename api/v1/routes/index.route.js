const taskRouter = require("./task.route");

module.exports = async (app) => {
    const version = "/api/v1";

    app.use(version + "/tasks", taskRouter);
}