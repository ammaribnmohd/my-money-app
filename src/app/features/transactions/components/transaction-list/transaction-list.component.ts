import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction, Category } from '../../../../core/models/app-models';

@Component({
  selector: 'app-transaction-list',
  standalone: false,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
  @Input() categories: Category[] = [];

  @Output() editTransaction = new EventEmitter<Transaction>();
  @Output() deleteTransaction = new EventEmitter<string>();

  getCategory(categoryId: string): Category | undefined {
    return this.categories.find((c) => c.id === categoryId);
  }

  onEdit(transaction: Transaction): void {
    this.editTransaction.emit(transaction);
  }

  onDelete(transactionId: string): void {
    this.deleteTransaction.emit(transactionId);
  }
}
