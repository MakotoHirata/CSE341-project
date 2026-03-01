require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: true,
  credentials: true
}));

// DB
connectDB();

// body parser
app.use(express.json());

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// routes
/* #swagger.start */
app.use('/tasks', require('./routes/taskRoutes'));
/* #swagger.end */

/* #swagger.start */
app.use('/auth', require('./routes/authRoutes'));
/* #swagger.end */

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
