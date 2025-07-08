
 // Represents a single financial transaction (income or expense).
 
export interface Transaction {
  id: string; 
  type: 'income' | 'expense';
  amount: number;
  categoryId: string; 
  date: string; 
  description?: string; 
  createdAt: string; 
}


 // Represents a financial category.
 
export interface Category {
  id: string; 
  name: string;
  type: 'income' | 'expense';
  icon?: string; 
  color?: string; 
}


 // The complete structure for all data stored in Local Storage.
 
export interface AppData {
  transactions: Transaction[];
  categories: Category[];
}