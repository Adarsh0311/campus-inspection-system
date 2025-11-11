
export interface ChecklistItem {
  id?: string; // Will exist for items we fetch, but not for new ones
  question: string;
  type: 'NUMERIC' | 'BOOLEAN' | 'TEXT';
}

export interface Building {
  id: string;
  name: string;
  location?: string;
  checklistItems: ChecklistItem[]; // A building can have checklist items
  createdAt: string;
  updatedAt: string;
}

// This is the payload for creating a new building with its checklist
export interface CreateBuildingPayload {
  name: string;
  location?: string;
  checklistItems: Omit<ChecklistItem, 'id' | 'required' | 'order'>[]; // Omit 'id' for creation
}


export interface ChecklistItemResponse {
  id: string;
  question: string;
  type: 'NUMERIC' | 'BOOLEAN' | 'TEXT';
}

export interface BuildingResponse {
  id: string;
  name: string;
  location?: string;
  checklistItems: ChecklistItemResponse[];
  createdAt: string;
  updatedAt: string;
}


export interface UpdateBuildingPayload {
  name?: string;
  location?: string;
  checklistItems: {
    create: Omit<ChecklistItem, 'id'>[]; // New items
    update: ChecklistItem[];             // Existing items to update
    delete: string[];                    // IDs of items to delete
  };
}
