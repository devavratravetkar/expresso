/* Employees router file, mounted on /api/employees paths */
const express = require('express'); //import express
const employeesRouter = express.Router(); //initialize express router
module.exports = employeesRouter; //export the router to make available for importing from apiRouter

/* sqlite database object for holding app data and test data */
const sqlite3 = require('sqlite3'); //importing sqlite3 package
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite'); //accept from TEST_DATABASE or our default root-level database file

const timesheetsRouter = require('./timesheets');

employeesRouter.param('employeeId', (req, res, next, employeeId) => {
  const sql = 'SELECT * FROM Employee WHERE id = $id';
  const values = {
    $id: employeeId
  };
  db.get(sql, values, (error, row) => {
    if(error) {
      next(error);
    } else if(row) {
      req.employee = row;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

employeesRouter.use('/:employeeId/timesheets', timesheetsRouter);

employeesRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Employee WHERE is_current_employee = 1';
  db.all(sql, (error, rows) => {
    if(error) {
      next(error);
    } else {
      res.status(200).send({employees: rows});
    }
  });
});

employeesRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).send({employee: req.employee});
});

employeesRouter.post('/', (req, res, next) => {
  const name = req.body.employee.name,
        position = req.body.employee.position,
        wage = req.body.employee.wage;
        //isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

  if(!name || !position || !wage) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO Employee(name, position, wage) VALUES($name, $position, $wage)';
  const values = {
    $name: name,
    $position: position,
    $wage: wage
  };
  db.run(sql, values, function(error){
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`, (error, row) => {
        if(error){
          next(error);
        } else {
          res.status(201).send({employee: row});
        }
      });
    }
  });
});

employeesRouter.put('/:employeeId', (req, res, next) => {
  const employeeId = req.params.employeeId,
        name = req.body.employee.name,
        position = req.body.employee.position,
        wage = req.body.employee.wage,
        isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

  if(!name || !position || !wage) {
    return res.sendStatus(400);
  }

  const sql = 'UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE id = $employeeId';
  const values = {
    $name: name,
    $position: position,
    $wage: wage,
    $isCurrentEmployee : isCurrentEmployee,
    $employeeId: employeeId
  };

  db.run(sql, values, error => {
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Employee WHERE id = ${employeeId}`, (error, row) => {
        if(error) {
          next(error);
        } else {
          res.status(200).send({employee: row});
        }
      });
    }
  });
});

employeesRouter.delete('/:employeeId', (req, res, next) => {
  const employeeId = req.params.employeeId;
  const sql = 'UPDATE Employee SET is_current_employee = 0 WHERE id = $employeeId';
  const values = {
    $employeeId: employeeId
  };
  db.run(sql, values, error => {
    if(error){
      next(error);
    } else {
      db.get(`SELECT * FROM Employee WHERE id = ${employeeId}`, (error, row) => {
        res.status(200).send({employee: row});
      });
    }
  });
});
