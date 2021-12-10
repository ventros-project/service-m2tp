/**
 * Handle 404 Not Found
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
module.exports = (request, response) => {
  response.status(404).json({
    error: `URL path "${request.path}" is invalid`,
  });
};
