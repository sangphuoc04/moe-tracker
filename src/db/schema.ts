import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('expense_tracker.db');

export const initDatabase = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    -- Ví/Tài khoản
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- cash | bank | saving | investment
      balance REAL DEFAULT 0,
      color TEXT,
      icon TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Danh mục
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,  -- income | expense
      icon TEXT,
      color TEXT,
      is_default INTEGER DEFAULT 0
    );

    -- Giao dịch
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,         -- income | expense | transfer
      amount REAL NOT NULL,
      category_id INTEGER,
      wallet_id INTEGER NOT NULL,
      to_wallet_id INTEGER,       -- dùng khi chuyển khoản
      note TEXT,
      date TEXT NOT NULL,
      is_recurring INTEGER DEFAULT 0,
      recurring_interval TEXT,    -- daily | weekly | monthly
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (wallet_id) REFERENCES wallets(id)
    );

    -- Ngân sách
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      period TEXT NOT NULL,       -- monthly | weekly | yearly
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      alert_threshold REAL DEFAULT 0.8,  -- cảnh báo khi đạt 80%
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    -- Nợ/Vay
    CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,         -- owe (tôi nợ) | lend (người nợ tôi)
      person_name TEXT NOT NULL,
      amount REAL NOT NULL,
      remaining REAL NOT NULL,
      due_date TEXT,
      note TEXT,
      is_settled INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Mục tiêu tiết kiệm
    CREATE TABLE IF NOT EXISTS saving_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      target_amount REAL NOT NULL,
      current_amount REAL DEFAULT 0,
      deadline TEXT,
      icon TEXT,
      color TEXT,
      wallet_id INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Hóa đơn định kỳ
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      due_day INTEGER NOT NULL,   -- ngày trong tháng (1-31)
      category_id INTEGER,
      wallet_id INTEGER,
      remind_days_before INTEGER DEFAULT 3,
      is_active INTEGER DEFAULT 1,
      last_paid TEXT
    );
  `);

  // Seed danh mục mặc định
  seedDefaultCategories();
};