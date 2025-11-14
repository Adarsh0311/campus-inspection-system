const dataCategoryService = require('../services/dataCategoryService');

async function createDataCategory(req, res) {
    try {
        const categoryData = req.body;
        const newCategory = await dataCategoryService.createDataCategory(categoryData);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({error: 'Failed to create data category'});
    }
}

async function getAllDataCategories(req, res) {
    try {
        const categories = await dataCategoryService.getAllDataCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve data categories'});
    }
}

async function getDataCategoryById(req, res) {
    try {
        const {id} = req.params;
        const category = await dataCategoryService.getDataCategoryById(id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({error: 'Data category not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve data category'});
    }
}

async function deleteDataCategory(req, res) {
    try {
        const {id} = req.params;
        const deletedCategory = await dataCategoryService.deleteDataCategory(id);
        res.status(200).json(deletedCategory);
    } catch (error) {
        res.status(500).json({error: 'Failed to delete data category'});
    }
}

module.exports = {createDataCategory, getAllDataCategories, getDataCategoryById, deleteDataCategory};