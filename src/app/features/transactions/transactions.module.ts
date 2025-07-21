import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsPageComponent } from './transactions-page.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionFilterComponent } from './components/transaction-filter/transaction-filter.component';

// --- PRIMENG IMPORTS (Updated) ---
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker'; // Replaced CalendarModule
import { TextareaModule } from 'primeng/textarea';   // Replaced InputTextarea
import { SelectModule } from 'primeng/select';         // Replaced DropdownModule
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
    // PrimeNG UI Modules (Updated)
    ButtonModule,
    PaginatorModule,
    InputNumberModule,
    DatePickerModule, // Use new module
    TextareaModule,   // Use new module
    SelectModule,     // Use new module
    SelectButtonModule,
    CardModule,
    MenuModule
  ],
})
export class TransactionsModule {}