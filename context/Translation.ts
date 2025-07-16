// ✅ Hàm translate
export const translate = (
  messages: Record<string, string>,
  txt: string,
  replace: any = null,
  context: string | null = null
): string => {
  if (!txt || typeof txt !== "string") return txt;

  let translated_text = "";
  const key = txt;

  if (context) {
    translated_text = messages[`${key}:${context}`];
  }
  if (!translated_text) {
    translated_text = messages[key] || txt;
  }
  if (replace && typeof replace === "object") {
    translated_text = format(translated_text, replace);
  }

  return translated_text;
};

// ✅ Hàm format giống như trong Vue
export function format(str: string, args: any): string {
  if (str === undefined) return str;

  let unkeyed_index = 0;
  return str.replace(/\{(\w*)\}/g, (match, key) => {
    if (key === "") {
      key = unkeyed_index;
      unkeyed_index++;
    }
    if (key == +key) {
      return args[key] !== undefined ? args[key] : match;
    }
    return args[key] !== undefined ? args[key] : match;
  });
}
