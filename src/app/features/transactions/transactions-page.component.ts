import { Component, OnInit } from '@angular/core';
import { Observable, first, map } from 'rxjs';
import { Transaction, Category } from '../../core/models/app-models';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transactions-page',
  standalone: false,
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.scss']
})
export class TransactionsPageComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  categories$!: Observable<Category[]>;
  allCategories: Category[] = []; // A local copy of categories to pass to the dialog

  constructor(
    private localStorageService: LocalStorageService,
    private dialog: MatDialog ,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const appData$ = this.localStorageService.appData$;

    this.transactions$ = appData$.pipe(
      map(data => data.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    );

    this.categories$ = appData$.pipe(map(data => data.categories));

    // Keep a non-observable copy of categories for the dialog
    this.categories$.subscribe(categories => {
      this.allCategories = categories;
    });
  }

  openAddTransactionDialog(): void {
    // Open the dialog, passing our TransactionFormComponent as the content.
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '400px',
      data: {
        // We pass the list of all categories to the dialog form.
        categories: this.allCategories
      }
    });

    // Subscribe to the 'afterClosed' event. This runs when the dialog is closed.
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      // 'result' will be the form data if the user clicked "Save", or undefined if they clicked "Cancel".
      if (result) {
        console.log('Dialog result:', result);
        this.localStorageService.addTransaction(result);
      }
    });
  }

   onEditTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '400px',
      data: {
        // Pass the specific transaction to be edited
        transaction: transaction,
        categories: this.allCategories
      }
    });

    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      if (result) {
        // The form returns the updated data, but we need the original ID.
        const updatedTransaction: Transaction = { ...transaction, ...result };
        this.localStorageService.updateTransaction(updatedTransaction);
        this.snackBar.open('Transaction updated!', 'Close', { duration: 3000 });
      }
    });
  }
  
  onDeleteTransaction(transactionId: string): void {
    if (confirm('Are you sure you want to delete this transaction? This cannot be undone.')) {
      this.localStorageService.deleteTransaction(transactionId);
      this.snackBar.open('Transaction deleted.', 'Close', { duration: 3000 });
    }
  }
}