import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakaCurrencyPipe } from './pipes/taka-currency.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    TakaCurrencyPipe,
    ConfirmDialogModule,
    ButtonModule
  ],
  exports: [
    TakaCurrencyPipe,
    ConfirmDialogModule
  ],
  declarations: []
})
export class SharedModule { }