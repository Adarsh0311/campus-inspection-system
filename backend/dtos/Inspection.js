// javascript
class InspectionAnswerDto {
    constructor({ id, inspectionId, checklistItemId, answer, comments, createdAt, updatedAt } = {}) {
        this.id = id;
        this.inspectionId = inspectionId;
        this.checklistItemId = checklistItemId;
        this.answer = answer;
        this.comments = comments;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

class InspectionDto {
    constructor({ id, buildingId, userId, inspectionAnswers = [], createdAt, updatedAt } = {}) {
        this.id = id;
        this.buildingId = buildingId;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        this.inspectionAnswers = Array.isArray(inspectionAnswers)
            ? inspectionAnswers.map(a => (a instanceof InspectionAnswerDto ? a : new InspectionAnswerDto(a)))
            : [];
    }
}

module.exports = {InspectionDto, InspectionAnswerDto};

