import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from '../../core/models/app-models';
import { LocalStorageService } from '../../core/services/local-storage.service';
// NEW IMPORTS
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryFormComponent, CategoryFormData } from './components/category-form/category-form.component';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-categories',
  standalone: false, // This is not a standalone component
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  incomeCategories$!: Observable<Category[]>;
  expenseCategories$!: Observable<Category[]>;

  // Inject MatDialog and MatSnackBar
  constructor(
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const categories$ = this.localStorageService.appData$.pipe(
      map(data => data.categories)
    );
    this.incomeCategories$ = categories$.pipe(
      map(categories => categories.filter(c => c.type === 'income'))
    );
    this.expenseCategories$ = categories$.pipe(
      map(categories => categories.filter(c => c.type === 'expense'))
    );
  }

  // REIMPLEMENT addCategory
  addCategory(type: 'income' | 'expense'): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '400px',
      data: { type: type } // Pass the type to the dialog
    });

    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      if (result) {
        this.localStorageService.addCategory({ ...result, type: type });
        this.snackBar.open('Category added!', 'Close', { duration: 3000 });
      }
    });
  }

  // REIMPLEMENT editCategory
  editCategory(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '400px',
      data: { category: category, type: category.type } // Pass the existing category and its type
    });

    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      if (result) {
        this.localStorageService.updateCategory({ ...category, ...result });
        this.snackBar.open('Category updated!', 'Close', { duration: 3000 });
      }
    });
  }
  
  // REIMPLEMENT deleteCategory
  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.localStorageService.deleteCategory(category.id);
      this.snackBar.open('Category deleted.', 'Close', { duration: 3000 });
    }
  }
}