import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// Defines the data we can pass to our dialog
export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: false, // This is not a standalone component; it relies on Angular Material.
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  // We inject the data passed from the parent component.
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {}
}