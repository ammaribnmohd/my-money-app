import { Component, Input } from '@angular/core';
import { Transaction, Category } from '../../../../core/models/app-models';


@Component({
  selector: 'app-transaction-list',
  standalone: false,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
  @Input() categories: Category[] = [];

  getCategory(categoryId: string): Category | undefined {
    return this.categories.find(c => c.id === categoryId);
  }
}
