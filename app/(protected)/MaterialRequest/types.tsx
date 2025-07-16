export type Item = {
  name?: string;
  item_code: string;
  qty: number;
};

export type StockEntry = {
  name: string;
  posting_date: string;
  docstatus: number;
  purpose: string;
};

export type MaterialRequest = {
  company: string;
  material_request_type: string;
  schedule_date: string;
  set_from_warehouse: string;
  set_warehouse: string;
  transaction_type: string;
  items: Item[];
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
