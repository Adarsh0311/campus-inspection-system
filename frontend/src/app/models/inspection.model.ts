export interface CreateInspectionRequest {
    buildingId: string;
    userId: string;
    date: Date;
    answers: CreateInspectionAnswerRequest[];

}

export interface CreateInspectionAnswerRequest {
  checklistItemId: string;
  answer: string;
}


export interface InspectionAnswerResponse {
  checklistItemId: string;
  answer: string;
  inspectionId: string;
}


export interface InspectionResponse {
    id: string;
    buildingId: string;
    userId: string;
    date: Date;
    answers: InspectionAnswerResponse[];
    createdAt: Date;
    updatedAt: Date;
}
