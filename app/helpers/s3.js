const aws = require('aws-sdk');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_S3_END_POINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: process.env.AWS_DEFAULT_REGION,
});

module.exports = s3;
