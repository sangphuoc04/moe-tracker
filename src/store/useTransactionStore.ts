import { create } from 'zustand';
import * as db from '../db/queries';

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  fetchTransactions: (filters?: FilterOptions) => Promise<void>;
  addTransaction: (data: NewTransaction) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  loading: false,

  fetchTransactions: async (filters) => {
    set({ loading: true });
    const data = await db.getTransactions(filters);
    set({ transactions: data, loading: false });
  },

  addTransaction: async (data) => {
    await db.insertTransaction(data);
    // Cập nhật số dư ví
    await db.updateWalletBalance(data.walletId, data.type, data.amount);
    get().fetchTransactions();
  },

  deleteTransaction: async (id) => {
    await db.deleteTransaction(id);
    get().fetchTransactions();
  },
}));