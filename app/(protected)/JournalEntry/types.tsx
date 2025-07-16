// 👉 Record Type (1 Stock Entry)
export type JournalEntry = {
  company: string;
  posting_date: string;
  voucher_type: string;
  multi_currency: boolean;
  accounts: any[];
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
