const express = require('express');
const router = express.Router();
const {
    handleCreateBuilding,
    handleGetBuildingById,
    handleGetAllBuildings, handleUpdateBuilding, handleDeleteBuilding
} = require('../controllers/buildingController');

router.route('/')
    .post(handleCreateBuilding)
    .get(handleGetAllBuildings);

router.route('/:id')
    .get(handleGetBuildingById)
    .delete(handleDeleteBuilding)
    .put(handleUpdateBuilding);


module.exports = router;