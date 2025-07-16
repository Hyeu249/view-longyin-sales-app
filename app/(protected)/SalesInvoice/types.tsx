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
  docstatus: number;
  paid_amount: string;
};

export type SalesInvoice = {
  company: string;
  customer: string;
  currency: string;
  authority: string;
  items: Item[];
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
