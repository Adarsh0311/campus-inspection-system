export interface DataCategory {
  id: string;
  name: string;
  position: number;
  type: 'TEXT' | 'NUMERIC' | 'BOOLEAN';
}

export interface DataCategoryRequest {
  name: string;
  type: 'TEXT' | 'NUMERIC' | 'BOOLEAN';
  position: number;
}