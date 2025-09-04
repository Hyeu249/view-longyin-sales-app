import { getLastNDays, formatDate } from "@/utils/type";

export async function getStockLedgerReport(
  call: any,
  company: string,
  warehouse: string,
  date: string = ""
) {
  try {
    const searchParams = {
      report_name: "Stock Ledger",
      filters: {
        company: company,
        from_date: "2025-07-01",
        to_date: date || formatDate(new Date()),
        warehouse: warehouse,
        valuation_field_type: "Currency",
      },
      ignore_prepared_report: false,
      are_default_filters: false,
    };

    const docs: any = await call.get(
      "frappe.desk.query_report.run",
      searchParams
    );

    const data = docs.message?.result;
    const uniqueLatestItems = Object.values(
      data
        .slice() // tránh mutate mảng gốc
        .reverse() // duyệt từ dưới lên
        .reduce((acc: any, curr: any) => {
          const key = `${curr.item_code}|${curr.warehouse}`;
          if (!acc[key]) {
            acc[key] = curr; // lần đầu gặp key (từ dưới lên) => giữ lại
          }
          return acc;
        }, {})
    );

    const sorted: any = uniqueLatestItems.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const value = sorted.filter((res: any) => res.qty_after_transaction > 0);

    return value;
  } catch (error) {
    console.error("Error fetching Stock Ledger Report:", error);
    return [];
  }
}

export async function getItemOptions(
  call: any,
  company: string,
  warehouse: string,
  date: string = ""
) {
  const reports = await getStockLedgerReport(call, company, warehouse);

  return reports.map((res: any) => {
    const qty = res.qty_after_transaction;
    return {
      label: `${res.item_code}(SL: ${qty})`,
      value: res.item_code,
      qty: res.qty_after_transaction,
    };
  });
}

export async function getStockItems(
  call: any,
  company: string,
  warehouse: string,
  date: string = ""
) {
  const reports = await getStockLedgerReport(call, company, warehouse);

  return reports.map((res: any) => {
    return {
      item_code: res.item_code,
      qty: res.qty_after_transaction,
    };
  });
}
