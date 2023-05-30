//external import
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const randomstring = require('randomstring');
const { getVideoDurationInSeconds } = require('get-video-duration');
const getDimensions = require('get-video-dimensions');
const ffmpeg = require('fluent-ffmpeg');
const sizeOf = require('image-size');
const { getAudioDurationInSeconds } = require('get-audio-duration');

//internal import
const ApiError = require('../../utils/ApiError');
const { getFullYear, getMonth, getDate } = require('../../utils/formetDate');
const httpStatus = require('http-status');

//Storage
// File upload folder
const UPLOADS_FOLDER = path.join(__dirname, '../../uploads');

// define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOADS_FOLDER)) {
      fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
    }

    let directory = `${UPLOADS_FOLDER}/${getFullYear()}`;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    directory += `/${getMonth()}`;

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    directory += `/${getDate()}`;

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    if (file.mimetype.startsWith('image')) {
      directory += '/images';
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    } else if (file.mimetype.startsWith('text') || file.mimetype.startsWith('application')) {
      directory += '/documents';
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    } else if (file.mimetype.startsWith('audio')) {
      directory += '/files/audios';
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
    } else if (file.mimetype.startsWith('video')) {
      directory += '/files/videos';
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
const multerFilter = async (_req, file, cb) => {
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
  } else if (file.mimetype.startsWith('text')) {
    cb(null, true);
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

const resizeFiles = async (req, _res, next) => {
  try {
    const { file, ownerID, keyID } = req;

    if (!file) throw new ApiError(httpStatus.BAD_REQUEST, 'file is required');

    const { description, auth, tags, region, clientApp } = req.body;
    const accrualPath =
      'storage' + file.destination.replace(path.join(__dirname, '../../uploads'), '') + '/' + file.filename;

    const storeFile = {
      name: file.filename,
      originalName: file.originalname,
      ...(description && { description }),
      extension: path.extname(file.originalname),
      path: accrualPath.replace(/\\/g, '/'),
      type: file.mimetype,
      size: file.size,
      ...(ownerID && { ownerID }),
      ...(keyID && { keyID }),
      ...(tags && { tags: tags.split(',') }),
      ...(auth && { auth }),
      ...(region && { region }),
      ...(clientApp && { clientApp }),
      auth: ownerID ? true : false,
    };   

    if (file.mimetype.startsWith('image')) {
      const dimensions = sizeOf(file.path);
      storeFile['width'] = dimensions.width;
      storeFile['height'] = dimensions.height;
    } else if (file.mimetype.startsWith('video')) {
      storeFile['duration'] = await getVideoDurationInSeconds(file.path);
    } else if (file.mimetype.startsWith('audio')) {
      // From a local path...
      storeFile['duration'] = await getAudioDurationInSeconds(file.path);
    }
    req.storeFile = storeFile;
    return next();
  } catch (error) {
    next(error);
  }
};

const emptyFile = () => {};

module.exports = {
  filesUpload,
  resizeFiles,
};
