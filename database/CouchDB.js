const couchbase = require('couchbase');
const fs = require('fs');
const { exec } = require("child_process");


const cluster = new couchbase.Cluster('couchbase://localhost/8091', {
  username: 'Administrator', password: 'password'
});
const bucket = cluster.bucket('Courses');
const cb = bucket.defaultCollection();

const faker = require('faker');
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

let sectionIdCounter = 1;
let elementIdCounter = 1;
let courseIdCounter = 1;

const generateElement = (i, j, k) => {

  let options = ['lecture', 'lecture', 'lecture', 'lecture', 'quiz', 'quiz', 'exercise', 'quiz', 'exercise', 'exercise', 'exercise', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'lecture', 'article', 'article', 'article'];

  let element = {
    elementId: elementIdCounter,
    kind: options[Math.floor(Math.random() * options.length)],
    title: faker.git.commitMessage(),
    sectionSequence: k + 1
  };

  elementIdCounter++;

  if (element.kind === 'lecture') {

    element['videoUrl'] = 'https://udemycoursecontenthr.s3.amazonaws.com/a-computer-monitor-flashing-digital-information-2887463.mp4';
    element['videoPreview'] = (Math.random() * 100 > 20 ? false : true);
    element['summary'] = lorem.generateSentences(Math.floor(Math.random() * 2));
    element['elementLength'] = new Date(Math.floor(Math.random() * 120000));

  } else if (element.kind === 'article') {
    element['summary'] = lorem.generateSentences(Math.floor(Math.random() * 2));
    element['elementLength'] = new Date(Math.floor(Math.random() * 120000));

  } else if (element.kind === 'exercise') {
    element['numQuestions'] = Math.floor(Math.random() * 3) + 1;

  } else if (element.kind === 'quiz') {
    element['numQuestions'] = Math.floor(Math.random() * 3) + 1;
  }

  return element;
};

const generateSection = (course, i, j) => {

  let section = {
    sectionId: sectionIdCounter,
    title: faker.random.words(Math.floor(Math.random() * 10) + 1),
    sectionLength: 0,
    lectures: 0,
    quizzes: 0,
    exercises: 0,
    articles: 0,
    courseSequence: j + 1,
    elements: []
  };

  sectionIdCounter++;

  for (let k = 0; k < Math.random() * 10; k++) {
    const newElement = generateElement(i, j, k);

    section.elements.push(newElement);

    if (newElement.elementLength) {
      section.sectionLength += newElement.elementLength.getTime();
    }
  }

  section.sectionLength = new Date(section.sectionLength);
  return section;
};

const generateCourse = (i) => {

  let course = {
    courseId: courseIdCounter,
    totalSections: (Math.floor(Math.random() * 10) + 5),
    totalLectures: 0,
    totalExercises: 0,
    totalArticles: 0,
    totalQuizzes: 0,
    courseLength: 0,
    updatedAt: new Date(),
    sections: []
  };

  courseIdCounter ++;
  for (let j = 0; j < course.totalSections; j++) {

    const newSection = generateSection(course, i, j);

    course.sections.push(newSection);

    course.courseLength += newSection.sectionLength.getTime();
  }

  course.courseLength = new Date(course.courseLength);

  return course;
};

const countElements = (allCourses) => {

  for (let i = 0; i < allCourses.length; i++) {

    let currentCourse = allCourses[i];

    for (let j = 0; j < currentCourse.sections.length; j++) {

      let currentSection = currentCourse.sections[j];

      for (let k = 0; k < currentSection.elements.length; k++) {

        let currentElement = currentSection.elements[k];

        if (currentElement.kind === 'lecture') {
          currentCourse.totalLectures++;
          currentSection.lectures++;
        } else if (currentElement.kind === 'quiz') {
          currentCourse.totalQuizzes++;
          currentSection.quizzes++;
        } else if (currentElement.kind === 'exercise') {
          currentCourse.totalExercises++;
          currentSection.exercises++;
        } else if (currentElement.kind === 'article') {
          currentCourse.totalArticles++;
          currentSection.articles++;
        }
      }
    }
  }

  return allCourses;
};

let generate1000Courses = async () => {

  let courses = [];

  for (let i = 0; i < 30; i++) {
    courses.push(generateCourse(i));
    console.log('course created', courseIdCounter)
  }

  courses = countElements(courses);

  //console.log(courses);
  return await courses;
};

//generate1000Courses();


let createObject = async (document) => {

  cb.insert(`${document.courseId}`, document, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
};

let seed = async (num) => {

  for (let s = 0; s <= num; s++) {
    let documents = await generate1000Courses();
    console.log('done generating, pushing to file', courseIdCounter);
    await fs.appendFileSync('./Result.json', JSON.stringify(documents, null, 2));
    await exec("cbimport json --format list -c http://127.0.0.1:8091 -u <login> -p <password> -d 'file://Result.json' -b 'Courses' -g #UUID# ", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

  }

};


seed(0);