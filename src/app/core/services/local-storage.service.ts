import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppData, Transaction, Category } from '../models/app-models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  // The key we'll use to store data in the browser's Local Storage.
  private readonly STORAGE_KEY = 'myMoneyAppData';

  // A BehaviorSubject holds the "current value" of our app's data.
  // Components can subscribe to it to get real-time updates.
  private _appData$: BehaviorSubject<AppData>;

  constructor() {
    const initialData = this.loadInitialData();
    this._appData$ = new BehaviorSubject<AppData>(initialData);

    // This is the magic: whenever the data changes in our BehaviorSubject...
    this._appData$.subscribe(data => {
      // ...we save the new version to Local Storage.
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    });
  }

  /**
   * Loads data from Local Storage. If no data exists, it provides
   * a default set of categories and an empty transaction list.
   */
  private loadInitialData(): AppData {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      try {
       
        return JSON.parse(storedData);
      } catch (e) {
        console.error('Error parsing stored data from Local Storage:', e);
    
      }
    }
    // This is the default data for a first-time user.
    return {
      transactions: [],
      categories: [
        // Default expense categories
        { id: uuidv4(), name: 'Food', type: 'expense', icon: 'restaurant', color: '#FF5722' },
        { id: uuidv4(), name: 'Transport', type: 'expense', icon: 'directions_bus', color: '#2196F3' },
        { id: uuidv4(), name: 'Shopping', type: 'expense', icon: 'shopping_bag', color: '#9C27B0' },
        { id: uuidv4(), name: 'Utilities', type: 'expense', icon: 'lightbulb', color: '#FFC107' },
        // Default income categories
        { id: uuidv4(), name: 'Salary', type: 'income', icon: 'payments', color: '#4CAF50' },
        { id: uuidv4(), name: 'Gift', type: 'income', icon: 'card_giftcard', color: '#00BCD4' },
      ]
    };
  }

  get appData$(): Observable<AppData> {
    return this._appData$.asObservable();
  }

  // --- Transaction Methods ---

  addTransaction(newTransaction: Omit<Transaction, 'id' | 'createdAt'>): void {
    const currentData = this._appData$.getValue();
    const transactionToAdd: Transaction = {
      ...newTransaction,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const updatedData = {
      ...currentData,
      transactions: [...currentData.transactions, transactionToAdd]
    };
    this._appData$.next(updatedData);
  }
   private updateAppData(newData: AppData): void {
    this._appData$.next(newData);
  }


  updateTransaction(updatedTransaction: Transaction): void {
    const currentData = this._appData$.getValue();
    const updatedTransactions = currentData.transactions.map(t =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    this.updateAppData({
      ...currentData,
      transactions: updatedTransactions
    });
  }

   deleteTransaction(transactionId: string): void {
    const currentData = this._appData$.getValue();
    const filteredTransactions = currentData.transactions.filter(t => t.id !== transactionId);
    this.updateAppData({
      ...currentData,
      transactions: filteredTransactions
    });
  }
  /**
   * Adds a new category.
   */
  addCategory(newCategory: Omit<Category, 'id'>): void {
    const currentData = this._appData$.getValue();
    const categoryToAdd: Category = {
      ...newCategory,
      id: uuidv4()
    };
    this.updateAppData({
      ...currentData,
      categories: [...currentData.categories, categoryToAdd]
    });
  }

  /**
   * Updates an existing category.
   */
  updateCategory(updatedCategory: Category): void {
    const currentData = this._appData$.getValue();
    const updatedCategories = currentData.categories.map(c =>
      c.id === updatedCategory.id ? updatedCategory : c
    );
    this.updateAppData({
      ...currentData,
      categories: updatedCategories
    });
  }

  /**
   * Deletes a category by its ID.
   */
  deleteCategory(categoryId: string): void {
    const currentData = this._appData$.getValue();
    const filteredCategories = currentData.categories.filter(c => c.id !== categoryId);
    this.updateAppData({
      ...currentData,
      categories: filteredCategories
    });
  }
}