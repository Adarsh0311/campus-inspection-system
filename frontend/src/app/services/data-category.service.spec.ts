import { TestBed } from '@angular/core/testing';

import { DataCategoryService } from './data-category.service';

describe('DataCategoryService', () => {
  let service: DataCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
