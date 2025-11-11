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


module.exports = {loginUser};