const express = require("express");
const router = express.Router();

const controller = require("../controller/task.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.deltail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post("/create", controller.createPost); 

router.patch("/edit/:id", controller.edit); 

router.delete("/delete/:id", controller.delete);

router.delete("/delete-multi", controller.deleteMulti);

module.exports = router;

