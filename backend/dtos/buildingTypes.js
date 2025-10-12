/**
 * @typedef {object} ChecklistItemCreateDto
 * @property {string} question - The inspection question.
 * @property {'NUMERIC' | 'BOOLEAN' | 'TEXT'} type - The type of answer expected.
 */

/**
 * @typedef {object} ChecklistItemUpdateDto
 * @property {string} id - The ID of the checklist item to update.
 * @property {string} [question] - The new inspection question (optional).
 * @property {'NUMERIC' | 'BOOLEAN' | 'TEXT'} [type] - The new answer type (optional).
 */

/**
 * Represents the payload for updating a building and its checklist.
 * @typedef {object} UpdateBuildingDto
 * @property {string} [name] - The new name of the building.
 * @property {string} [location] - The new location of the building.
 * @property {object} [checklistItems] - The changes to the checklist items.
 * @property {ChecklistItemCreateDto[]} [checklistItems.create] - New items to add.
 * @property {ChecklistItemUpdateDto[]} [checklistItems.update] - Existing items to modify.
 * @property {string[]} [checklistItems.delete] - IDs of items to remove.
 */

// This export is just to make the file a module. It doesn't do anything functional.
module.exports = {};