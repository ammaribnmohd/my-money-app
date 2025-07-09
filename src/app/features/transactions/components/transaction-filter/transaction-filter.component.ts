import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface TransactionFilters {
  type: 'all' | 'income' | 'expense';
  dateRange: 'all' | 'thisMonth' | 'last7Days';
}

@Component({
  selector: 'app-transaction-filter',
  standalone: false, // This is not a standalone component
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.scss']
})
export class TransactionFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<TransactionFilters>();
  filterForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      type: ['all'],
      dateRange: ['all']
    });
  }

  ngOnInit(): void {
    // Every time a value in the form changes, emit the new value to the parent.
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