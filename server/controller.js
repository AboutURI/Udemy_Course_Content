const db = require('../database/index.js');
const helpers = require('./helpers.js');

module.exports.course = (req, res) => {

  db.findCourse(req.query.id - 1)
    .then((result) => {
      result = helpers.refactorCourseId(result);
      res.send(result);
    });

};