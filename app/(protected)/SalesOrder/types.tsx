export type Item = {
  item_code: string;
  qty: number;
  rate: number;
};

export type SalesTeamItem = {
  sales_person: string;
  allocated_percentage: number;
};

export type DeliveryNote = {
  name: string;
  posting_date: string;
  docstatus: number;
  customer: string;
};

export type SalesOrder = {
  company: string;
  customer: string;
  order_type: string;
  delivery_date: string;
  set_warehouse: string;
  currency: string;
  selling_price_list: string;
  plc_conversion_rate: number;
  items: Item[];
  sales_team: SalesTeamItem[];
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
