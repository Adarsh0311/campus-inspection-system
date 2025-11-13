const express = require('express');
const router = express.Router();
const { handleSubmitInspection,
    handleGetInspectionHistoryByBuildingAndDateRange,
    handleGetInspectionById,
    handleUpdateInspection
} = require('../controllers/inspectionController');


router.route('/:inspectionId')
    .get(handleGetInspectionById)
    .put(handleUpdateInspection);

router.route('/')
    .post(handleSubmitInspection);

router.route('/buildings/:buildingId')
    .get(handleGetInspectionHistoryByBuildingAndDateRange);



module.exports = router;