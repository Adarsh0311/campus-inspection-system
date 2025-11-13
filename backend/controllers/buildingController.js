/** @typedef {import('../dtos/buildingTypes').UpdateBuildingDto} UpdateBuildingDto */

const buildingService = require("../services/buildingService")

async function handleCreateBuilding(req, res) {
    const {name} = req.body;
    if (!name) {
        return res.status(400).json({error: 'Building name is required.'});
    }

    try {
        const newBuilding = await buildingService.createBuildingWithChecklist(req.body);
        res.status(201).json(newBuilding);
    } catch (error) {
        console.error('Error creating building:', error);
        res.status(500).json({error: 'An error occurred while creating the building.'});
    }
}

async function handleGetAllBuildings(req, res) {
    try {
        const buildings = await buildingService.getAllBuildings();
        res.status(200).json(buildings);
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).json({error: 'An error occurred while fetching buildings.'});
    }
}

async function handleGetBuildingById(req, res) {
    const {id} = req.params;
    try {
        const building = await buildingService.getBuildingById(id);
        if (!building) {
            return res.status(404).json({error: 'Building not found. Invalid id'});
        }
        res.status(200).json(building);
    } catch (error) {
        console.error('Error fetching building:', error);
        res.status(500).json({error: 'An error occurred while fetching the building.'});
    }
}

async function handleDeleteBuilding(req, res) {
    const {id} = req.params;
    try {
        const deleted = await buildingService.deleteBuilding(id);
        if (!deleted) {
            return res.status(404).json({error: 'Building not found. Invalid id'});
        }
        res.status(200).json({message: 'Building deleted successfully.'});
    } catch (error) {
        console.error('Error deleting building:', error);
        res.status(500).json({error: 'An error occurred while deleting the building.'});
    }
}

async function handleUpdateBuilding(req, res) {
    const {id} = req.params;
    try {
        /**
         * @type {UpdateBuildingDto}
         */
        const updateData = req.body;

        const updatedBuilding = await buildingService.updateBuilding(id, updateData);
        if (!updatedBuilding) {
            return res.status(404).json({error: 'Building not found. Invalid id'});
        }
        res.status(200).json(updatedBuilding);
    } catch (error) {
        console.error('Error updating building:', error);
        res.status(500).json({error: 'An error occurred while updating the building.'});
    }
}

async function handleGetBuildingChecklistItems(req, res) {
    const {id} = req.params;
    try {
        const checklistItems = await buildingService.getBuildingChecklistItems(id);
        if (!checklistItems) {
            return res.status(404).json({error: 'Building not found. Invalid id'});
        }
        res.status(200).json(checklistItems);
    }
    catch (error) {
        console.error('Error fetching building checklist items:', error);
        res.status(500).json({error: 'An error occurred while fetching the building checklist items.'});
    }
}


async function handleGetAllActiveBuildings(req, res) {
    try {
        const buildings = await buildingService.getAllActiveBuildings();
        res.status(200).json(buildings);
    } catch (error) {
        console.error('Error fetching active buildings:', error);
        res.status(500).json({error: 'An error occurred while fetching active buildings.'});
    }
}


module.exports = {
    handleCreateBuilding, handleGetAllBuildings, handleGetBuildingById, handleUpdateBuilding, handleDeleteBuilding, handleGetBuildingChecklistItems, handleGetAllActiveBuildings
};