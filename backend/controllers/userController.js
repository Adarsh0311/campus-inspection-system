const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function createUser(req, res){
    try {
        if (await existsByEmail(req.body.email)) {
            return res.status(400).send({error: 'Email already exists'});
        }
        // if (req.body.password.length < 4) {
        //     return res.status(400).send({error: 'Password must be at least 4 characters long'});
        // }
        // if (!['admin', 'technician', 'user'].includes(req.body.role.toLowerCase())) {
        //     return res.status(400).send({error: 'Invalid role specified'});
        // }
        const newUser = await prisma.user.create({
            data: req.body
        });
        return res.status(201).json(newUser);
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

async function existsByEmail(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    return !!user;
}


module.exports = {createUser, deleteUser, getUserById, getUsers, updateUser};
