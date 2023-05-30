//external import
const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, prettyPrint } = format;
const path = require('path');
const fs = require('fs');

//internal import
const { getFullYear, getMonth, getDate } = require('../utils/formetDate');
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const filePath = () => {
  const LOGS_FOLDER = path.join(__dirname, '../../src/logs/');

  let directory = `${LOGS_FOLDER}/${getFullYear()}`;

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

  return directory;
};

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    timestamp(),
    prettyPrint(),
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: `${filePath()}/combined.log`,
      level: 'info',
    }),
    new winston.transports.File({
      filename: `${filePath()}/error.log`,
      level: 'error',
    }),
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;
