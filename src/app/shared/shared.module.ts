import { NgModule } from '@angular/core';
import { TakaCurrencyPipe } from './pipes/taka-currency.pipe';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import {  MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    
    TakaCurrencyPipe ,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    TakaCurrencyPipe,
    ConfirmationDialogComponent
  ],
  declarations: [
    ConfirmationDialogComponent
  ]
})
export class SharedModule { }