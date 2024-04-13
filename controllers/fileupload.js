const multer = require("multer");
const File = require("../models/Candidate");
const path = require("path");
const fs = require("fs");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
  }),
}).single("file")



const fileUpload = async (req, res) => {
  try {
    const result = await File.create({ image: req.file.filename });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getImg = async (req, res) => {
  try {
    const files = await File.find({});
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = { fileUpload, upload,getImg };
