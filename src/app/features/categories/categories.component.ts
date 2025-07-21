import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { Category } from '../../core/models/app-models';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryFormComponent } from './components/category-form/category-form.component';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  incomeCategories$!: Observable<Category[]>;
  expenseCategories$!: Observable<Category[]>;

  private destroy$ = new Subject<void>();
  private dialogRef: DynamicDialogRef | undefined;

  constructor(
    private localStorageService: LocalStorageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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

  addCategory(type: 'income' | 'expense'): void {
    this.dialogRef = this.dialogService.open(CategoryFormComponent, {
      header: `Add New ${type.charAt(0).toUpperCase() + type.slice(1)} Category`,
      width: 'min(90%, 450px)',
      data: { type: type }
    });

    this.dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.localStorageService.addCategory({ ...result, type: type });
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category added!' });
      }
    });
  }

  editCategory(category: Category): void {
    this.dialogRef = this.dialogService.open(CategoryFormComponent, {
      header: 'Edit Category',
      width: 'min(90%, 450px)',
      data: { category: category, type: category.type }
    });

    this.dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.localStorageService.updateCategory({ ...category, ...result });
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated!' });
      }
    });
  }

  deleteCategory(category: Category): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the category "${category.name}"? This could affect existing transactions.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.localStorageService.deleteCategory(category.id);
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Category deleted.' });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}