const path = require('path');
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const readline = require('readline');
let videosArray = require('./videosArray.js');
let awsId = require('../config.js').accessKeyID;
let awsSecret = require('../config.js').secretAccessKey;

const BUCKET_NAME = 'udemycoursecontenthr';

const s3 = new AWS.S3({
  accessKeyId: awsId,
  secretAccessKey: awsSecret
});

const params = {
  Bucket: BUCKET_NAME,
  CreateBucketConfiguration: {
    LocationConstraint: 'eu-west-2'
  }
};

const emptyBucket = async () => {
  console.log(`Emptying Bucket ${BUCKET_NAME}`);

  const { Contents } = await s3.listObjects({ Bucket: BUCKET_NAME }).promise();
  if (Contents.length > 0) {
    await s3.deleteObjects({
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: Contents.map(({ Key }) => ({ Key }))
      }
    })
      .promise();
  }

  return true;
};

const uploadOneFile = async (file) => {
  console.log('Uploading:', file);
  const fileContent = fs.readFileSync(file);
  let fileName = file.split('/');
  fileName = fileName[fileName.length - 1];

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: 'video/mp4'
  };

  return await s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    return `Uploaded: ${data.key}`;
  }).promise();
};

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
};

module.exports.uploadDirectory = async (directory) => {

  const ans = await askQuestion('This script will empty and re-populate your current S3 bucket. Do you want to continue?(y/n): ');

  if (ans === 'y') {
    await emptyBucket();
    console.log('Beginning upload to S3');
    let files = fs.readdirSync(directory);
    for (let file of files) {
      const filePath = path.join(directory, file);
      await uploadOneFile(filePath)
        .then(async (result) => {
          console.log(`Uploaded ${result.key}`);
          ffmpeg.ffprobe(filePath, function (err, metadata) {
            if (err) {
              console.log(err);
            }
            let duration;
            if (metadata) {
              duration = Math.floor(metadata.format.duration * 1000);
            } else {
              duration = 0;
            }

            let obj = {
              url: result.Location,
              duration: duration
            };
            videosArray.push(obj);
          });
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
          console.log('Upload failed');
        });
    }
    return 'Upload to S3 Complete!';
  } else {
    process.exit();
  }
};