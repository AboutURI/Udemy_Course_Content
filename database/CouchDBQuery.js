const axios = require('axios').default;
const nano = require('nano')('http://admin:password@127.0.0.1:5984');

// const options = {
//   method: 'POST',
//   url: 'http://admin:password@127.0.0.1:5984/courses/_find',
//   data: {
//     'selector' : {
//       courseId: 2372076
//     },
//     'execution_stats': true
//   }
// };

// const url = 'http://admin:password@127.0.0.1:5984/courses/_find';

// const params = {
//   'selector': {
//     courseId: 2372076
//   },
//   'execution_stats': true
// };

// axios(options).then((response)=>{
//   console.log(response);
// });


const courses = nano.db.use('courses');

// const getDoc = async () => {
//   const doc = await courses.get("003d579f350299888de57755ee000d11", { execution_stats: true }).then((results) => {
//     console.log(results);
//   });
//   console.log(doc);
// };

module.exports.findCourse = async id => {
  let result = [];
  let doc = await courses.get(id);
  result.push(doc);
  return result;
};

module.exports.findSection = async id => {

  return await Course.aggregate()
    .unwind('sections')
    .match({ 'sections.sectionId': id })
    // .project({ 'sections._id': -1 })
    .exec();

};

module.exports.findElement = async id => {

  return await Course.aggregate()
    .match({'sections.elements.elementId': id})
    .unwind('sections')
    .unwind('sections.elements')
    .match({ 'sections.elements.elementId': id })
    .exec();

};

