import ko from "date-fns/locale/ko/index.js";
import enGB from "date-fns/locale/en-GB/index.js";

export function getDateFnsLocale(locale: string) {
  return (
    {
      "en": enGB,
      "ko": ko,
    }[locale]
  );
}
