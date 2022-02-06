import { enGB, ko } from "date-fns/locale";

export function getDateFnsLocale(locale: string) {
  return (
    {
      "en": enGB,
      "ko": ko,
    }[locale]
  );
}
