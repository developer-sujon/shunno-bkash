//external lib import
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const path = require('path');

//internal lib import
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const initI18next = require('./locales/i18n');
const { filesUpload } = require('./middlewares/upload/multer');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: '2mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

//i18next Internationalized
initI18next(app);

//static folder
app.use('/storage', express.static(path.join(__dirname, 'uploads')));

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use(`/${config.apiPath}/auth`, authLimiter);
}

app.get('/', (_, res) => res.send('direct access not allow'));

// api routes
app.use(config.apiPath, routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, ' not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
