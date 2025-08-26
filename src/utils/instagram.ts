// src/utils/instagram.ts
const ruMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "c",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
  " ": "_",
  "-": "_",
  ".": "",
  ",": "",
  "/": "",
  "\\": "",
  "'": "",
  '"': "",
};

export function translitToHandle(text: string) {
  const s = text.trim().toLowerCase();
  return s
    .split("")
    .map((ch) => ruMap[ch] ?? ruMap[ch as keyof typeof ruMap] ?? ch)
    .join("")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30); // лимит IG никнейма
}

export function makeInstagramFromName(name: string) {
  const base = translitToHandle(name);
  const username = base || "user";
  const url = `https://instagram.com/${username}`;
  return { username, url };
}

export function normalizeInstagramUsername(input: string) {
  const cleaned = input.trim().replace(/^@/, "");
  return translitToHandle(cleaned);
}
