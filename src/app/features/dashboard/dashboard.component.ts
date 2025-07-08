import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Transaction } from '../../core/models/app-models';

@Component({
  selector: 'app-dashboard',
  standalone: false, 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentBalance$!: Observable<number>;
  totalIncome$!: Observable<number>;
  totalExpense$!: Observable<number>;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const transactions$ = this.localStorageService.appData$.pipe(
      map(data => data.transactions)
    );

    // Calculate Total Income by filtering for 'income' and summing the amounts.
    this.totalIncome$ = transactions$.pipe(
      map(transactions => transactions
        .filter(t => t.type === 'income')
        .reduce((sum, current) => sum + current.amount, 0)
      )
    );

    // Calculate Total Expense by filtering for 'expense' and summing the amounts.
    this.totalExpense$ = transactions$.pipe(
      map(transactions => transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, current) => sum + current.amount, 0)
      )
    );

    // Calculate Current Balance by getting the difference between income and expense.
    this.currentBalance$ = transactions$.pipe(
      map(transactions => {
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, current) => sum + current.amount, 0);
        const expense = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, current) => sum + current.amount, 0);
        return income - expense;
      })
    );
  }
}