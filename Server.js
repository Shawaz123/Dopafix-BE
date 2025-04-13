const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const detectionRoutes = require('./Routes/detectionRoutes');
const errorHandler = require('./Middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Logging to debug
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/api', detectionRoutes);

// Middleware for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
