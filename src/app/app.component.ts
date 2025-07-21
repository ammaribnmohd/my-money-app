import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'my-money-app';
  sidebarVisible = false;
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-th-large',
        routerLink: '/dashboard'
      },
      {
        label: 'Transactions',
        icon: 'pi pi-list',
        routerLink: '/transactions'
      },
      {
        label: 'Categories',
        icon: 'pi pi-tags',
        routerLink: '/categories'
      }
    ];
  }
}