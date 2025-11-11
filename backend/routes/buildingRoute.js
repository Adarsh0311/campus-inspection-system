const express = require('express');
const router = express.Router();
const {
    handleCreateBuilding,
    handleGetBuildingById,
    handleGetAllBuildings, handleUpdateBuilding, handleDeleteBuilding, handleGetBuildingChecklistItems
} = require('../controllers/buildingController');



router.route('/')
    .post(handleCreateBuilding)
    .get(handleGetAllBuildings);

router.route('/:id')
    .get(handleGetBuildingById)
    .delete(handleDeleteBuilding)
    .put(handleUpdateBuilding);

router.route('/:id/checklist-items')
    .get(handleGetBuildingChecklistItems);


module.exports = router;