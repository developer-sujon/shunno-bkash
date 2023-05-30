//external import
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const randomstring = require('randomstring');
const { getVideoDurationInSeconds } = require('get-video-duration');
const getDimensions = require('get-video-dimensions');
var ffmpeg = require('fluent-ffmpeg');

//internal import
const ApiError = require('../../utils/ApiError');
const { getFullYear, getMonth, getDate } = require('../../utils/formetDate');

//Storage
// File upload folder
const UPLOADS_FOLDER = path.join(__dirname, '../../public');

// define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let directory = `${UPLOADS_FOLDER}\\${getFullYear()}`;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    directory += `\\${getMonth()}`;

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    directory += `\\${getDate()}`;

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    if (file.mimetype.startsWith('image')) {
      directory += '\\images';
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    } else if (file.mimetype.startsWith('text') || file.mimetype.startsWith('application')) {
      directory += '\\documents';
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    } else if (file.mimetype.startsWith('audio')) {
      directory += '\\files\\audios';
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    } else if (file.mimetype.startsWith('video')) {
      directory += '\\files\\videos';
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
    cb(null, fileName + fileExt);
  },
});

//image File Filter
const multerFilter = async (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
    }
  } else if (file.mimetype.startsWith('application')) {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.ms-powerpoint' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf .docx .xls .ppt format allowed!'));
    }
  } else if (file.mimetype.startsWith('audio')) {
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/webm') {
      cb(null, true);
    } else {
      cb(new Error('Only .mp3 .weba format allowed!'));
    }
  } else if (file.mimetype.startsWith('video')) {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/webm') {
      cb(null, true);
    } else {
      cb(new Error('Only .mp4 .webm format allowed!'));
    }
  } else {
    cb({ message: 'Unsupported File Type' }, false);
  }
};

//files Upload
const filesUpload = multer({
  storage: storage,
  limits: {
    fileSize: 100000000,
  },
  fileFilter: multerFilter,
});

const resizeFiles = async (req, res, next) => {
  const { file } = req;

  try {
    let thumbObject = {},
      preThumb,
      thumbReader,
      thumbnailSize = 0,
      duration,
      dimensions,
      width,
      height;

    if (file.mimetype.startsWith('image')) {
    } else if (file.mimetype.startsWith('video')) {
      duration = await getVideoDurationInSeconds(file.path);
    } else {
    }

    return next();
  } catch (error) {
    next(error);
  }

  // console.log(UPLOADS_FOLDER + '\\' + req.file.originalname);

  //return;
};

module.exports = {
  filesUpload,
  resizeFiles,
};
