const DatauriParser = require("datauri/parser");
const cloudinary = require("../config/cloudinary");
const path = require(path);

const uploader = async (req, res, next) => {
  const { body, file } = req;
  if (file) return next();

  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  const datauri = parser.format(ext, buffer);

  try {
    cloudinary.uploader.upload();
  } catch (err) {
    console.log(err.message);
    res.status(err).json({ msg: "Internal Server Error" });
  }
};

module.exports = uploader;
