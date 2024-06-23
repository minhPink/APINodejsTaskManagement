const md5 = require('md5');
const User = require("../models/users.model.js");
const ForgotPassword = require("../models/forgot-password.model.js");
const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail.js");

// [POST] /users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);
    
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if(existEmail) {
        res.json({
            code: 400,
            message: "Email da ton tai !"
        })
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            tokenUser: generateHelper.generateRamdomString(20),
        });
        user.save();

        const token = user.tokenUser;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Tao tai khoan thanh cong !",
            token: token
        })
    };
}

// [POST] /users/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const existEmail = await User.findOne({
        email: email,
        deleted: false
    });

    if(!existEmail) {
        res.json({
            code: 400,
            message: "Email khong ton tai !"
        });
        return;
    };

    if(md5(password) !==  existEmail.password) {
        res.json({
            code: 400,
            message: "Sai mat khau !"
        });
        return;
    };

    const token = existEmail.tokenUser;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Dang nhap thanh cong !",
        token: token
    })
}

//[POST] /users/password/forgot
module.exports.forgotPassword = async (req , res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email
    });

    if(!user) {
        res.json({
            code: 400,
            message: "Email khong ton tai !"
        })
    };

    const otp = generateHelper.generateRamdomNumber(8);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);

    await forgotPassword.save();

    // Gửi mã OTP qua email
    //Gmail phải bật xác minh 2 bước mới có thể gửi mail tự động và tạo mật khẩu ứng dụng
    const subject = "Mã OTP xác minh lấy lại mật khẩu !";
    const html = `Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP.`
    sendMailHelper.sendMail(email, subject, html);

    res.json({
        code: 200,
        message: "Da gui ma OTP qua email"
    })
}

//[POST] /users/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result) {
        res.json({
            code: 400,
            message: "OTP khong hop le !"
        });
        return;
    }

    const user = await User.findOne({
        email: email
    });

    const token = user.tokenUser;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Xac thuc thanh cong !",
        token: token
    })
}

//[POST] /users/password/reset
module.exports.resetPassword = async (req, res) => {
    const token = req.body.token;
    const password = req.body.password;


    const user = await User.findOne({
        tokenUser: token
    });
    
    if(md5(password) == user.password) {
        res.json({
            code: 400,
            message: "Vui long nhap mat khau khac mat khau cu !"
        })
        return;
    }

    await User.updateOne({
        tokenUser: token
    }, {
        password: md5(password)
    });

    res.json({
        code: 200,
        message: "Thay doi mat khau thanh cong !"
    })
}

// [GET] /users/detail
module.exports.detail = async (req, res) => {
    try {
        res.json({
            code: 200,
            message: "Lay ra thong tin thanh cong !",
            info: req.user
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Khong thanh cong !"
        })
    }
}


//[GET] /users/list
module.exports.list = async (req, res) => {
    const users = await User.find({
        deleted: fasle
    }).select("fullName email");

    res.json({
        code: 200,
        message: "Lay thong tin tat ca moi nguoi",
        users: users
    })
}