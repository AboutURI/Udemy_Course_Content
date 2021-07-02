# Project Name
Course Content for Udemy Clone (Front End Capstone project by Hack Reactor RPT27 team Charlotte Badger https://github.com/Charlotte-Badger)

## Table of Contents

1. [Requirements](#requirements)
1. [Development](#development)


## Requirements
- Node 14.15.0

## Development

### Installing dependencies
From within the Course-Content directory:
```sh
npm install
```
### Creating the bundle file
From within the Course-Content directory:
```sh
npm run react-dev
```

If pushing bundle file to S3 using the WebpackS3Plugin, you must store your credentials in a git-ignored config.js file at the root directory.

### Populating the database
From within the Course-Content directory:
```sh
npm run seed
```

In order to run script, add file "config.js" to root directory. It should contain an object with the following format:

```javascript
module.exports = {
   dbUrl: // Database Url,
   dbName: // Database Name,
   accessKeyID: // S3 Access Key,
   secretAccessKey: // S3 Secret Access Key,
   pexelKey: // Key for pexel API. If you want to use mine it's pinned on the #rpt27-fecCharlotte-Badger Slack Channel
};
```

You may want to change 'numberOfVideos' on line 7 of search.js to a smaller number. This is the number of unique videos that will be downloaded (at lowest possible quality), but may take up more room in your S3 bucket. (Note: All elements requiring a video will have a video as long as this number is greater than 1. This number just determines the variety of videos that the service will display).

If you would prefer to run this script using environment variables rather than the values set in '../config.js', refactor all declarations that use 'require('../config.js)...' to 'process.env...' and uncomment line 1 of seedDatabase/index.js.

When setup, run 'npm run seed'

### Starting the server in development mode
From within the Course-Content directory:
```sh
npm server-dev
```

### Starting the server in production mode
From within the Course-Content directory:
```sh
npm start
```

## Technologies Used
- Node & Express
- MongoDB
- React
- EC2

## Challenges

### Downloading Media Elements
This service required textual elements as well as videos. The text elements could be generated quickly using different “Lorem Ipsum” modules, but sourcing and downloading videos was the greatest challenge. Pexels was the service I wanted to use for stock footage, as they had a convenient API and NPM module. I anticipated the asynchronicity of Javascript to cause issues with text elements of my database being generated much faster than the videos could be downloaded, so I wrote all of my download functions as synchronous functions using Promises and async/await. This worked 90% of the time, but I found if I was on slow internet videos would not always download completely. To reconcile this, I used FFMPEG to verify the file integrity of each downloaded video. If the file was corrupted, I simply deleted it. If the content of the videos were more critical I would have written a function to re-download the corrupted video, but I had already planned for duplicate videos in my database, and the ratio of valid to corrupt files was high enough that I could leave out this functionality. All the videos were then uploaded to an S3 bucket, and their urls were recorded in an array. For any element of the service that required a video, one was selected from the array.

### Nested Database Schemas
In order to maximize efficiency for the user-facing portion of the service, MongoDB was chosen because it can retrieve elements in constant time, and there is no need for relation. The service contains nested elements, which are reflected in the database. This created a challenge when creating endpoints that search for data regarding these nested elements. In order to reduce logic on the server side, I used aggregate functions within the Mongoose ORM to unwind and match the correct element. This could have been easier achieved with a SQL-based database, and it would have improved efficiency for my colleagues, but it would have required several join tables that would increase the logic and reduce the efficiency of the user-facing part of the service.

### API

GET '/course/:courseId'

returns all data relating to that courseId


POST '/course/:courseId'
creates a new course

DELETE '/course/:courseId'

deletes the course 

PUT '/course/:courseId'

edits a course
returns the updated course



## Related Projects
- Reviews
https://github.com/Charlotte-Badger/Reviews
- Overview
https://github.com/Charlotte-Badger/Overview
- Sidebar
https://github.com/Charlotte-Badger/Sidebar
