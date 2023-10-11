class SuccessHandler {
    constructor(data, message = 'Successfully found') {
      this.data = data;
      this.message = message;
    }
  
    send(res, statusCode = 200) {
      return res.status(statusCode).json({
        status: true,
        message: this.message,
        error: '',
        data: this.data,
      });
    }
  }
  
  module.exports = SuccessHandler;
  