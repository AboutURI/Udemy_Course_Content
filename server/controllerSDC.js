const db = require('../database/CouchDBQuery.js');
const helpers = require('./helpers.js');
const path = require('path');
const fs = require('fs');

module.exports.course = (req, res) => {

  db.findCourse(req.query.courseId)
    .then((result) => {
      console.log('result here' ,result);
      if (result.length === 0) {
        res.sendStatus(404);
      } else if (result.length > 1) {
        res.status(400);
        res.send('Multiple results found');
      } else {
        result = helpers.processCourses(result);
        res.send(result);
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(404);
        res.send(err);
      } else {
        res.sendStatus(404);
      }
    });

};

module.exports.section = (req, res) => {

  db.findSection(Number(req.query.sectionId))
    .then((result) => {
      if (result.length === 0) {
        res.sendStatus(404);
      } else if (result.length > 1) {
        res.status(400);
        res.send('Multiple results found');
      } else {
        result = helpers.processSection(result);
        res.send(result);
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(404);
        res.send(err);
      } else {
        res.sendStatus(404);
      }
    });

};

module.exports.element = (req, res) => {

  db.findElement(Number(req.query.elementId))
    .then((result) => {
      if (result.length === 0) {
        res.sendStatus(404);
      } else if (result.length > 1) {
        res.status(400);
        res.send('Multiple results found');
      } else {
        result = helpers.processElement(result);
        res.send(result);
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(404);
        res.send(err);
      } else {
        res.sendStatus(404);
      }
    });

};

module.exports.bundle = (req, res, next) => {

  fs.readdir(path.join(__dirname, '..', 'client', 'dist'), (err, dir) => {
    if (err) {
      console.log(err);
    }

    let filepath;

    for (let i = 0; i < dir.length; i++) {
      let filename = dir[i];
      let elements = filename.split('.');
      let ext = elements[elements.length - 1];
      if (ext === 'js') {
        filepath = path.join(__dirname, '..', 'client', 'dist', filename);
        break;
      }
    }

    if (filepath) {
      res.sendFile(filepath);
    } else {
      res.sendStatus(404);
    }

  });

};