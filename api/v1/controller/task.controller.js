const Task = require("../models/task.model");
const paginationHepers = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");
const User = require("../models/users.model");
// [GET] /tasks/
module.exports.index = async (req, res) => {
    const find = {
        $or: [
            { createdBy: req.user.id },
            { listUser: req.user.id }
        ],
        deleted: false
    };
    // Bo loc trang thai
    if(req.query.status) {
        find.status = req.query.status;
    }

    // Sap xep theo 1 tieu chi
    let sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // Phan trang
    let imitPaginatiton = {
        limitItem: 2,
        currentPage: 1
    }

    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHepers(
        imitPaginatiton,
        req.query,
        countTasks
    );
    // Tim kiem
    const search = searchHelper(req.query);

    if (search.regex) {
        find.title = search.regex;
    }

    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skip);

    res.json(tasks);
};


// [GET] /tasks/detail/:id
module.exports.deltail = async (req, res) => {
    try {
        const id = req.params.id;
        const tasks = await Task.findOne({
            deleted: false,
            _id: id
        });
        res.json(tasks);
    } catch (error) {
        res.redirect("/tasks");
    }  
};


// [PATCH] /tasks/change-status/:id
module.exports.changeStatus= async (req, res) => {
    try {
        const id = req.params.id;

        const status = req.body.status;

        await Task.updateOne({
            _id: id,
        },{
            status: status
        });

        res.json({
            code: 200,
            message:"Cập nhật trạng thái thành công !" 
        });
    } catch (error) {
        res.json({
            code: 400,
            message:"Cập nhật trạng thái không thành công !"
        });
    }
};


// [PATCH] /tasks/change-multi
module.exports.changeMulti= async (req, res) => {
    try {

        const ids = req.body.id;
        const key = req.body.key;
        const value = req.body.value;

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in : ids }
                },{
                    status: value
                });

                res.json({
                    code: 200,
                    message:"Cập nhật trạng thái thành công !" 
                });
                break;
        
            default:
                res.json({
                    code: 400,
                    message:"Cập nhật trạng thái không thành công !"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message:"Cập nhật trạng thái không thành công !"
        });
    }
};


// [POST] /tasks/create
module.exports.createPost = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const taskCreate = new Task(req.body);
        const data = await taskCreate.save();

        res.json({
            code: 200,
            message: "Tạo thành công",
            data: data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo không thành công !",
            data: data
        })
    }
};

// [PATCH] /tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        await Task.updateOne({_id: id},req.body);

        res.json({
            code: 200,
            message: "Cập nhật thành công !",
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật không thành công !",
        })
    }
};

// [DELETE] /tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date(),
        })

        res.json({
            code: 200,
            message: "Xóa thành công !",
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa không thành công !",
        })
    }
};


// [DELETE] /tasks/delete-multi
module.exports.deleteMulti = async (req, res) => {
    try {

        const ids = req.body.id;
        const key = req.body.key;

        switch (key) {
            case "delete":
                await Task.updateMany({
                    _id: { $in : ids }
                },{
                    deleted: true,
                    deletedAt: new Date()
                });

                res.json({
                    code: 200,
                    message:"Xoá thành công !" 
                });
                break;
        
            default:
                res.json({
                    code: 400,
                    message:"Xóa không thành công !"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message:"Xóa không thành công !"
        });
    }
};