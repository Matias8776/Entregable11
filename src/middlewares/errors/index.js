import EErrors from '../../services/errors/enums.js';

export default (error, req, res, next) => {
  req.logger.error(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPES:
      res
        .status(422)
        .json({ status: 'error', error: error.name, message: error.message });
      break;
    case EErrors.DUPLICATE_KEY:
      res
        .status(409)
        .json({ status: 'error', error: error.name, message: error.message });
      break;
    case EErrors.NOT_FOUND:
      res
        .status(404)
        .json({ status: 'error', error: error.name, message: error.message });
      break;
    default:
      res.status(500).json({ status: 'error', error: 'Unhandled error' });
  }
};
