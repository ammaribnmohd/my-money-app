import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from '../../core/models/app-models';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  incomeCategories$!: Observable<Category[]>;
  expenseCategories$!: Observable<Category[]>;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const categories$ = this.localStorageService.appData$.pipe(
      map(data => data.categories)
    );

    // Create a stream for just income categories
    this.incomeCategories$ = categories$.pipe(
      map(categories => categories.filter(c => c.type === 'income'))
    );

    // Create a stream for just expense categories
    this.expenseCategories$ = categories$.pipe(
      map(categories => categories.filter(c => c.type === 'expense'))
    );
  }

  addCategory(type: 'income' | 'expense'): void {
    // We will implement this in the next step with a dialog form.
    alert(`Adding a new ${type} category soon!`);
  }

  editCategory(category: Category): void {
    alert(`Editing ${category.name} soon!`);
  }
  
  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      this.localStorageService.deleteCategory(category.id);
    }
  }
}
