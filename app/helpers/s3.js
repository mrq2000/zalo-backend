const aws = require('aws-sdk');

const configS3 = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: process.env.AWS_DEFAULT_REGION,
};

const s3 = new aws.S3(
  process.env.APP_ENV === 'local' ? { ...configS3, endpoint: process.env.AWS_S3_END_POINT } : configS3,
);

module.exports = s3;
