const faker = require('faker');
const pg = require('./postgreSQL.js');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

let sectionCount = 1;
let elementCount = 1;
let courseCount = 1;
let options = ['lecture', 'lecture', 'lecture', 'lecture', 'quiz', 'quiz', 'exercise', 'quiz', 'exercise', 'exercise', 'exercise', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'article', 'article', 'article'];


const generateCourse = async () => {
  const course = {
    courseId: courseCount,
    totalSections: faker.datatype.number(15),
    totalLectures: 0,
    totalExercises: 0,
    totalArticles: 0,
    totalQuizzes: 0,
    courseLength: 0,
    updatedAt: faker.date.past(),
  };
  return course;
};

const generateSection = (j) => {
  const section = {
    courseId: courseCount, //added by jake
    sectionId: sectionCount,
    title: faker.lorem.words(),
    sectionLength: 0,
    lectures: 0,
    exercises: 0,
    quizzes: 0,
    articles: 0,
    courseSequence: j,
    //removed elements and added sectionId to Element Table
  };
  return section;
};

const generateElement = (sectionId, k) => {
  const element = {
    sectionId: sectionId, //added by jake
    elementId: elementCount,
    kind: options[Math.floor(Math.random() * options.length)],
    title: faker.lorem.words(),
    sectionSequence: k,
  };

  if (element.kind === 'lecture') {

    element['videoUrl'] = 'https://udemycoursecontenthr.s3.amazonaws.com/a-computer-monitor-flashing-digital-information-2887463.mp4';
    element['videoPreview'] = (Math.random() * 100 > 20 ? false : true);
    element['summary'] = lorem.generateSentences(Math.floor(Math.random() * 2));
    element['elementLength'] = new Date(Math.floor(Math.random() * 120000));

  } else if (element.kind === 'article') {
    element['summary'] = faker.lorem.sentences();
    element['elementLength'] = new Date(Math.floor(Math.random() * 120000));

  } else if (element.kind === 'exercise') {
    element['numQuestions'] = Math.floor(Math.random() * 3) + 1;

  } else if (element.kind === 'quiz') {
    element['numQuestions'] = Math.floor(Math.random() * 3) + 1;
  }

  return element;
};

const generate1mCourses = async (numberOfCourses) => {
  for (let i = 1; i <= numberOfCourses + 1; i++) {
    let course = await generateCourse(i);
    course.courseLength = new Date(course.courseLength);
    for (let j = 1; j <= course.totalSections; j++) {
      let section = await generateSection(i, sectionCount, j);
      section.sectionLength = new Date(section.sectionLength);
      sectionCount ++;
      for (let k = 1; k <= faker.datatype.number(25); k++) {
        let element = await generateElement(section.sectionId, k);
        elementCount ++;
        if (element.kind === 'lecture') {
          section.lectures ++;
          course.totalLectures ++;
          section.sectionLength += element.elementLength.getTime();
        }
        if (element.kind === 'quiz') {
          section.quizzes ++;
          course.totalQuizzes ++;
        }
        if (element.kind === 'exercise') {
          section.exercises ++;
          course.totalExercises ++;
        }
        if (element.kind === 'article') {
          section.articles ++;
          course.totalArticles ++;
          section.sectionLength += element.elementLength.getTime();
          course.courseLength += element.elementLength.getTime();
        }
        await pg.createElement(element);
        // console.log('element saving', element.elementId);
      }
      await pg.createSection(section);
      // console.log('section saved', section.sectionId);
    }
    await pg.createCourse(course);
    console.log('course saved', course.courseId);
  }
};

const generate5000Courses = async () => {
  let courses = [];
  let sections = [];
  let elements = [];
  for (let i = 1; i <= 5000 + 1; i++) {
    let course = await generateCourse(i);
    courseCount ++;
    course.courseLength = new Date(course.courseLength);
    for (let j = 1; j <= course.totalSections; j++) {
      let section = await generateSection(i, sectionCount, j);
      section.sectionLength = new Date(section.sectionLength);
      sectionCount ++;
      for (let k = 1; k <= faker.datatype.number(10); k++) {
        let element = await generateElement(section.sectionId, k);
        elementCount ++;
        if (element.kind === 'lecture') {
          section.lectures ++;
          course.totalLectures ++;
          section.sectionLength += element.elementLength.getTime();
        }
        if (element.kind === 'quiz') {
          section.quizzes ++;
          course.totalQuizzes ++;
        }
        if (element.kind === 'exercise') {
          section.exercises ++;
          course.totalExercises ++;
        }
        if (element.kind === 'article') {
          section.articles ++;
          course.totalArticles ++;
          section.sectionLength += element.elementLength.getTime();
          course.courseLength += element.elementLength.getTime();
        }
        elements.push(element);
        // console.log('element saving', element.elementId);
      }
      sections.push(section);
      // console.log('section saved', section.sectionId);
    }
    courses.push(course);
    console.log('course created', course.courseId);
  }
  await pg.bulkCreateCourses(courses);
  await pg.bulkCreateSections(sections);
  await pg.bulkCreateElements(elements);
  console.log(courseCount, 'courses saved to db');
};

const seedDB = async () => {
  for (let s = 0; s <= 2000; s++) {
    await generate5000Courses();
  }
};

seedDB();