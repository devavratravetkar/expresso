/* API router file, mounted on /api paths */
const express = require('express'); //import express
const apiRouter = express.Router(); //initialize express router
module.exports = apiRouter; //export the apiRouter to make available for importing from Server

/* Express router for /api/employees paths */
const employeesRouter = require('./employees'); //import employees.js file from api folder
apiRouter.use('/employees', employeesRouter); //mount the router at /api/employees path

/* Express router for /api/menus paths */
const menusRouter = require('./menus'); //import menus.js file from api folder
apiRouter.use('/menus', menusRouter); //mount the router at /api/menus path
