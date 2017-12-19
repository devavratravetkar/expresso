/* Server.js file - root-level file for our app's server */

/* Create and export your Express app */
const express = require('express'); //importing Express
const app = express(); //initializing an express app
module.exports = app; //exporting the app to make available for tests

/* Set port number for our server to listen on - accept from process.env.PORT and set default to 4000 */
const PORT = process.env.PORT || 4000;

/* sqlite database object for holding app data and test data */
const sqlite3 = require('sqlite3'); //importing sqlite3 package
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite'); //accept from TEST_DATABASE or our default root-level database file

/* Start listening on the correct PORT for HTTP requests */
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

/* Additional middleware packages for our app */
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const errorhandler = require('errorhandler');
app.use(errorhandler());

const morgan = require('morgan');
app.use(morgan('dev'));

const cors = require('cors');
app.use(cors());

/* Express router for our API - all paths beginning with /api go through this first */
const apiRouter = require('./api/api'); //import api.js file from api folder
app.use('/api', apiRouter); //mount the router at /api path
