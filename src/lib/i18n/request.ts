import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

import zhMessages from "../../../messages/zh.json";
import enMessages from "../../../messages/en.json";

const messagesMap = {
  zh: zhMessages,
  en: enMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "zh" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messagesMap[locale as "zh" | "en"] || zhMessages,
  };
});
