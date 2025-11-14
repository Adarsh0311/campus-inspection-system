const express = require('express');
const app = express();

const PORT = 3000;

const userRoute = require('./routes/userRoute');
const buildingRoute = require('./routes/buildingRoute');
const authRoute = require('./routes/authRoute');
const inspectionRoute = require('./routes/inspectionRoute');
const dataCategoryRoute = require('./routes/dataCategoryRoute');

const { authMiddleware, adminMiddleware } = require('./middleware/authMiddleware');

const cors = require('cors');

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

//cors
app.use(cors());

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
app.use('/api/buildings', buildingRoute);
app.use('/api/inspections', inspectionRoute);
app.use('/api/data-categories', dataCategoryRoute);



//create a test user function
async function testUser() {

    const email = 'admin@test.com';

    const existsByEmail = async () => {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        return !!user;
    };



    if (await existsByEmail()) {
        console.log('Test user already exists');
        return;
    }

    try {
        await prisma.user.create({
            data: {
                email: email,
                password: await bcrypt.hash('1234', 10),
                firstName: 'Test',
                lastName: 'user',
                role: 'ADMIN'
            }
        });
       console.log('Test user created with email: ' + email + ' and password: 1234');
    } catch (error) {
        console.log('Error creating test user: ' + error.message);
    }
}



app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
    testUser();

});