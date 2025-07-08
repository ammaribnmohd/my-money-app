import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // This line now redirects the user to '/dashboard' when the app first loads.
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'transactions',
    loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'categories', loadChildren: () => import('./features/categories/categories.module').then(m => m.CategoriesModule) },
  // This is a "wildcard" route. If the user navigates to a URL that doesn't exist,
  // it will redirect them to the dashboard.
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }