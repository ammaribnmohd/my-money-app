import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakaCurrencyPipe } from './pipes/taka-currency.pipe';

@NgModule({
  imports: [
    CommonModule,
    TakaCurrencyPipe // Import the standalone pipe here
  ],
  exports: [
    TakaCurrencyPipe // And re-export it here so other modules can use it
  ]
  // The declarations array should be empty or gone
})
export class SharedModule { }