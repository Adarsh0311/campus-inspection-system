import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataCategory, DataCategoryRequest } from '../../models/data-category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataCategoryService } from '../../services/data-category.service';
import { BackButtonComponent } from "../back-button/back-button.component";

declare var bootstrap: any; // import global bootstrap JS

@Component({
  selector: 'app-data-category',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './data-category.component.html',
  styleUrl: './data-category.component.css'
})
export class DataCategoryComponent implements OnInit {
  searchCategory: string = '';

  @ViewChild('modalElement') modalElement!: ElementRef;
  dataCategories: DataCategory[] = [];
  allDataCategories: DataCategory[] = [];
  modalInstance: any;
  errorMessage: string = '';
  modalErrorMessage: string = '';
  newCategory: DataCategoryRequest = {
    name: '',
    type: 'TEXT',
    position: 0
  };

  constructor(private dataCategoryService: DataCategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.dataCategoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.dataCategories = categories;
        this.allDataCategories = categories;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load data categories.';
        console.error('Error loading data categories:', err);
      }
    });
  }

  createCategory() {
    this.dataCategoryService.createCategory(this.newCategory).subscribe({
      next: (category) => {
        this.dataCategories.push(category);
        this.allDataCategories = this.dataCategories;
        this.errorMessage = '';
        this.modalErrorMessage = '';
        this.closeModal();
        this.newCategory = {
          name: '',
          type: 'TEXT',
          position: 0
        };
      },
      error: (err) => {
        this.modalErrorMessage = err.error?.error || 'Failed to create data category.';
        console.error('Error creating data category:', err);
      }
    });
  }

  deleteCategory(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete the data category "${name}"?`)) {
      return;
    }
    this.dataCategoryService.deleteCategory(id).subscribe({
      next: () => {
        this.dataCategories = this.dataCategories.filter(category => category.id !== id);
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to delete data category.';
        console.error('Error deleting data category:', err);
      }
    });
  }

  filterCategories() {
    const search = this.searchCategory.toLowerCase();
    this.dataCategories = this.allDataCategories.filter(category =>
      category.name.toLowerCase().includes(search)
    );
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  openModal() {
    this.modalInstance.show();
  }
  closeModal() {
    this.modalInstance.hide();
  }


} 
