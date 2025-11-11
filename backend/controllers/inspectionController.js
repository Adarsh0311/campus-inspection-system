const inspectionService = require('../services/inspectionService');

async function handleSubmitInspection(req, res) {
    try {
        /**
         * @type {CreateInspectionDto}
         */
        const inspectionData = req.body;

        const newInspection = await inspectionService.submitInspection(inspectionData);
        return res.status(201).json(newInspection);
    } catch (error) {
        console.error('Error submitting inspection:', error);
        res.status(500).json({error: 'An error occurred while submitting the inspection.'});
    }
}


async function handleGetInspectionHistoryByBuildingAndDateRange(req, res) {
    try {
        const buildingId = req.params.buildingId;
        const { startDate, endDate } = req.query;
        const inspections = await inspectionService
                                                                .getInspectionHistoryByBuildingAndDateRange(buildingId, startDate, endDate);
        return res.status(200).json(inspections);
    } catch (error) {
        console.error('Error fetching inspection history:', error);
        res.status(500).json({error: 'An error occurred while fetching the inspection history.'});
    }
}

async function handleGetInspectionById(req, res) {
    try {
        const inspectionId = req.params.inspectionId;
        const inspection = await inspectionService.getInspectionById(inspectionId);
        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found.' });
        }
        return res.status(200).json(inspection);
    } catch (error) {
        console.error('Error fetching inspection by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching the inspection.' });
    }
}

module.exports = { handleSubmitInspection, handleGetInspectionHistoryByBuildingAndDateRange, handleGetInspectionById };