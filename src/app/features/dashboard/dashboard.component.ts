import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Category } from '../../core/models/app-models';
import { TakaCurrencyPipe } from '../../shared/pipes/taka-currency.pipe';


export interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: false, 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Observables for the summary cards
  currentBalance$!: Observable<number>;
  totalIncome$!: Observable<number>;
  totalExpense$!: Observable<number>;
  
  // Observable for the pie chart data
  expenseBreakdown$!: Observable<ChartData[]>;

  private takaCurrencyPipe = new TakaCurrencyPipe();

 
  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const appData$ = this.localStorageService.appData$;
    const transactions$ = appData$.pipe(map(data => data.transactions));
    const categories$ = appData$.pipe(map(data => data.categories));

    // Calculate Total Income 
    this.totalIncome$ = transactions$.pipe(
      map(transactions => transactions
        .filter(t => t.type === 'income')
        .reduce((sum, current) => sum + current.amount, 0)
      )
    );

    // Calculate Total Expense
    this.totalExpense$ = transactions$.pipe(
      map(transactions => transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, current) => sum + current.amount, 0)
      )
    );

    // Calculate Current Balance 
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

    // Calculate Expense Breakdown for the chart
    this.expenseBreakdown$ = combineLatest([transactions$, categories$]).pipe(
      map(([transactions, categories]) => {
        const categorySums = new Map<string, number>();

        transactions
          .filter(t => t.type === 'expense')
          .forEach(t => {
            const currentSum = categorySums.get(t.categoryId) || 0;
            categorySums.set(t.categoryId, currentSum + t.amount);
          });

        const chartData: ChartData[] = [];
        categorySums.forEach((value, categoryId) => {
          const category = categories.find(c => c.id === categoryId);
          chartData.push({
            name: category?.name || 'Uncategorized',
            value: value
          });
        });
        
        return chartData;
      })
    );
  }

 
  public valueFormatting = (value: number): string => {
    return this.takaCurrencyPipe.transform(value);
  }

  public percentageFormatting = (value: number): string => {
    return `${value.toFixed(1)}%`;
  }
}