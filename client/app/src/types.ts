export interface Account {
  closed?: boolean;
  name: string;
  id: string;
}

export interface Category {
  id: string | number;
}

export interface ParentCategory {
  hidden?: boolean;
  id: string;
  name: string;
  categories: Category[];
}

export interface Transaction {
  id: string | number;
  transfer_account_id: string | number;
  category_id: string | number;
  account_id: string;
  payee_id: string | number | null;
  payee_name: string | null;
  category_name: string | null;
  account_name: string | null;
  approved: boolean;
  date: string;
  amount: number;
  memo: string | null;
  cleared: string;
  flag_color: string | null;
  import_id: string | number | null;
  subtransactions: Transaction[];
}

export interface TransactionPayload {
  account_id: string | number;
  date: string;
  amount: number;
  payee_id: string | number | null;
  payee_name: string | null;
  category_id: string | number | null;
  memo: string | null;
  cleared: 'uncleared';
  approved: boolean;
  flag_color: string | null;
  import_id: string | number | null;
  subtransactions: SubTransactionPayload[];
}

export interface SubTransactionPayload {
  amount: number;
  payee_id: string | number | null;
  payee_name: string | null;
  category_id: string | number | null;
  memo: string | null;
}

export interface ClassifiedTransactions {
  filteredTransactions: Transaction[];
  sharedAccountErrorTransactions: Transaction[];
  sharedCategoryErrorTransactions: Transaction[];
}

export interface BudgetData {
  accounts: Account[];
  parentCategories: ParentCategory[];
}

export interface ErrorData {
  status: number;
  message: string;
}

export enum ModalName {
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TRANSACTION_REVIEW = 'TRANSACTION_REVIEW',
  INSTRUCTIONS = 'INSTRUCTIONS',
}

export enum Mode {
  STANDARD = 'STANDARD',
  ADVANCED = 'ADVANCED',
}
