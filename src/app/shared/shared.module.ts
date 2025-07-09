import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakaCurrencyPipe } from './pipes/taka-currency.pipe';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import {  MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    TakaCurrencyPipe ,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    TakaCurrencyPipe,
    ConfirmationDialogComponent// And re-export it here so other modules can use it
  ],
  declarations: [
    ConfirmationDialogComponent
  ]
  // The declarations array should be empty or gone
})
export class SharedModule { }