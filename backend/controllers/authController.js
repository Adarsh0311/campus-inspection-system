const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();


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

    if (user.isActive === false) {
        return res.status(403).json({ error: 'User account is deactivated.' });
    }

    const isPasswordValid = user && await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials.' });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT_SECRET environment variable is not defined.' });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email,  role: user.role, firstName: user.firstName, lastName: user.lastName },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return res.status(200).json({ token });


}

async function updateProfile(req, res) {
    const {id} = req.params;
    const {firstName, lastName } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: {id: id},
            data: {
                firstName,
                lastName
            },
            select: {firstName: true, lastName: true}
        });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({error: 'An error occurred while updating the user profile.'});
    }

}

async function handleChangePassword(req, res) {
    const {userId} = req.user;
    const {currentPassword, newPassword} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {id: userId},
        });

        if (!user) {
            return res.status(404).json({error: 'User not found.'});
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({error: 'Current password is incorrect.'});
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {id: userId},
            data: {password: hashedNewPassword},
        });

        return res.status(200).json({message: 'Password updated successfully.'});
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({error: 'An error occurred while changing the password.'});
    }
}


module.exports = {loginUser, updateProfile, handleChangePassword};