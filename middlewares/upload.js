const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, String(new Date().getTime()) + '.' + file.mimetype.split('/')[1]);
  },
});

module.exports = multer({ storage });
