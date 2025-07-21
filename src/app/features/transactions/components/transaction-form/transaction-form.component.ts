import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Category, Transaction } from '../../../../core/models/app-models';
import { take } from 'rxjs';

export interface TransactionFormData {
  transaction?: Transaction;
  categories: Category[];
}

@Component({
  selector: 'app-transaction-form',
  standalone: false,
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  categories: Category[];
  filteredCategories: Category[] = [];
  data: TransactionFormData;

  typeOptions = [
    { label: 'Expense', value: 'expense' },
    { label: 'Income', value: 'income' }
  ];

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.data = this.config.data;
    this.categories = this.data.categories;

    this.transactionForm = this.fb.group({
      type: ['expense', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      date: [new Date(), Validators.required],
      description: ['']
    });

    this.transactionForm.get('type')?.valueChanges.subscribe(type => {
      this.updateFilteredCategories(type);
      this.transactionForm.get('categoryId')?.setValue(''); // Reset category on type change
    });
  }

  ngOnInit(): void {
    if (this.data.transaction) {
      // patchValue needs a Date object for the p-calendar
      const formData = { ...this.data.transaction, date: new Date(this.data.transaction.date) };
      this.transactionForm.patchValue(formData);
    }
    // Initial filter setup
    this.updateFilteredCategories(this.transactionForm.get('type')?.value);
  }

  updateFilteredCategories(type: 'income' | 'expense'): void {
    this.filteredCategories = this.categories.filter(c => c.type === type);
  }

  onCancel(): void {
    this.ref.close();
  }

  onSave(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const formData = this.transactionForm.value;
    const isoDate = new Date(formData.date);
    isoDate.setMinutes(isoDate.getMinutes() - isoDate.getTimezoneOffset());
    formData.date = isoDate.toISOString().split('T')[0];

    this.ref.close(formData);
  }
}