// const mongoose = require('mongoose');
// let dbUrl;
// let dbName;

// if (process.env.DBURL) {
//   dbUrl = process.env.DBURL;
// } else {
//   dbUrl = require('../config').dbUrl;
// }

// if (process.env.DBURL) {
//   dbName = process.env.DBNAME;
// } else {
//   dbName = require('../config').dbName;
// }

// mongoose.connect(dbUrl, {
//   dbName: dbName,
//   useUnifiedTopology: true,
//   useNewUrlParser: true
// });

// const elementSchema = mongoose.Schema({
//   elementId: Number,
//   kind: String,
//   title: String,
//   sectionSequence: Number,
//   videoUrl: String,
//   videoPreview: Boolean,
//   summary: String,
//   elementLength: Date,
//   numQuestions: Number
// }, { versionKey: false });

// const sectionSchema = mongoose.Schema({
//   sectionId: Number,
//   title: String,
//   sectionLength: Date,
//   lectures: Number,
//   exercises: Number,
//   quizzes: Number,
//   articles: Number,
//   courseSequence: Number,
//   elements: [elementSchema]
// }, { versionKey: false });

// const courseSchema = mongoose.Schema({
//   courseId: Number,
//   totalSections: Number,
//   totalLectures: Number,
//   totalExercises: Number,
//   totalArticles: Number,
//   totalQuizzes: Number,
//   courseLength: Date,
//   updatedAt: Date,
//   sections: [sectionSchema]
// }, { versionKey: false });

// const Course = mongoose.model('Course', courseSchema);

// module.exports.findCourse = async id => {

//   return await Course.find({courseId: id}, {_id: 0}).exec();

// };

// module.exports.findSection = async id => {

//   return await Course.aggregate()
//     .unwind('sections')
//     .match({ 'sections.sectionId': id })
//     // .project({ 'sections._id': -1 })
//     .exec();

// };

// module.exports.findElement = async id => {

//   return await Course.aggregate()
//     .match({'sections.elements.elementId': id})
//     .unwind('sections')
//     .unwind('sections.elements')
//     .match({ 'sections.elements.elementId': id })
//     .exec();

// };

// //--------------CRUD---------------------

// //Create
// let createCourse = (data) => {
//   let newCourse = new Course(data);
//   newCourse.save(function(err, success) {
//     if (err) {
//       consoloe.log('error CREATEing record');
//     }
//   });
// };

// //Read
// let readCourse = (id) => {
//   return Course.find({ courseId: id });
// };

// //Update
// let updateCourse = (id, data, callback) => {

//   Course.findOneAndUpdate({courseId: id}, data, {new: true}, (err, result)=>{
//     if (err) {
//       console.log('Error Updating Course');
//     } else {
//       callback(result);
//     }
//   });

// };

// //Delete
// let deleteCourse = (id, callback) => {

//   Course.deleteOne({courseId: id}, (err, result) => {
//     if (err) {
//       console.log('error Deleting record');
//     } else {
//       callback(result);
//     }
//   });
// };
// module.exports.Course = Course;
// module.exports.deleteCourse = deleteCourse;
// module.exports.updateCourse = updateCourse;
// module.exports.readCourse = readCourse;
// module.exports.createCourse = createCourse;