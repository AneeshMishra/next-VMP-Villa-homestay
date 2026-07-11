import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "hi", "fr", "de", "ja", "zh", "ko", "es", "ru"],
  defaultLocale: "en",
  localePrefix: "as-needed", // /en → /, /ar → /ar, /fr → /fr etc.
});
