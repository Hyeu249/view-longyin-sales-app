import * as ImagePicker from "expo-image-picker";

export type OptionType = { label: string; value: string | undefined };
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
    | "child_table"
    | "signature"
    | "image"
    | "text"
    | "compute";
  doctype?: string;
  options?: OptionType[];
  default?: any;
  hidden?: boolean;
  readonly?: boolean;
  required?: boolean;
  filter?: object;
};

export type WithChildField = BaseField & {
  child_fields?: BaseField[];
};

export type MainField = {
  label: string;
  padding?: number;
  hidden?: boolean;
  fields: WithChildField[];
};

export const generateDefaultValues = (fields: BaseField[]) => {
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
      return "Rejected"; // đỏ
    default:
      return "";
  }
};

export const statusColor = (status: boolean | number) => {
  switch (status) {
    case 1:
      return ["#e4f5e9", "#16794c"]; // xám
    case 2:
      return ["#ffd2d2", "#b52a2a"]; // xám
    default:
      return ["#ffeecf", "#ffa500"]; // xám
  }
};

export const statusColor2 = (status: boolean | number) => {
  switch (status) {
    case 1:
      return ["#e4f5e9", "#41da95ff"]; // xám
    case 2:
      return ["#ffd2d2", "#ee2222ff"]; // xám
    default:
      return ["#ffeecf", "#ffa500"]; // xám
  }
};

export const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const getLastNDays = (n: number) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const formatted = formatDate(d);
    days.push({ label: formatted, value: formatted });
  }
  return days;
};

export const hasData = (data: object) => Object.keys(data).length > 0;

export const formatVND = (n: number = 0) =>
  n?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export function arraysAreDifferent<T>(
  arr1: T[],
  arr2: T[],
  fields: (keyof T)[]
): boolean {
  if (arr1.length !== arr2.length) return true; // khác độ dài => khác

  return arr1.some((obj1, index) => {
    const obj2 = arr2[index];
    return fields.some((field) => obj1[field] !== obj2[field]);
  });
}

export const pickImage2 = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].file;
  }
};

export const pickImage = async () => {
  console.log("cool!!!");
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true,
  });

  if (!result.canceled) {
    const asset = result.assets[0];
    return asset.file;

    // Lấy Blob từ URI
    const response = await fetch(asset.uri);
    const blob = await response.blob();

    return blob; // Đây chính là binary bạn cần
  }

  return null;
};
