import React, { createContext, useContext, useState, ReactNode } from "react";

// Kiểu dữ liệu sản phẩm
export type Product = {
  name: string;
  item_name: string;
  stock_uom: string;
  price: number;
  image: string | undefined;
  qty: number;
  stock?: number;
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
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  rc_products: Product[]; // danh sách sản phẩm
  setRCProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customer: Customer; // danh sách sản phẩm
  setCustomer: (c: Customer) => void;
  salesPerson: SalesPerson; // danh sách sản phẩm
  setSalesPerson: (c: SalesPerson) => void;
  note: string; // danh sách sản phẩm
  setNote: (c: string) => void;

  increaseProduct: (product: Product, name: string) => Product;
  increaseRCProduct: (product: Product, name: string) => Product;
  decreaseProduct: (product: Product, name: string) => Product;
};

// Tạo Context
const SalesOrderContext = createContext<SalesOrderContextType | undefined>(
  undefined
);

// Provider
export const SalesOrderProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [rc_products, setRCProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer>({});
  const [salesPerson, setSalesPerson] = useState<SalesPerson>({});
  const [note, setNote] = useState<string>("");

  const increaseProduct = (p: Product, name: string) => {
    const stock = p?.stock == undefined ? 0 : p.stock;
    return p.name === name
      ? { ...p, qty: p.qty < stock ? p.qty + 1 : p.qty }
      : p;
  };

  const increaseRCProduct = (p: Product, name: string) => {
    return p.name === name ? { ...p, qty: p.qty + 1 } : p;
  };

  const decreaseProduct = (p: Product, name: string) =>
    p.name === name && p.qty > 1 ? { ...p, qty: p.qty - 1 } : p;

  return (
    <SalesOrderContext.Provider
      value={{
        products,
        setProducts,
        rc_products,
        setRCProducts,
        customer,
        setCustomer,
        salesPerson,
        setSalesPerson,
        note,
        setNote,

        increaseProduct,
        increaseRCProduct,
        decreaseProduct,
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
