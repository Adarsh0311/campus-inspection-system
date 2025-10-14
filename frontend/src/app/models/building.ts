
export interface ChecklistItem {
  id?: string; // Will exist for items we fetch, but not for new ones
  question: string;
  type: 'NUMERIC' | 'BOOLEAN' | 'TEXT';
}

export interface Building {
  id: string;
  name: string;
  location?: string;
  checklistItems?: ChecklistItem[]; // A building can have checklist items
}

// This is the payload for creating a new building with its checklist
export interface CreateBuildingPayload {
  name: string;
  location?: string;
  checklistItems: Omit<ChecklistItem, 'id'>[]; // Omit 'id' for creation
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
