const newrelic = require('newrelic');
const express = require('express');
var bodyParser = require('body-parser');
const compression = require('compression');
const app = express();
const path = require('path');
const controller = require('./controllerSDC.js');
const expressStaticGzip = require('express-static-gzip');
const cors = require('cors');
const db = require('../database/index.js');
const PORT = process.env.PORT || 9800;

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(compression({
  level: 9
}));

app.use(cors());

app.get('/bundle', controller.bundle);

app.get('/course/item', controller.course);

app.get('/section/item', controller.section);

app.get('/element/item', controller.element);

app.use('/', expressStaticGzip(path.join(__dirname, '..', 'client', 'dist')));

app.post('/course/:courseId', jsonParser, (req, res) => {
  db.createCourse(req.params.courseId, req.body, () => {
    res.send('course created');
  });
});

app.get('/course/:courseId', (req, res) => {
  db.readCourse(req.params.courseId)
    .then((results) => {
      res.send(results);
    });
});

app.put('/course/:courseId', jsonParser, (req, res) => {
  db.updateCourse(req.params.courseId, req.body, () => {
    res.send('updated course');
  });
});

app.delete('/course/:courseId', (req, res) => {
  db.deleteCourse(req.params.courseId, () => {
    res.send('deleted course');
  });
});

module.exports.app = app;

module.exports.PORT = PORT;