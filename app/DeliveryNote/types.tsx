export type Item = {
  name: string;
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
export type DeliveryNote = {
  company: string;
  customer: string;
  currency: string;
  selling_price_list: string;
  plc_conversion_rate: number;
  set_warehouse: string;
  items: Item[];
  rfids: RFID[];
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
