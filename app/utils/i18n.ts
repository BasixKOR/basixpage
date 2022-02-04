import { enGB, ko } from "date-fns/locale";

export function getDateFnsLocale(locale: string) {
  return (
    {
      "en-gb": enGB,
      "ko-kr": ko,
    }[locale]
  );
}
