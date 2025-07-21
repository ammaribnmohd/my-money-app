import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Transaction, Category } from '../../../../core/models/app-models';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

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

  // @ViewChild('menu') finds the <p-menu #menu> in your HTML.
  @ViewChild('menu') menu!: Menu;

  menuItems: MenuItem[] = [];

  getCategory(categoryId: string): Category | undefined {
    return this.categories.find((c) => c.id === categoryId);
  }

  selectTransaction(event: Event, transaction: Transaction): void {
    // 1. Create the menu items for the specific transaction that was clicked.
    this.menuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.onEdit(transaction),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.onDelete(transaction.id),
      }
    ];

    // 2. Tell the menu to open itself.
    this.menu.toggle(event);
    event.stopPropagation();
  }

  onEdit(transaction: Transaction): void {
    this.editTransaction.emit(transaction);
  }

  onDelete(transactionId: string): void {
    this.deleteTransaction.emit(transactionId);
  }
}