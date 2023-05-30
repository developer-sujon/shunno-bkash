//external lib import
const express = require('express');

//internal lib import
const authRoute = require('./auth.route');
const bkashRoute = require('./bkash.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/bkash',
    route: bkashRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
