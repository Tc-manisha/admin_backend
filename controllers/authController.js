const db = require("../db/databse")
const Admin = require("../models/Admin");
const Admins = db.Admin;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSec = 'your-secret-key';
const ErrorHandler = require("../utils/ErrorHandler")
const SuccessHandler = require("../utils/succesHandler")

require("dotenv").config({ path: ".variables.env" });

exports.register = async (req, res) => {
  try {
    const { email, password, passwordCheck, name, surname } = req.body;

    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: 'Not all fields have been entered.' });
    }

    if (password.length < 5) {
      return res.status(400).json({ msg: 'The password needs to be at least 5 characters long.' });
    }

    if (password !== passwordCheck) {
      return res.status(400).json({ msg: 'Enter the same password twice for verification.' });
    }

    const existingAdmin = await Admin.findOne({ where: { email: email } });
    if (existingAdmin) {
      return res.status(400).json({ msg: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      email: email,
      password: passwordHash,
      name: name || email, // If name is not provided, use email as default name
      surname: surname,
    });

    res.status(200).send({
      success: true,
      admin: {
        id: newAdmin.admin_id, // Assuming your primary key field is named 'admin_id'
        name: newAdmin.name,
        surname: newAdmin.surname,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Internal Server Error',
    });
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler('Not all fields have been entered.', false, ));
    }

    const admin = await Admins.findOne({ where: { email: email } });

    if (!admin) {
      return next(new ErrorHandler('No account with this email has been registered.', false, ));
    }
    if (password !== admin.password) {
      return next(new ErrorHandler("password Doesn't match.", false, ));
    }
    
    const payload = {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      id: admin.admin_id,
    };

    const token = jwt.sign(payload, 'jwtSec');

    // Update isLoggedIn status in the database
    await Admins.update({ isLoggedIn: true }, { where: { admin_id: admin.admin_id } });

    const successHandler = new SuccessHandler({
      token: token,
      admin: {
        id: admin.admin_id,
        name: admin.name,
        isLoggedIn: true,
      }
    }, 'Successfully login admin');

    return successHandler.send(res, 200);
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(err.message, false, 500));
  }
};


exports.isValidToken = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: "No authentication token, authorization denied.",
        jwtExpired: true,
      });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Token verification failed, authorization denied.",
        jwtExpired: true,
      });

    const admin = await Admin.findOne({ _id: verified.id });
    if (!admin)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin doens't Exist, authorization denied.",
        jwtExpired: true,
      });

    if (admin.isLoggedIn === false)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin is already logout try to login, authorization denied.",
        jwtExpired: true,
      });
    else {
      req.admin = admin;
      // console.log(req.admin);
      next();
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
      jwtExpired: true,
    });
  }
};

exports.logout = async (req, res) => {
  const result = await Admin.findOneAndUpdate(
    { _id: req.admin._id },
    { isLoggedIn: false },
    {
      new: true,
    }
  ).exec();

  res.status(200).json({ isLoggedIn: result.isLoggedIn });
};
