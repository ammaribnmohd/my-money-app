import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryFormData
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      icon: [''], 
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
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    this.dialogRef.close(this.categoryForm.value);
  }
}