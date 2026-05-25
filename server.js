const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const votersRouter = require('./routes/voters');
const pollingStationsRouter = require('./routes/pollingStations');
const swaggerDocument = require('./swagger.json');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error(
    'Missing MongoDB URI. Set MONGODB_URI or MONGO_URI in your .env file.',
  );
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/voters', votersRouter);
app.use('/api/pollingStations', pollingStationsRouter);
app.get('/swagger.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'swagger.json'));
});
app.use('/api-docs', ...swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.send(`
    <h1>Zambia Voters API</h1>
    <p>The API is running. Use the links below to access documentation and endpoints:</p>
    <ul>
      <li><a href="${baseUrl}/api-docs">Swagger UI Docs</a></li>
      <li><a href="${baseUrl}/swagger.json">Swagger JSON</a></li>
      <li><a href="${baseUrl}/api/voters">GET /api/voters</a></li>
      <li><a href="${baseUrl}/api/pollingStations">GET /api/pollingStations</a></li>
    </ul>
    <p>Use these endpoints in your API client or browser.</p>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
