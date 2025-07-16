export type Item = {
  name: string;
  item_code: string;
  qty: number;
  rate: number;
  serial_no: string;
  use_serial_batch_fields: number;
};

export type SalesTeamItem = {
  sales_person: string;
  allocated_percentage: number;
};

export type RFID = {
  rfid_tag: string;
  item: string;
  gas_serial_no: string;
  reinspection_date: string;
  color: string;
  brand: string;
};

// 👉 Record Type (1 Stock Entry)
export type DeliveryNote = {
  company: string;
  customer: string;
  currency: string;
  selling_price_list: string;
  plc_conversion_rate: number;
  set_warehouse: string;
  authority: string;
  driver: string;
  note: string;
  items: Item[];
  rfids: RFID[];
  sales_team: SalesTeamItem[];
};

export type SalesInvoice = {
  name: string;
  posting_date: string;
  total_qty: number;
  total: number;
  status: string;
};

export type PurchaseReceipt = {
  name: string;
  posting_date: string;
  total_qty: number;
  total: number;
  status: string;
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
