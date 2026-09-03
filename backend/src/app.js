const express = require('express');
const cors = require('cors');

// Import routers
const commandRoutes = require('./routes/commandRoutes');
const queryRoutes = require('./routes/queryRoutes');

const app = express();

// Standard Middlewares
app.use(cors()); 
app.use(express.json());  

// Bind separate Command (Write) and Query (Read) entry points
app.use('/api/commands', commandRoutes);
app.use('/api/queries', queryRoutes);

// Base route checker
app.get('/', (req, res) => {
  res.status(200).json({ status: "AuditTrail Express Server Online", mode: "CQRS" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke internally!" });
});

module.exports = app;
   