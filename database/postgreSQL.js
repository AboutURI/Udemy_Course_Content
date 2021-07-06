const Sequelize = require('sequelize');
const sequelize = new Sequelize('api', 'me', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

const Course = sequelize.define('course', {
  courseId: Number,
  totalSections: Number,
  totalLectures: Number,
  totalExercises: Number,
  totalArticles: Number,
  totalQuizzes: Number,
  courseLength: Date,
  updatedAt: Date,
  //removed sections and added CourseId to Section table
});

const Section = sequelize.define('section', {
  courseId: Number, //added by jake
  sectionId: Number,
  title: String,
  sectionLength: Date,
  lectures: Number,
  exercises: Number,
  quizzes: Number,
  articles: Number,
  courseSequence: Number,
  //removed elements and added sectionId to Element Table
});

const Eleement = sequelize.define('element', {
  sectionId: Number, //added by jake
  elementId: Number,
  kind: String,
  title: String,
  sectionSequence: Number,
  videoUrl: String,
  videoPreview: Boolean,
  summary: String,
  elementLength: Date,
  numQuestions: Number
});





//--------------OLD MONGOOSE SCHEMA--------------------

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