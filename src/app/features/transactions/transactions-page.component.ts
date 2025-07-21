import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Subject, takeUntil } from 'rxjs';
import { Transaction, Category } from '../../core/models/app-models';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionFilters } from './components/transaction-filter/transaction-filter.component';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-transactions-page',
  standalone: false,
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.scss'],
})
export class TransactionsPageComponent implements OnInit, OnDestroy {
  allCategories: Category[] = [];
  allFilteredTransactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];

  // Paginator State
  first: number = 0;
  rows: number = 6;
  totalRecords: number = 0;

  private filters$ = new BehaviorSubject<TransactionFilters>({
    type: 'all',
    dateRange: 'all',
  });
  private destroy$ = new Subject<void>();
  private dialogRef: DynamicDialogRef | undefined;

  constructor(
    private localStorageService: LocalStorageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const appData$ = this.localStorageService.appData$;
    const transactions$ = appData$.pipe(map((data) => data.transactions));
    const categories$ = appData$.pipe(map((data) => data.categories));

    categories$.pipe(takeUntil(this.destroy$)).subscribe(
      (categories) => (this.allCategories = categories)
    );

    const filteredTransactions$ = combineLatest([
      transactions$,
      this.filters$,
    ]).pipe(
      map(([transactions, filters]) => {
        let filtered = [...transactions];
        if (filters.type !== 'all') {
          filtered = filtered.filter((t) => t.type === filters.type);
        }
        if (filters.dateRange !== 'all') {
          const today = new Date();
          if (filters.dateRange === 'thisMonth') {
            const thisMonth = today.toISOString().substring(0, 7);
            filtered = filtered.filter((t) => t.date.startsWith(thisMonth));
          } else if (filters.dateRange === 'last7Days') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            filtered = filtered.filter((t) => new Date(t.date) >= sevenDaysAgo);
          }
        }
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
    );

    filteredTransactions$.pipe(takeUntil(this.destroy$)).subscribe(transactions => {
      this.allFilteredTransactions = transactions;
      this.totalRecords = transactions.length;
      this.first = 0;
      this.paginate();
    });
  }

  onFilterChange(newFilters: TransactionFilters): void {
    this.filters$.next(newFilters);
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 6;
    this.paginate();
  }

  private paginate(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.paginatedTransactions = this.allFilteredTransactions.slice(startIndex, endIndex);
  }

  openAddTransactionDialog(): void {
    this.dialogRef = this.dialogService.open(TransactionFormComponent, {
      header: 'Add New Transaction',
      width: 'min(90%, 450px)',
      data: { categories: this.allCategories },
    });

    this.dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result) {
        this.localStorageService.addTransaction(result);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Transaction Added!' });
      }
    });
  }

  // THIS METHOD HANDLES THE EDIT ACTION
  onEditTransaction(transaction: Transaction): void {
    this.dialogRef = this.dialogService.open(TransactionFormComponent, {
      header: 'Edit Transaction',
      width: 'min(90%, 450px)',
      data: { transaction: transaction, categories: this.allCategories },
    });

    this.dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result) {
        const updatedTransaction: Transaction = { ...transaction, ...result };
        this.localStorageService.updateTransaction(updatedTransaction);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Transaction updated!' });
      }
    });
  }

  // THIS METHOD HANDLES THE DELETE ACTION
  onDeleteTransaction(transactionId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this transaction? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.localStorageService.deleteTransaction(transactionId);
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Transaction deleted.' });
      },
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