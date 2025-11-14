const { getAllDataCategories, getDataCategoryById, createDataCategory, deleteDataCategory } = require('../controllers/dataCategoryController');
const express = require('express');
const {adminMiddleware} = require("../middleware/authMiddleware");
const router = express.Router();


router.route('/')
    .post(adminMiddleware, createDataCategory)
    .get(adminMiddleware, getAllDataCategories);

router.route('/:id')
    .get(getDataCategoryById)
    .delete(adminMiddleware, deleteDataCategory);

module.exports = router;