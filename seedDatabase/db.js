const mongoose = require('mongoose');
const generate = require('./generate.js');
const db = require('../database/index.js');
let dbUrl = require('../config.js').dbUrl;
let dbName = require('../config.js').dbName;

mongoose.connect(dbUrl, {
  dbName: dbName,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const Course = db.Course;

const updateOne = (course) => {
  return Course.updateOne({ courseId: course.courseId }, course, { upsert: true }).exec();
};

module.exports.seedDB = async () => {
  let courses = generate.generateAllCourses(100);

  var promises = [];

  for (let i = 0; i < courses.length; i++) {
    let promise = updateOne(courses[i]);
    promises.push(promise);
  }

  await Promise.all(promises);
  return 'added to mongoDb';
};