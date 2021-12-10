/**
 * Handle runtime errors
 *
 * @param {Error} error
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
module.exports = (error, request, response, next) => {
  response.status(500).json({
    error: String(error),
  });
  console.error(error);
};
