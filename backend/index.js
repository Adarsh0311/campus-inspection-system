const express = require('express');
const app = express();

const PORT = 3000;

const userRoute = require('./routes/userRoute');
const buildingRoute = require('./routes/buildingRoute');
const authRoute = require('./routes/authRoute');

const cors = require('cors');

//cors
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// test route
app.get('/', (req, res) => {
    res.send('Campus Inspection System API is running...');
});


// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/buildings', buildingRoute);

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
});