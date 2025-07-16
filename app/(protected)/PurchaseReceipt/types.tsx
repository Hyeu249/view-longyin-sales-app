export type Item = {
  item_code: string;
  qty: number;
  rate: number;
  serial_no: string;
  use_serial_batch_fields: number;
};

export type RFID = {
  rfid_tag: string;
  item: string;
  gas_serial_no: string;
};

// 👉 Record Type (1 Stock Entry)
export type PurchaseReceipt = {
  company: string;
  supplier: string;
  currency: string;
  buying_price_list: string;
  conversion_rate: number;
  set_warehouse: string;
  authority: string;
  inter_company_reference?: string;
  items: Item[];
  rfids: RFID[];
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
