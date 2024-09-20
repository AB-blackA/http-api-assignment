/* Author: Andrew Black
 *Purpose: server.js is responsible for getting the server up, while also
 *routing the user to the correct pages.
 *As per some of the other scripts, thank you to Austin Willoughby for providing
 *many examples of a properly structured server.js file, which this one is a modification of
 *Source: https://github.com/IGM-RichMedia-at-RIT/head-request-example-done/blob/master/src/server.js
 */

const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// structure for handling page routing
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': jsonHandler.success,
  '/internal': jsonHandler.internal,
  '/forbidden': jsonHandler.forbidden,
  '/notImplemented': jsonHandler.notImplemented,
  '/badRequest': (request, response, parsedUrl) => {
    const params = Object.fromEntries(parsedUrl.searchParams.entries());
    jsonHandler.badRequest(request, response, params);
  },
  '/unauthorized': (request, response, parsedUrl) => {
    const params = Object.fromEntries(parsedUrl.searchParams.entries());
    jsonHandler.unauthorized(request, response, params);
  },
  notFound: jsonHandler.notFound,
};

// function for handling all request, utilizing the urlStruct we made to differ
// to the correct function
const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, parsedUrl);
  } else {
    urlStruct.notFound(request, response);
  }
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
