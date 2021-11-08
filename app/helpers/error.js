exports.AppError = class AppError extends Error {
  constructor(status, message, code) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.status = status;
    this.message = message;
    this.name = 'AppError';

    if (code) {
      this.code = code;
    }
  }
};

exports.abort = (status, message, code = 1005) => {
  throw new this.AppError(status, message, code);
};

exports.handleError = (fuc) => async (req, res, next) => {
  try {
    await fuc(req, res, next);
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }

    res.status(err.status).send({
      message: err.message,
      code: err.code,
    });
  }
};
