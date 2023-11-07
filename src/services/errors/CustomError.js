class CustomError extends Error {
  constructor ({ name = 'Error', cause, message, code = 1 }) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.code = code;
  }
}

export default CustomError;
