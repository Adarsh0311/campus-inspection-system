const express = require('express');
const app = express();

const PORT = 3000;

const userRoute = require('./routes/userRoute');
const buildingRoute = require('./routes/buildingRoute');
const authRoute = require('./routes/authRoute');

const { authMiddleware, adminMiddleware } = require('./middleware/authMiddleware');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// test route
app.get('/', (req, res) => {
    res.send('<h1>Campus Inspection System API is running...</h1>');
});


// Routes
app.use('/api/auth', authRoute);

app.use(authMiddleware);

app.use('/api/users', userRoute);
app.use('/api/buildings', adminMiddleware, buildingRoute);

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
});