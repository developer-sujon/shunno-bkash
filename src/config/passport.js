const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User, Key } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type === tokenTypes.ACCESS) {
      const user = await User.findById(payload.sub).select('-password');

      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    }

    if (payload.type === tokenTypes.API_KEY) {
      const key = await Key.findOne({ keyID: payload.sub });

      if (!key) {
        return done(null, false);
      }

      const user = {
        keyID: key.keyID,
        role: 'API_USER',
      };

      return done(null, user);
    } else {
      throw new Error('Invalid token type or api key');
    }
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
