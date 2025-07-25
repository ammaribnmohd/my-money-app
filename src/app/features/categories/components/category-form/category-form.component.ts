import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Category } from '../../../../core/models/app-models';

export interface CategoryFormData {
  category?: Category;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  data: CategoryFormData;

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.data = this.config.data;
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      icon: ['pi pi-tag'], // Updated to full class name
      color: ['#3F51B5']
    });
  }

  ngOnInit(): void {
    // If we are editing, patch the form with the existing category's data
    if (this.data.category) {
      this.categoryForm.patchValue(this.data.category);
    }
  }

  onCancel(): void {
    this.ref.close();
  }

  onSave(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    this.ref.close(this.categoryForm.value);
  }
}