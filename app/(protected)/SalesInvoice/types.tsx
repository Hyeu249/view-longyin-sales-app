export type Item = {
  name?: string;
  item_code: string;
  qty: number;
  rate: number;
  income_account: string;
  expense_account: string;
  uom: string;
};

export type PaymentEntry = {
  name: string;
  posting_date: string;
  status: string;
  paid_amount: string;
};

export type JournalEntry = {
  name: string;
  posting_date: string;
  status: string;
  voucher_type: string;
  remark: string;
};

export type SalesInvoice = {
  name?: string;
  debit_to?: string;
  company: string;
  customer: string;
  currency: string;
  authority: string;
  available_discount: number;
  applicable_discount: number;
  discount_amount2: number;
  items: Item[];
  gas_transaction_detail: any[];
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
