require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const app = express();
app.use(cors());
// DB
connectDB();

// middleware
app.use(express.json());
app.use(
  session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/auth', require('./routes/authRoutes'));

// Swagger UI
try {
  const swaggerDocument = require('./swagger/swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
}

// health check
app.get('/', (req, res) => {
  res.send('Task API running');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

module.exports = app;
