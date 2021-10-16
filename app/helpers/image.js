const s3 = require('./s3');

exports.getPresignedImageUrl = (key, expires = 30000) => {
  try {
    const url = s3
      .getSignedUrl('getObject', {
        Bucket: 'images',
        Key: key,
        Expires: expires,
      });

    return url;
  } catch (e) {
    return null;
  }
};
