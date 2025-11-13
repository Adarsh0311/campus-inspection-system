import { Component } from '@angular/core';
import { DataCategory } from '../../models/data-category.model';

@Component({
  selector: 'app-data-category',
  standalone: true,
  imports: [],
  templateUrl: './data-category.component.html',
  styleUrl: './data-category.component.css'
})
export class DataCategoryComponent {
  categories: DataCategory[] = [];
}
