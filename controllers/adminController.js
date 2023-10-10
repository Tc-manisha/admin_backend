const db = require("../db/databse")
const Admin = require("../models/Admin");
const Admins = db.Admin
const service = require("../models/services");
const services = db.services
const session = require("../models/services");
const Sessions = db.session

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

// exports.create = async (req, res) => {
//   try {
//     let { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({
//         success: false,
//         result: null,
//         message: "Email or password fields they don't have been entered.",
//       });

//     const existingAdmin = await Admin.findOne({ email: email });

//     if (existingAdmin)
//       return res.status(400).json({
//         success: false,
//         result: null,
//         message: "An account with this email already exists.",
//       });

//     if (password.length < 8)
//       return res.status(400).json({
//         success: false,
//         result: null,
//         message: "The password needs to be at least 8 characters long.",
//       });

//     var newAdmin = new Admin();
//     const passwordHash = newAdmin.generateHash(password);
//     req.body.password = passwordHash;

//     const result = await new Admin(req.body).save();
//     if (!result) {
//       return res.status(403).json({
//         success: false,
//         result: null,
//         message: "document couldn't save correctly",
//       });
//     }
//     return res.status(200).send({
//       success: true,
//       result: {
//         _id: result._id,
//         enabled: result.enabled,
//         email: result.email,
//         name: result.name,
//         surname: result.surname,
//       },
//       message: "Admin document save correctly",
//     });
//   } catch {
//     return res.status(500).json({ success: false, message: "there is error" });
//   }
// };


exports.createService = async (req, res, next) => {
  try {
    const { name, description, seo_title, seo_description, seo_slug, seo_tags } = req.body;

    const existingService = await services.findOne({
      where: {
        name: name.toLowerCase(),
      },
    });

    if (existingService) {
      return res.status(400).json({ success: false, message: 'Service already exists.' });
    }

    const status = 1;

    const newService = await services.create({
      name: name.toLowerCase(),
      description: description,
      status: status,
      seo_title: seo_title,
      seo_description: seo_description,
      seo_slug: seo_slug,
      seo_tags: seo_tags,
    });

    return res.status(200).json({
      success: true,
      service: { ...newService.toJSON(), status: status },
      message: 'Service created successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Oops! Error in Server' });
  }
};


exports.getServices = async (req, res, next) => {
  try {
    const service = await services.findAll();

    const formattedServices = service.map(service => {
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

    return res.status(200).json({
      success: true,
      services: formattedServices,
      message: 'Services found successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Oops! Error in Server' });
  }
};
/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */




exports.deleteService = async (req, res, next) => {
  try {
    const { service_id } = req.params;
    const service = await services.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    await service.update({ status: 0 });

    return res.status(200).json({ success: true, message: 'Service soft deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Oops! Error in Server' });
  }
};



exports.updateService = async (req, res, next) => {
  try {
    const { service_id } = req.params;
    const { name, description, seo_title, seo_description, seo_slug, seo_tags } = req.body;

    const service = await services.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    const newService = await services.update({
      name: name.toLowerCase(),
      description: description,
      seo_title: seo_title,
      seo_description: seo_description,
      seo_slug: seo_slug,
      seo_tags: seo_tags
  },{where:{service_id:service_id}});
  return res.status(200).json({ success: true, message: 'Service updated successfully.',service: newService});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Oops! Error in Server' });
  }
};

exports.createSession = async (req, res, next) => {
  try {
      const { service_id, session_description, instructor_name, session_duration, date, session_pricing, session_type, slug, seo_title, start_time, end_time } = req.body;
      const status = 1;

      const existingSession = await Sessions.findOne({
        where: {
          service_id: service_id,
          date:date,
          start_time: start_time,
          end_time: end_time,
        }
      });
  
      if (existingSession) {
        return res.status(400).json({ success: false, message: 'Session with the same time and date already exists for this service.' });
      }
      const newSession = await Sessions.create({
          service_id: service_id,
          session_description: session_description,
          instructor_name: instructor_name,
          session_duration: session_duration,
          date: date,
          start_time: start_time,
          end_time: end_time,
          session_pricing: session_pricing,
          session_type: session_type,
          slug: slug,
          seo_title: seo_title,
          status: status
      });

      return res.status(200).json({
          success: true,
          session: { ...newSession.toJSON(), status: status },
          message: 'Session created successfully.'
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Oops! Error in Server' });
  }
};


exports.updateSession = async (req, res, next) => {
  try {
      const session_id = req.query.session_id;
      const {
          session_description, instructor_name, session_duration, date,
          session_pricing, session_type, slug, seo_title, status, start_time, end_time
      } = req.body;

      const [rowsUpdated, updatedSessions] = await sessions.update(
          {
              session_description: session_description,
              instructor_name: instructor_name,
              session_duration: session_duration,
              date: date,
              start_time: start_time,
              end_time: end_time,
              session_pricing: session_pricing,
              session_type: session_type,
              slug: slug,
              seo_title: seo_title,
              status: status
          },
          { where: { session_id: session_id }, returning: true }
      );

      if (rowsUpdated === 0) {
          return res.status(404).json({ status: false, message: 'Session not found.' });
      }

      return res.status(200).json({ status: true, message: 'Session updated successfully!', Data: updatedSessions[0] });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Oops! Error in Server' });
  }
};

exports.blockSession = async (req, res, next) => {
  try {
      const session_id = req.query.session_id;
      const [rowsUpdated, blockedSessions] = await Sessions.update(
          { status: 2 },
          { where: { session_id: session_id }, returning: true }
      );

      if (rowsUpdated === 0) {
          return res.status(404).json({ status: false, message: 'Session not found.' });
      }

      return res.status(200).json({ status: true, message: 'This Session has been blocked successfully!', Data: [] });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Oops! Error in Server' });
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
