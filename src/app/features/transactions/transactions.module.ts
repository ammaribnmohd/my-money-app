import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsPageComponent } from './transactions-page.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionFilterComponent } from './components/transaction-filter/transaction-filter.component';

// --- PRIMENG IMPORTS  ---
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker'; 
import { TextareaModule } from 'primeng/textarea';   
import { SelectModule } from 'primeng/select';         
import { SelectButtonModule } from 'primeng/selectbutton';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [
    TransactionsPageComponent,
    TransactionListComponent,
    TransactionFormComponent,
    TransactionFilterComponent,
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    // PrimeNG UI Modules 
    ButtonModule,
    PaginatorModule,
    InputNumberModule,
    DatePickerModule, 
    TextareaModule,   
    SelectModule,     
    SelectButtonModule,
    CardModule,
    MenuModule
  ],
})
export class TransactionsModule {}