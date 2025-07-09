import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category, Transaction } from '../../../../core/models/app-models';


// This interface defines the data we can pass TO the dialog.
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

  constructor(
    private fb: FormBuilder,
    // MatDialogRef is a handle to the dialog itself. We use it to close it.
    public dialogRef: MatDialogRef<TransactionFormComponent>,
    // MAT_DIALOG_DATA is how we receive data from the component that opened the dialog.
    @Inject(MAT_DIALOG_DATA) public data: TransactionFormData
  ) {
    this.categories = this.data.categories;

    // Build the form structure and set validation rules.
    this.transactionForm = this.fb.group({
      type: ['expense', Validators.required], 
      amount: [null, [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      date: [new Date(), Validators.required], 
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.transaction) {
      this.transactionForm.patchValue(this.data.transaction);
    }
  }

  // A helper to filter categories based on the selected transaction type (Income/Expense).
  get filteredCategories(): Category[] {
    const selectedType = this.transactionForm.get('type')?.value;
    return this.categories.filter(c => c.type === selectedType);
  }

  onCancel(): void {
    // Close the dialog without sending back any data.
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.transactionForm.invalid) {
      return; 
    }

    const formData = this.transactionForm.value;
    const isoDate = new Date(formData.date);
    isoDate.setMinutes(isoDate.getMinutes() - isoDate.getTimezoneOffset());
    formData.date = isoDate.toISOString().split('T')[0];

    this.dialogRef.close(formData);
  }
}