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
