// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}-${Math.round(
//         Math.random() * 1e9
//       )}${path.extname(file.originalname)}`
//     );
//   },
// });

// const uploads = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       return cb(new Error("Invalid file type"));
//     }
//   },
//   limits: { fileSize: 5e6 },
// });

// module.exports = uploads;

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const fileName = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});
const multerOption = {
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/jpeg"
    )
      return cb(new Error("Invalid data type"));
    cb(null, true);
  },
  limits: { fileSize: 0.4 * 1024 * 1024 },
};

const upload = multer(multerOption).single("image");
const multerHandler = (req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        msg: "File too large, image must be 2MB or lower",
      });
    } else if (error) {
      return res.status(415).json({ msg: error.message });
    }
    next();
  });
};

module.exports = multerHandler;
