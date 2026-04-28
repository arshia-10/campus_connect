const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const companyAuthRoutes = require('./routes/companyAuthRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const applicationsRoutes = require('./routes/applicationsRoutes');
const savedJobsRoutes = require('./routes/savedJobsRoutes');

dotenv.config();

const app = express();
const startPort = Number(process.env.PORT) || 5000;

app.use(cors());
// increase payload limits to allow base64 resume uploads
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ limit: '12mb', extended: true }));

app.get('/api/health', (_, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/company-auth', companyAuthRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error('Server failed to start:', error.message);
    process.exit(1);
  });
}

connectDB()
  .then(() => {
    startServer(startPort);
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
