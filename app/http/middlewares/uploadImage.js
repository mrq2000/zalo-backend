const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const multerS3 = require('multer-s3');

const s3 = require('../../helpers/s3');

async function checkImage(file, cb) {
  const fileTypes = /jpeg|jpg|png$/;
  const extname = fileTypes.test(file.mimetype);
  if (extname) {
    return cb(null, true);
  }
  return cb('Error: Please make sure your image type is 1 of jpeg, jpg, png');
}

const uploadImage = (maxSize = 1000000, bucket = process.env.AWS_S3_BUCKET) => multer({
  storage: multerS3({
    s3,
    bucket,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      const name = `${uuidv4()}_${file.originalname.toLowerCase()}`;
      req[file.fieldname] = name;
      cb(null, name);
    },
  }),
  limits: { fileSize: maxSize },
  fileFilter(req, file, cb) {
    checkImage(file, cb);
  },
});

module.exports = uploadImage;
