export type Item = {
  name?: string;
  item_code: string;
  qty: number;
  rate: number;
};

export type MaterialRequest = {
  name?: string;
  s_warehouse: string;
  t_warehouse: string;
  items: Item[];
};
