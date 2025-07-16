export type OptionType = { label: string; value: string };
export type BaseField = {
  label: string;
  field_name: string;
  type:
    | "char"
    | "int"
    | "float"
    | "select"
    | "date"
    | "datetime"
    | "link"
    | "child_table";
  doctype?: string;
  options?: OptionType[];
  default?: any;
  hidden?: boolean;
  readonly?: boolean;
  required?: boolean;
};

export type MainField = BaseField & {
  child_fields?: BaseField[];
};

export const generateDefaultValues = (fields: MainField[]) => {
  const defaults: Record<string, any> = {};

  fields.forEach((field) => {
    defaults[field.field_name] = field.default;
  });

  return defaults;
};

export const docstatusToText = (status: number | boolean) => {
  switch (status) {
    case 0:
      return "Pending"; // xám
    case 1:
      return "Approved"; // xanh lá
    case 2:
      return "Reject"; // đỏ
    default:
      return "";
  }
};

export const statusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return ["#e4f5e9", "#16794c"]; // xám
    case "Rejected":
      return ["#ffd2d2", "#b52a2a"]; // xám
    default:
      return ["white", "#ffa500"]; // xám
  }
};

const getStatus = (workflow_state: string, docstatus: number) => {};
