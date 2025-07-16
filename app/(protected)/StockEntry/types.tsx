export type Item = {
  name: string;
  item_code: string;
  qty: number;
  serial_no: string;
  use_serial_batch_fields: number;
};

export type RFID = {
  rfid_tag: string;
  item: string;
  gas_serial_no: string;
  reinspection_date: string;
  color: string;
  brand: string;
};

export type Bundle = {
  name: string;
  bundle: string;
  qty: number;
};

// 👉 Record Type (1 Stock Entry)
export type StockEntry = {
  company: string;
  stock_entry_type: string;
  from_warehouse: string;
  to_warehouse: string;
  transaction_type: string;
  estimated_cargo_weight: number;
  weighed_goods: number;
  post_weighing_attach_img: string;
  items: Item[];
  rfids: RFID[];
  bundle: Bundle[];
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
