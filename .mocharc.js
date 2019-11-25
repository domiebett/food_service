'use strict';

// turn off logging
const winston = require('winston');
const logger = require('@bit/domiebett.budget_app.logging').logger;
logger.remove(winston.transports.Console);

// set env variables needed.
process.env.APP_SECRET = 'EVNezN7pu1cS2iTSMJKsRtylBdN7izfH';
process.env.NODE_ENV = 'test';

// --------------------------------------------------------------- //
// WARNING: Do not change any of the above settings unless you know
// what you are doing.
// --------------------------------------------------------------- //

// mocha config.
module.exports = {

};
