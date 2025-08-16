import React, { createContext, useContext, useState, ReactNode } from "react";

// Kiểu dữ liệu sản phẩm
export type Product = {
  name: string;
  item_name: string;
  stock_uom: string;
  price: number;
  image: string | undefined;
  qty: number;
  stock: number;
};

type Customer = {
  name?: string;
  customer_name?: string;
  default_price_list?: string;
};

type SalesPerson = {
  name?: string;
};

type SalesOrderContextType = {
  products: Product[]; // danh sách sản phẩm
  setProducts: (p: Product[]) => void;
  customer: Customer; // danh sách sản phẩm
  setCustomer: (c: Customer) => void;
  salesPerson: SalesPerson; // danh sách sản phẩm
  setSalesPerson: (c: SalesPerson) => void;
  note: string; // danh sách sản phẩm
  setNote: (c: string) => void;

  increaseProduct: (name: string) => void;
  decreaseProduct: (name: string) => void;
  removeProduct: (name: string) => void;
};

// Tạo Context
const SalesOrderContext = createContext<SalesOrderContextType | undefined>(
  undefined
);

// Provider
export const SalesOrderProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer>({});
  const [salesPerson, setSalesPerson] = useState<SalesPerson>({});
  const [note, setNote] = useState<string>("");

  const increaseProduct = (name: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.name === name ? { ...p, qty: p.qty < p.stock ? p.qty + 1 : p.qty } : p
      )
    );
  };

  const decreaseProduct = (name: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.name === name && p.qty > 1 ? { ...p, qty: p.qty - 1 } : p
      )
    );
  };

  const removeProduct = (name: string) => {
    setProducts((prev) => prev.filter((item) => item.name !== name));
  };

  return (
    <SalesOrderContext.Provider
      value={{
        products,
        setProducts,
        customer,
        setCustomer,
        salesPerson,
        setSalesPerson,
        note,
        setNote,

        increaseProduct,
        decreaseProduct,
        removeProduct,
      }}
    >
      {children}
    </SalesOrderContext.Provider>
  );
};

// Hook tiện dụng
export const useSalesOrder = () => {
  const context = useContext(SalesOrderContext);
  if (!context) {
    throw new Error(
      "useSalesOrder phải được dùng bên trong SalesOrderProvider"
    );
  }
  return context;
};
