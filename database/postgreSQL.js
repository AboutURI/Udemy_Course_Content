const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('api', 'me', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});



const Course = sequelize.define('Course', {
  courseId: {
    type: DataTypes.INTEGER
  },
  totalSections: {
    type: DataTypes.INTEGER
  },
  totalLectures: {
    type: DataTypes.INTEGER
  },
  totalExercises: {
    type: DataTypes.INTEGER
  },
  totalArticles: {
    type: DataTypes.INTEGER
  },
  totalQuizzes: {
    type: DataTypes.INTEGER
  },
  courseLength: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
  //removed sections and added CourseId to Section table
});

const Section = sequelize.define('Section', {
  courseId: {
    type: DataTypes.INTEGER
  }, //added by jake
  sectionId: {
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING
  },
  sectionLength: {
    type: DataTypes.DATE
  },
  lectures: {
    type: DataTypes.INTEGER
  },
  exercises: {
    type: DataTypes.INTEGER
  },
  quizzes: {
    type: DataTypes.INTEGER
  },
  articles: {
    type: DataTypes.INTEGER
  },
  courseSequence: {
    type: DataTypes.INTEGER
  }
  //removed elements and added sectionId to Element Table
});

const Element = sequelize.define('Element', {
  sectionId: {
    type: DataTypes.INTEGER
  }, //added by jake
  elementId: {
    type: DataTypes.INTEGER
  },
  kind: {
    type: DataTypes.STRING
  },
  title: {
    type: DataTypes.STRING
  },
  sectionSequence: {
    type: DataTypes.INTEGER
  },
  videoUrl: {
    type: DataTypes.STRING
  },
  videoPreview: {
    type: DataTypes.BOOLEAN
  },
  summary: {
    type: DataTypes.STRING(1234)
  },
  elementLength: {
    type: DataTypes.DATE
  },
  numQuestions: {
    type: DataTypes.INTEGER
  },
});


module.exports.createCourse = async (classInfo) => {
  // console.log('class info in create funciton', classInfo);
  let newCourse = await Course.create(classInfo);
};

module.exports.createSection = async (section) => {
  // console.log('section info inside create function', section);
  let newSection = await Section.create(section);
};

module.exports.createElement = async (element) => {
  //console.log('element info inside create function', element);
  let newElement = await Element.create(element);
};

// sequelize.authenticate().then(()=> {
//   console.log('connected to pg');
// }).catch((error) => {
//   console.error('unable to connect to pg');
// });

// sequelize.sync({ force: true });
// console.log('All models were synchronized successfully.');

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