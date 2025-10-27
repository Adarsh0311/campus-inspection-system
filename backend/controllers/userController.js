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

async function getUsers(req, res){
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).send({error: error.message});
    }
}

async function getUserById(req, res){
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: id }
        });
        if (!user) {
            return res.status(404).send({error: 'User not found'});
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).send({error: error.message});
    }
}

async function updateUser(req, res){
    try {
        const { id } = req.params;
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: req.body
        });
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).send({error: error.message});
    }
}

async function deleteUser(req, res){
    try {
        const { id } = req.params;
        const deletedUser = await prisma.user.update({
            where: { id: id },
            data: { isActive: false }
        });
        return res.status(200).json(deletedUser);
    } catch (error) {
        return res.status(400).send({error: error.message});
    }
}


async function getUsersCount(req, res) {
    const count = await prisma.user.count();
    return res.status(200).send(count);
}


async function existsByEmail(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    return !!user;
}





module.exports = {deleteUser, getUserById, getUsers, updateUser, registerUser, getUsersCount};
