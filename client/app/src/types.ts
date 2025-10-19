export interface Account {
  closed?: boolean;
  name: string;
  id: string;
}

export interface Category {
  id: string;
}

export interface ParentCategory {
  hidden?: boolean;
  id: string;
  name: string;
  categories: Category[];
}

export interface SubTransactionPayload {
  amount: number;
  payee_id: string | null;
  payee_name: string | null;
  category_id: Category['id'] | null;
  memo: string | null;
}

export interface TransactionPayload extends SubTransactionPayload {
  account_id: string;
  date: string;
  cleared: 'uncleared';
  approved: boolean;
  flag_color: string | null;
  import_id: string | null;
  subtransactions: SubTransactionPayload[];
}

export interface SubTransaction extends SubTransactionPayload {
  id: string;
  category_name: string | null;
  deleted: boolean;
  transaction_id: string;
  transfer_account_id: string | null;
  transfer_transaction_id: string | null;
}

export interface ProcessedSubTransaction extends SubTransaction {
  isSub: true;
  date: string;
  account_id: string;
  account_name: string | null;
}

export interface Transaction extends SubTransaction {
  isSub?: never;
  account_id: string;
  account_name: string | null;
  approved: boolean;
  date: string;
  cleared: string;
  flag_color: string | null;
  import_id: string | null;
  subtransactions: SubTransaction[];
}

export type MixedTransaction = Transaction | ProcessedSubTransaction;

export interface TransactionGroups {
  transactions: MixedTransaction[];
  accountFlags: MixedTransaction[];
  categoryFlags: MixedTransaction[];
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
  PRIVACY_POLICY_REQUIRED = 'PRIVACY_POLICY_REQUIRED',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TRANSACTION_REVIEW = 'TRANSACTION_REVIEW',
  INSTRUCTIONS = 'INSTRUCTIONS',
}

export enum Mode {
  STANDARD = 'STANDARD',
  ADVANCED = 'ADVANCED',
}
