const router = require('express').Router();
const {adminMiddleware, authMiddleware} = require('../middleware/authMiddleware');
const { getUsers, getUserById, updateUser, deactivateUser, registerUser, getUsersCount } = require('../controllers/userController');


router.route('/')
    .get(getUsers)
    .post(adminMiddleware, registerUser);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(adminMiddleware, deactivateUser);

router.route('/count')
    .get( getUsersCount);

module.exports = router;