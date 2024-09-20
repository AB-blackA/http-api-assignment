/* Author: Andrew Black
 *Purpose: json response handler returns status codes in their json form. Unfitting
 *of the title, the capability for returning codes in XML is also present.
 *Each code has both a message and an id.
 *NOTE: starter code not provided for this, but the basis of this was taken from
 *Austin Willoughby from an in-class lecture at Rochester Institute of Technology.
 *Source: https://github.com/IGM-RichMedia-at-RIT/head-request-example-done/blob/master/src/jsonResponses.js
 *Exports: success,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  notImplemented,
  internal,
 */

// function for handling XML responses
const respondXML = (request, response, status, object) => {
  let xmlContent = '<response>';

  Object.entries(object).forEach(([key, value]) => {
    xmlContent += `<${key}>${value}</${key}>`;
  });

  xmlContent += '</response>';

  const headers = {
    'Content-Type': 'text/xml',
    'Content-Length': Buffer.byteLength(xmlContent, 'utf8'),
  };

  response.writeHead(status, headers);

  if (request.method !== 'HEAD') {
    response.write(xmlContent);
  }

  response.end();
};

// function for handling JSON responses
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  response.writeHead(status, headers);

  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};

// helper function to determine response type
// note that the default here is JSON as specified by assignment instructions
// (JSON is way better than XML anyways, like cmon yall)
const respondResponse = (request, response, status, object) => {
  const acceptHeader = request.headers.accept || '';

  if (acceptHeader.includes('text/xml')) {
    respondXML(request, response, status, object);
  } else {
    respondJSON(request, response, status, object);
  }
};

/* The follow are all response handlers for status codes, and they include a message and id. */

// success response
const success = (request, response) => {
  const responseObj = { message: 'This is a successful response' };
  respondResponse(request, response, 200, responseObj);
};

// bad request response
const badRequest = (request, response, params) => {
  const responseObj = {
    message: 'The value of the \'valid\' parameter is not \'true\'.',
    id: 'badRequest',
  };

  if (!params.valid || params.valid !== 'true') {
    responseObj.message = 'Missing valid query parameter set to true';
    responseObj.id = 'badRequestMissing';
    return respondResponse(request, response, 400, responseObj);
  }

  return respondResponse(request, response, 200, responseObj);
};

// not found response
const notFound = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };
  respondResponse(request, response, 404, responseObj);
};

// forbidden response
const forbidden = (request, response) => {
  const responseObj = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };
  respondResponse(request, response, 403, responseObj);
};

// internal server error response
const internal = (request, response) => {
  const responseObj = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internal',
  };
  respondResponse(request, response, 500, responseObj);
};

// not implemented response
const notImplemented = (request, response) => {
  const responseObj = {
    message: 'A request for this page has not been implemented yet. Check again later for udpated content.',
    id: 'notImplemented',
  };
  respondResponse(request, response, 501, responseObj);
};

// unauthorized response
const unauthorized = (request, response, params) => {
  const responseObj = {
    message: 'the value of the \'loggedIn\' paramter is not \'yes\'.',
    id: 'unauthorized',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseObj.message = 'Missing loggedIn query parameter set to yes';
    responseObj.id = 'unauthorized';
    return respondResponse(request, response, 401, responseObj);
  }

  return respondResponse(request, response, 200, responseObj);
};

module.exports = {
  success,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  notImplemented,
  internal,
};
