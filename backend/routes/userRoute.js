const router = require('express').Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.route('/')
    .post(createUser)
    .get(getUsers);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;