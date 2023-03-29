export interface Transaction {
  tid: string;
  fromId: string | null;
  toId: string | null;
  amount: number;
  status: string;
  createdAt: string;
}
