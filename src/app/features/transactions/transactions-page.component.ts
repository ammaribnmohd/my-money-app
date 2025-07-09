import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, first, map } from 'rxjs';
import { Transaction, Category } from '../../core/models/app-models';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionFilters } from './components/transaction-filter/transaction-filter.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-transactions-page',
  standalone: false,
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.scss'],
})
export class TransactionsPageComponent implements OnInit {
  filteredTransactions$!: Observable<Transaction[]>;
  categories$!: Observable<Category[]>;
  allCategories: Category[] = []; 

  private filters$ = new BehaviorSubject<TransactionFilters>({
    type: 'all',
    dateRange: 'all',
  });

  constructor(
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const appData$ = this.localStorageService.appData$;
    const transactions$ = appData$.pipe(map((data) => data.transactions));
    this.categories$ = appData$.pipe(map((data) => data.categories));

    this.categories$.subscribe(
      (categories) => (this.allCategories = categories)
    );

    this.filteredTransactions$ = combineLatest([
      transactions$,
      this.filters$,
    ]).pipe(
      map(([transactions, filters]) => {
        // Start with all transactions
        let filteredTransactions = [...transactions];

        // 1. Apply the 'type' filter
        if (filters.type !== 'all') {
          filteredTransactions = filteredTransactions.filter(
            (t) => t.type === filters.type
          );
        }

        // 2. Apply the 'dateRange' filter
        if (filters.dateRange !== 'all') {
          const today = new Date();
          if (filters.dateRange === 'thisMonth') {
            const thisMonth = today.toISOString().substring(0, 7); 
            filteredTransactions = filteredTransactions.filter((t) =>
              t.date.startsWith(thisMonth)
            );
          } else if (filters.dateRange === 'last7Days') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            filteredTransactions = filteredTransactions.filter(
              (t) => new Date(t.date) >= sevenDaysAgo
            );
          }
        }

        // 3. Sort the final result
        return filteredTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      })
    );
  }
  onFilterChange(newFilters: TransactionFilters): void {
    this.filters$.next(newFilters);
  }

  openAddTransactionDialog(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '400px',
      data: {
        categories: this.allCategories,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.localStorageService.addTransaction(result);
          this.snackBar.open('Transaction Added!', 'Close', { duration: 3000 });
        }
      });
  }

  onEditTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '400px',
      data: {
        
        transaction: transaction,
        categories: this.allCategories,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
         
          const updatedTransaction: Transaction = { ...transaction, ...result };
          this.localStorageService.updateTransaction(updatedTransaction);
          this.snackBar.open('Transaction updated!', 'Close', {
            duration: 3000,
          });
        }
      });
  }

  onDeleteTransaction(transactionId: string): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirm Deletion',
      message:
        'Are you sure you want to delete this transaction? This action cannot be undone.',
      confirmButtonText: 'Delete',
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
      
        if (result) {
          this.localStorageService.deleteTransaction(transactionId);
          this.snackBar.open('Transaction deleted.', 'Close', {
            duration: 3000,
          });
        }
      });
  }
}
