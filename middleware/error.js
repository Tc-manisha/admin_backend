const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 200;
    err.message = err.message || "Internal server Error";
    err.custom_message = err.custom_message || "there are some problem";
 
 

    if (err instanceof ErrorHandler) {
        statusCode = err.statusCode;
        msg = err.message;
        data = err.data;
      }

  return res.status(200).json({
    status:false,
    message: err.custom_message,
    error: err.message,
    data : []
  });
};
