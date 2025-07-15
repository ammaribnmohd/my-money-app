import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface TransactionFilters {
  type: 'all' | 'income' | 'expense';
  dateRange: 'all' | 'thisMonth' | 'last7Days';
}

@Component({
  selector: 'app-transaction-filter',
  standalone: false,
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.scss']
})
export class TransactionFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<TransactionFilters>();
  filterForm: FormGroup;
  private destroy$ = new Subject<void>();

  typeOptions: { label: string, value: string }[];
  dateRangeOptions: { label: string, value: string }[];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      type: ['all'],
      dateRange: ['all']
    });

    // Options for the type filter
    this.typeOptions = [
      { label: 'All', value: 'all' },
      { label: 'Income', value: 'income' },
      { label: 'Expense', value: 'expense' }
    ];

    // Options for the date range filter
    this.dateRangeOptions = [
      { label: 'All Time', value: 'all' },
      { label: 'This Month', value: 'thisMonth' },
      { label: 'Last 7 Days', value: 'last7Days' }
    ];
  }

  ngOnInit(): void {
    
    this.filterForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.filterChange.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}