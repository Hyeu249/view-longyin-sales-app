// 👉 Record Type (1 Stock Entry)
export type PaymentEntry = {
  company: string;
  payment_type: string;
  party_type: string;
  party: string;
  paid_amount: number;
  received_amount: number;
  authority: string;
  note: string;
};

import { View } from "@/components/Themed";

export default function Component() {
  return <View></View>;
}
