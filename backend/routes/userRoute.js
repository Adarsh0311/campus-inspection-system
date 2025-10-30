const router = require('express').Router();
const {adminMiddleware, authMiddleware} = require('../middleware/authMiddleware');
const { getUsers, getUserById, updateUser, deleteUser, registerUser, getUsersCount } = require('../controllers/userController');


router.route('/')
    .get(adminMiddleware, getUsers)
    .post(adminMiddleware, registerUser);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(adminMiddleware, deleteUser);

router.route('/count')
    .get( getUsersCount);

module.exports = router;