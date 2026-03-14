const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swagger.json');

const options = {
  definition: swaggerDefinition,
  apis: []
};

module.exports = swaggerJSDoc(options);
