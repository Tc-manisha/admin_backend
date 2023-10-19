const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const db = require("../db/databse");
const Admin = require("../models/Admin");
const Admins = db.Admin;
const User = require("../models/user");
const users =db.User
const service = require("../models/services");
const services = db.services;
const session = require("../models/session");
const Sessions = db.session;
const Studio = require("../models/studio");
const Studios = db.Studio;
const booking = require("../models/booking");
const bookings =db.booking
const ErrorHandler = require("../utils/ErrorHandler");
const SuccessHandler = require("../utils/succesHandler");



/**
 *  Get all documents of a Model
 *  @param {Object} req.params
 *  @returns {Object} Results with pagination
 */

exports.list = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    const resultsPromise = Admin.find()
      .skip(skip)
      .limit(limit)
      .sort({ created: "desc" })
      .populate();
    // Counting the total documents
    const countPromise = Admin.count();
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      for (let admin of result) {
        admin.password = undefined;
      }
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: "Successfully found all documents",
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: "Collection is Empty",
      });
    }
  } catch {
    return res
      .status(500)
      .json({ success: false, result: [], message: "Oops there is an Error" });
  }
};
exports.profile = async (req, res) => {
  try {
    //  Query the database for a list of all results
    if (!req.admin) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "couldn't found  admin Profile ",
      });
    }
    let result = {
      _id: req.admin._id,
      enabled: req.admin.enabled,
      email: req.admin.email,
      name: req.admin.name,
      surname: req.admin.surname,
    };

    return res.status(200).json({
      success: true,
      result,
      message: "Successfully found Profile",
    });
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

exports.read = async (req, res) => {
  try {
    // Find document by id
    const tmpResult = await Admin.findOne({
      _id: req.params.id,
    });
    // If no results found, return document not found
    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    } else {
      // Return success resposne
      let result = {
        _id: tmpResult._id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
      };

      return res.status(200).json({
        success: true,
        result,
        message: "we found this document by this id: " + req.params.id,
      });
    }
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

/**
 *  Creates a Single document by giving all necessary req.body fields
 *  @param {object} req.body
 *  @returns {string} Message
 */

exports.createstudio = async (req, res, next) => {
  try {
    const {name, email, contact_no, description, rating } = req.body;
const existingstudio = await Studios.findOne({
  where: {
    email: email,
  }
});            

                         
if (existingstudio) {
  return next(new ErrorHandler("email already exit"));
}
  let status=1;
    const newStudio = await Studios.create({
      name: name,
      email: email,
      contact_no: contact_no,
      description: description,
      rating: rating,
      studio_img: req.file.filename,
      status: status,
    });
    const successHandler = new SuccessHandler(
      {
        newStudio,
      },
      "studio created successfully."
    );
    return successHandler.send(res, 200);
  } catch (error) {
    console.log(error); 
    return next(new ErrorHandler(error.message));
  }
};
exports.getstudio = async (req, res, next) => {
  try {
    const Studio = await Studios.findAll({});

    if (!Studio || Studio.length === 0) {
      return next(new ErrorHandler(error.message));
    }
    const successResponse = new SuccessHandler(
      { Studio },
      "Studio found successfully"
    );
    return successResponse.send(res);
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

exports.getStudioById = async (req, res, next) => {
  const { studio_id } = req.params;
  try {
    const studio = await Studios.findOne({
      where: {
        Studio_id: studio_id,
      },
    });
    
    if (!studio) {
      return next(new ErrorHandler("Studio not found"));
    }

    const service = await services.findAll({
      where: {
        Studio_id: studio_id,
      },
    });

    if (!service || service.length === 0) {
      return next(new ErrorHandler("Services not found"));
    }

    const parsedServices = service.map(service => {
      let parsedSeoTags = {};
      if (service.seo_tags) {
        try {
          parsedSeoTags = JSON.parse(service.seo_tags);
        } catch (error) {
          console.error("Error parsing seo_tags:", error);
        }
      }
      return {
        ...service.toJSON(),
        seo_tags: parsedSeoTags,
      };
    });

    const successResponse = new SuccessHandler(
      {
        services: parsedServices,
      },
      "Studio and services found successfully"
    );

    return successResponse.send(res);
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

exports.deleteStudio = async (req, res, next) => {
  try {
    const { studio_id } = req.params;
    const Studio = await Studios.findByPk(studio_id);
  
    if (!Studio) {
      return next(new ErrorHandler("studio not found"));
    }
    const newStatus = Studio.status ? 0 : 1;

  
    await Studios.update({ status: newStatus }, {
      where: { Studio_id: studio_id }
    });
    const successResponse = new SuccessHandler(
      {},
      "Studio soft deleted successfully."
    );
    return successResponse.send(res, 200);
  } catch (error) {
    console.log(error)
    return next(new ErrorHandler(error.message));
  }
};
exports.updatestudio = async (req, res, next) => {
  const { Studio_id } = req.params;
  const { name, email, contact_no, description, rating } = req.body;
  try {
    const studio = await Studios.findByPk(Studio_id);

    if (!studio) {
      return next(new ErrorHandler("studio not found"));
    }
   await Studios.update(
      {
        email: email,
        name: name,
        contact_no: contact_no,
        description: description,
        rating: rating,
        studio_img: req.file.filename,
      },
      {
        where: {
          Studio_id: Studio_id,
        },
      }
    );
    const updatedSession = await Studios.findByPk(Studio_id);

    const successResponse = new SuccessHandler(
      updatedSession.toJSON(),
      "Service updated successfully."
    );
    return successResponse.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};
exports.createService = async (req, res, next) => {
  try {
    const {
      name,
      Studio_id,
      description,
      seo_title,
      seo_description,
      seo_slug,
      seo_tags,
    } = req.body;
    const existingService = await services.findOne({
      where: {
        name: name,
      },
    });

    if (existingService) {
      return next(new ErrorHandler("Service already exists."));
    }

    const status = 1;

    const newService = await services.create({
      name: name.toLowerCase(),
      Studio_id: Studio_id,
      description: description,
      status: status,
      seo_title: seo_title,
      seo_description: seo_description,
      seo_slug: seo_slug,
      seo_tags: seo_tags,
      services_img: req.file.filename,
    });

    const successHandler = new SuccessHandler(
      {
        service: {
          ...newService.toJSON(),
          status: status,
        },
      },
      "Service created successfully."
    );

    return successHandler.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message, false, 200));
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const service = await services.findAll();
    const formattedServices = service.map((service) => {
      return {
        service_id: service.service_id,
        name: service.name,
        description: service.description,
        status: service.status,
        seo_title: service.seo_title,
        seo_description: service.seo_description,
        seo_slug: service.seo_slug,
        seo_tags: JSON.parse(service.seo_tags),
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      };
    });

    const successResponse = new SuccessHandler(
      { services: formattedServices },
      "Services found successfully"
    );
    return successResponse.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

exports.getServicesById = async (req, res, next) => {
  try {
    const { service_id } = req.params;

    const service = await services.findByPk(service_id);
    console.log(service);
    if (!service) {
      return next(new ErrorHandler("service not found."));
    }

    const formattedService = {
      service_id: service.service_id,
      name: service.name,
      description: service.description,
      status: service.status,
      seo_title: service.seo_title,
      seo_description: service.seo_description,
      seo_slug: service.seo_slug,
      seo_tags: JSON.parse(service.seo_tags),
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    const successResponse = new SuccessHandler(
      { service: formattedService },
      "service found successfully."
    );
    return successResponse.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler("service not found."));
  }
};

exports.deactiveService = async (req, res, next) => {
  try {
    const { service_id } = req.params;
    const service = await services.findByPk(service_id);
    if (!service) {
      return next(new ErrorHandler("Service not found."));
    }
    await service.update({ status: 0 },{
      where: { service_id: service_id }
    });
    const successResponse = new SuccessHandler(
      {},
      "Service soft deleted successfully."
    );
    return successResponse.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

exports.activeService = async (req, res, next) => {
  try {
    const { service_id } = req.params;
    const service = await services.findByPk(service_id);
    if (!service) {
      return next(new ErrorHandler("Service not found."));
    }
    await service.update({ status: 1 });
    const successResponse = new SuccessHandler(
      {},
      "Service active  successfully."
    );
    return successResponse.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const { service_id } = req.params;
    const {
      name,
      description,
      seo_title,
      seo_description,
      seo_slug,
      seo_tags,
    } = req.body;
    const service = await services.findByPk(service_id);
    if (!service) {
      return next(new ErrorHandler("Service not found."));
    }
    const newServices = await services.update(
      {
        name: name.toLowerCase(),
        description: description,
        seo_title: seo_title,
        seo_description: seo_description,
        seo_slug: seo_slug,
        seo_tags: seo_tags,
      },
      { where: { service_id: service_id } }
    );

    const updatedService = await services.findByPk(service_id);
    updatedService.seo_tags = JSON.parse(updatedService.seo_tags);
    const successHandler = new SuccessHandler(
      {
        service: {
          ...updatedService.toJSON(),
          status: service.status,
        },
      },
      "Service updated successfully."
    );
    return successHandler.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

exports.createSession = async (req, res, next) => {
  try {
    const {
      service_id,
      session_description,
      instructor_name,
      session_duration,
      date,
      start_time,
      end_time,
      session_pricing,
      session_type,
      slug,
      title,
      seo_title,
    } = req.body;

    const status = 1;
    const parsedStartTime = moment(`${date} ${start_time}`, "DD/MM/YY hh:mm A");
    const parsedEndTime = moment(`${date} ${end_time}`, "DD/MM/YY hh:mm A");

    // Check if the exact start or end time session already exists
    // const exactStartSession = await Sessions.findOne({
    //   where: {
    //     service_id: service_id,
    //     date: date,
    //     start_time: parsedStartTime.format('HH:mm'),
    //   },
    // });

    // const exactEndSession = await Sessions.findOne({
    //   where: {
    //     service_id: service_id,
    //     date: date,
    //     end_time: parsedEndTime.format('HH:mm'),
    //   },
    // });

    // if (exactStartSession || exactEndSession) {
    //   return next(
    //     new ErrorHandler('Session with the exact start or end time already exists for this service.', false)
    //   );
    // }

    // // Check for overlapping time with existing sessions
    // const overlappingSessions = await Sessions.findAll({
    //   where: {
    //     service_id: service_id,
    //     date: date,
    //     [Op.or]: [
    //       {
    //         start_time: {
    //           [Op.between]: [parsedStartTime.format('HH:mm'), parsedEndTime.format('HH:mm')],
    //         },
    //       },
    //       {
    //         end_time: {
    //           [Op.between]: [parsedStartTime.format('HH:mm'), parsedEndTime.format('HH:mm')],
    //         },
    //       },
    //     ],
    //   },
    // });

    // if (overlappingSessions.length > 0) {
    //   return next(
    //     new ErrorHandler('Session with overlapping time already exists for this service.', false)
    //   );
    // }

    // Check if any slot overlaps with the specified time period
    const existingSlot = await Sessions.findOne({
      where: {
        date: date,
        [Sequelize.Op.or]: [
          {
            start_time: { [Sequelize.Op.between]: [start_time, end_time] },
          },
          {
            end_time: { [Sequelize.Op.between]: [start_time, end_time] },
          },
        ],
      },
    });

    console.log({ existingSlot });

    if (existingSlot) {
      return next(
        new ErrorHandler(
          "Session with overlapping time already exists for this service."
        )
      );
    }

    const newSession = await Sessions.create({
      service_id: service_id,
      session_description: session_description,
      instructor_name: instructor_name,
      session_duration: session_duration,
      date: date,
      // start_time: parsedStartTime.format("HH:mm"),
      // end_time: parsedEndTime.format("HH:mm"),
      start_time: start_time,
      end_time: end_time,
      title:title,
      session_pricing: session_pricing,
      session_type: session_type,
      session_img:req.file.filename,
      slug: slug,
      seo_title: seo_title,
      status: status,
    });

    const successHandler = new SuccessHandler(
      {
        session: {
          ...newSession.toJSON(),
          status: status,
        },
      },
      "Session created successfully."
    );

    return successHandler.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

exports.updateSession = async (req, res, next) => {
  try {
    const session_id = req.query.session_id;
    const {
      session_description,
      instructor_name,
      session_duration,
      date,
      session_pricing,
      session_type,
      slug,
      seo_title,
    session_img,
      start_time,
      end_time,
    } = req.body;

    const session = await Sessions.findByPk(session_id);
    if (!session) {
      return next(new ErrorHandler("Session not found."));
    }
 await Sessions.update(
      {
        session_description: session_description,
        instructor_name: instructor_name,
        session_duration: session_duration,
        date: date,
        start_time: start_time,
        end_time: end_time,
        session_pricing: session_pricing,
        session_type: session_type,
        session_img:req.file.filename,
        slug: slug,
        seo_title: seo_title,
      
      },
      { where: { session_id: session_id } }
    );
   
    const updatedSession = await Sessions.findByPk(session_id);

    const successResponse = new SuccessHandler(
      {
        ...updatedSession.toJSON(),
      },
      "Session updated successfully"
    );

    return successResponse.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message, false, 200));
  }
};

exports.deactiveSession = async (req, res, next) => {
  try {
    const session_id = req.query.session_id;
    const blockSession = await Sessions.update(
      {
        status: 0,
      },
      { where: { session_id: session_id } }
    );
    const blockSessions = await Sessions.findByPk(session_id);

    const successHandler = new SuccessHandler(
      {
        blockSessions: {
          ...blockSessions.toJSON(),
        },
      },
      "Session blocked successfully."
    );

    return successHandler.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message, false, 200));
  }
};

exports.activeSession = async (req, res, next) => {
  try {
    const session_id = req.query.session_id;
    const blockSession = await Sessions.update(
      {
        status: 1,
      },
      { where: { session_id: session_id } }
    );
    const blockSessions = await Sessions.findByPk(session_id);

    const successHandler = new SuccessHandler(
      {
        blockSessions: {
          ...blockSessions.toJSON(),
        },
      },
      "Session unblocked successfully."
    );

    return successHandler.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message, false, 200));
  }
};

exports.getSessionById = async (req, res, next) => {
  try {
    const { session_id } = req.params;

    const session = await Sessions.findByPk(session_id);

    if (!session) {
      return next(new ErrorHandler("Session not found."));
    }

    const successResponse = new SuccessHandler(
      { session: session },
      "Session found successfully."
    );
    return successResponse.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler("Session not found."));
  }
};

exports.getSessions = async (req, res, next) => {
  try {
    const session = await Sessions.findAll();

    const successResponse = new SuccessHandler(
      { session: session },
      "Session found successfully"
    );
    return successResponse.send(res, 200);
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};
exports.update = async (req, res) => {
  try {
    let { email } = req.body;

    if (email) {
      const existingAdmin = await Admin.findOne({ email: email });

      if (existingAdmin._id != req.params.id)
        return res
          .status(400)
          .json({ message: "An account with this email already exists." });
    }

    let updates = {
      role: req.body.role,
      email: req.body.email,
    };

    // Find document by id and updates with the required fields
    const result = await Admin.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    }
    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
      },
      message: "we update this document by this id: " + req.params.id,
    });
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    let { password } = req.body;

    if (!password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    if (password.length < 8)
      return res.status(400).json({
        msg: "The password needs to be at least 8 characters long.",
      });

    // if (password !== passwordCheck)
    //   return res
    //     .status(400)
    //     .json({ msg: "Enter the same password twice for verification." });
    var newAdmin = new Admin();
    const passwordHash = newAdmin.generateHash(password);
    let updates = {
      password: passwordHash,
    };

    // Find document by id and updates with the required fields
    const result = await Admin.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    }
    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
      },
      message: "we update the password by this id: " + req.params.id,
    });
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    let updates = {
      removed: true,
    };
    // Find the document by id and delete it
    const result = await Admin.findOneAndDelete({ _id: req.params.id }).exec();
    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: "Successfully Deleted the document by id: " + req.params.id,
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

exports.search = async (req, res) => {
  // console.log(req.query.fields)

  // console.log(fields)
  try {
    if (
      req.query.q === undefined ||
      req.query.q === "" ||
      req.query.q === " "
    ) {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: "No document found by this request",
        })
        .end();
    }

    const fieldsArray = req.query.fields.split(",");

    const fields = { $or: [] };

    for (const field of fieldsArray) {
      fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, "i") } });
    }
    let result = await Admin.find(fields)
      .where("removed", false)
      .sort({ name: "asc" })
      .limit(10);

    if (result.length >= 1) {
      return res.status(200).json({
        success: true,
        result,
        message: "Successfully found all documents",
      });
    } else {
      return res.status(202).json({
        success: false,
        result: [],
        message: "No document found by this request",
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: [],
      message: "Oops there is an Error",
    });
  }
};



// exports.getbooking=async(req,res,next)=>{
//   const { user_id } = req.params;
//   try {
//     // Retrieve user bookings and include associated user information
//     const userBookings = await Booking.findAll({
//       where: {
//         user_id: userId,
//       },
//       include: [
//         {
//           model: User,
//           attributes: ['id', 'name'], // Include the user ID and name if needed
//         },
//       ],
//     });

//     // Calculate total payment for user's bookings
//     const totalPayment = userBookings.reduce((total, booking) => {
//       return total + booking.payment_amount; // Replace 'payment_amount' with the actual attribute name for payment in your Booking model
//     }, 0);

//     res.json({
//       userBookings,
//       totalPayment,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

exports.getbooking = async (req, res, next) => {
  try {
    const booking = await bookings.findAll({
    });
console.log(booking)
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};