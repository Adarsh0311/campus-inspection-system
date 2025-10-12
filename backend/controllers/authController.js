const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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

async function existsByEmail(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    return !!user;
}


module.exports = {registerUser};