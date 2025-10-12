const router = require('express').Router();
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;