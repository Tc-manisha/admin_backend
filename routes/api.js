const express = require("express");
const multer = require('multer');
const path= require('path');
const { catchErrors } = require("../handlers/errorHandlers");

const router = express.Router();

const adminController = require("../controllers/adminController");
const clientController = require("../controllers/clientController");

const leadController = require("../controllers/leadController");
const productController = require("../controllers/productController");



var liverurlnew = './image';

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        if(file.fieldname == 'studio_img'){
            cb(null,liverurlnew+"/studio_img")
        } 
        if(file.fieldname == 'services_img'){
          cb(null,liverurlnew+"/services_img")
      } 
      if(file.fieldname == 'session_img'){
        cb(null,liverurlnew+"/session_img")
    } 
    },
   
    filename: (req, file, cb) => {
      const filename = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
      console.log("Generated Filename:", filename); // Log the filename to the console
      cb(null, filename);
  }
    
})


const upload = multer({
    storage:storage
})

//_______________________________ Admin management_______________________________
router.route('/admin/create-studio').post(upload.single('studio_img'), catchErrors(adminController.createstudio));

router.route("/admin/get-studio").get(catchErrors(adminController.getstudio));
router.route("/admin/get-studio-service-by-id/:studio_id").get(catchErrors(adminController.getStudioById));
router.route("/admin/delete-studio/:studio_id").post(catchErrors( adminController.deleteStudio));
router.route("/admin/update-studio/:Studio_id").post(upload.single('studio_img'), catchErrors(adminController.updatestudio));
router.route("/admin/create-services").post(upload.single('services_img'),catchErrors(adminController.createService));
// router.get("/admin/get-services").get(catchErrors(adminController.getServices));
router.route("/admin/get-services").get(catchErrors(adminController.getServices));
router.route("/admin/get-service-by-id/:service_id").get(catchErrors(adminController.getServicesById));
router.route("/admin/deactive-services/:service_id").post(catchErrors(adminController.deactiveService));
router.route("/admin/active-services/:service_id").post(catchErrors(adminController.activeService));
router.route("/admin/update-services/:service_id").post(catchErrors(adminController.updateService));
router.route("/admin/create-sessions").post(upload.single('session_img'),catchErrors(adminController.createSession));
router.route("/admin/update-sessions").post(catchErrors(adminController.updateSession));
router.route("/admin/block-sessions").post(catchErrors(adminController.blockSession));
router.route("/admin/unblock-sessions").post(catchErrors(adminController.unblockSession));
router.route("/admin/get-booking").get(catchErrors(adminController.getbooking));
router.route("/admin/get-session-by-id/:session_id").get(catchErrors(adminController.getSessionById));
router.route("/admin/get-session").get(catchErrors(adminController.getSessions));
router.route("/admin/update/:id").patch(catchErrors(adminController.update));
router.route("/admin/delete/:id").delete(catchErrors(adminController.delete));
router.route("/admin/search").get(catchErrors(adminController.search));
router.route("/admin/list").get(catchErrors(adminController.list));

router
  .route("/admin/password-update/:id")
  .patch(catchErrors(adminController.updatePassword));
//list of admins ends here

//_____________________________________ API for clients __________________________
router.route("/client/create").post(catchErrors(clientController.create));
router.route("/client/read/:id").get(catchErrors(clientController.read));
router.route("/client/update/:id").patch(catchErrors(clientController.update));
router.route("/client/delete/:id").delete(catchErrors(clientController.delete));
router.route("/client/search").get(catchErrors(clientController.search));
router.route("/client/list").get(catchErrors(clientController.list));

//_____________________________________ API for leads ___________________________
router.route("/lead/create").post(catchErrors(leadController.create));
router.route("/lead/read/:id").get(catchErrors(leadController.read));
router.route("/lead/update/:id").patch(catchErrors(leadController.update));
router.route("/lead/delete/:id").delete(catchErrors(leadController.delete));
router.route("/lead/search").get(catchErrors(leadController.search));
router.route("/lead/list").get(catchErrors(leadController.list));

//_____________________________________ API for products ___________________________
router.route("/product/create").post(catchErrors(productController.create));
router.route("/product/read/:id").get(catchErrors(productController.read));
router
  .route("/product/update/:id")
  .patch(catchErrors(productController.update));
router
  .route("/product/delete/:id")
  .delete(catchErrors(productController.delete));
router.route("/product/search").get(catchErrors(productController.search));
router.route("/product/list").get(catchErrors(productController.list));

module.exports = router;
