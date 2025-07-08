import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'takaCurrency',
  standalone: true // <--- ADD THIS LINE BACK
})
export class TakaCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '৳ 0.00';
    }

    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));

    const sign = value < 0 ? '- ' : '';

    return `${sign}৳ ${formatted}`;
  }
}