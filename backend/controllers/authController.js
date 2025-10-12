const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function registerUser(req, res) {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (await existsByEmail(email)) {
        return res.status(400).send({error: 'Email already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role
            }
        });
        return res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (error) {
        return res.status(400).send({error: error.message});
    }

}


async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const isPasswordValid = user && await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials.' });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT_SECRET environment variable is not defined.' });
    }
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return res.status(200).json({ token });


}

async function existsByEmail(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    return !!user;
}


module.exports = {registerUser, loginUser};