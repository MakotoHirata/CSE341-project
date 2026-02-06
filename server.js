require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
// DB
connectDB();

// middleware
app.use(express.json());

// routes
app.use('/tasks', require('./routes/taskRoutes'));

// Swagger UI（swagger.json がある時だけ）
try {
  const swaggerDocument = require('./swagger/swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
  // swagger生成前は無視
}

// health check
app.get('/', (req, res) => {
  res.send('Task API running');
});

// ★★★ ここが超重要 ★★★
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

module.exports = app;
