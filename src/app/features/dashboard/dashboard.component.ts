import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { LocalStorageService } from '../../core/services/local-storage.service';

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
  expenseChartData$!: Observable<any>;
  chartOptions: any;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const appData$ = this.localStorageService.appData$;
    const transactions$ = appData$.pipe(map(data => data.transactions));
    const categories$ = appData$.pipe(map(data => data.categories));

    this.totalIncome$ = transactions$.pipe(map(ts => ts.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)));
    this.totalExpense$ = transactions$.pipe(map(ts => ts.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)));
    this.currentBalance$ = combineLatest([this.totalIncome$, this.totalExpense$]).pipe(map(([income, expense]) => income - expense));

    const expenseBreakdown$ = combineLatest([transactions$, categories$]).pipe(
      map(([transactions, categories]) => {
        const categorySums = new Map<string, number>();
        transactions
          .filter(t => t.type === 'expense')
          .forEach(t => {
            const currentSum = categorySums.get(t.categoryId) || 0;
            categorySums.set(t.categoryId, currentSum + t.amount);
          });

        const chartData: { name: string; value: number; color?: string }[] = [];
        categorySums.forEach((value, categoryId) => {
          const category = categories.find(c => c.id === categoryId);
          chartData.push({
            name: category?.name || 'Uncategorized',
            value: value,
            color: category?.color
          });
        });
        return chartData;
      })
    );

    this.expenseChartData$ = expenseBreakdown$.pipe(
      map(breakdown => {
        const labels = breakdown.map(item => item.name);
        const data = breakdown.map(item => item.value);
        const backgroundColors = breakdown.map(item => item.color || this.getRandomColor());

        return {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: backgroundColors
            }
          ]
        };
      })
    );

   
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false 
        }
      }
    };
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}