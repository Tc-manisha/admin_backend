const SuccessHandler = require("../utils/succesHandler");
module.exports = (success, req, res, next) => {
  success.data = success.data || [];
  success.message = success.message || 'Successfully find'; 

  const successHandler = new SuccessHandler(success.data, success.message);
  return successHandler.send(res);
};