const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const votersRouter = require('./routes/voters');
const pollingStationsRouter = require('./routes/pollingStations');
const authRouter = require('./routes/auth');
const configurePassport = require('./config/passport');
const swaggerDocument = require('./swagger.json');

require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
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

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'development-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
};

if (process.env.SESSION_STORE === 'mongo') {
  sessionOptions.store = MongoStore.create({ mongoUrl: mongoUri });
}

app.use(
  session(sessionOptions),
);

app.locals.oauthConfigured = configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
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
      <li><a href="${baseUrl}/auth/github">Login with GitHub</a></li>
      <li><a href="${baseUrl}/auth/status">GET /auth/status</a></li>
      <li><a href="${baseUrl}/auth/profile">GET /auth/profile</a></li>
      <li><a href="${baseUrl}/auth/logout">Logout</a></li>
      <li><a href="${baseUrl}/api/voters">GET /api/voters</a></li>
      <li><a href="${baseUrl}/api/pollingStations">GET /api/pollingStations</a></li>
    </ul>
    <p>Use these endpoints in your API client or browser. POST, PUT, and DELETE routes require login.</p>
  `);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
