const express = require('express');
const app = express();
const { pool } = require('./connection');
const userRoute = require('./routes/userRoute');

// Middleware to parse JSON bodies
app.use(express.json());

//db connection
pool.connect()
  .then(() => console.log('Connected to the database.'))
  .catch(err => console.error('Database connection error', err.stack));

// test route
app.get('/', (req, res) => {
  res.send('Campus Inspection System API is running...');
});


// Routes
app.use('/api/users', userRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});