const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Task Management API',
    description: 'API for managing tasks'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = [
  './server.js',
  './routes/taskRoutes.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger generated');
});
