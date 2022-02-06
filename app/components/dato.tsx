import {
  StructuredText as DatoStructuredText,
  StructuredTextPropTypes as DatoStructuredTextPropTypes,
  StructuredTextGraphQlResponseRecord,
} from "react-datocms";
import { Link } from "remix";

// React support utility.

// Extract types from react-datocms.
type RenderInlineRecordContext<R extends StructuredTextGraphQlResponseRecord> =
  Parameters<
    Exclude<DatoStructuredTextPropTypes<R>["renderInlineRecord"], undefined>
  >[0];
type RenderRecordLinkContext<R extends StructuredTextGraphQlResponseRecord> =
  Parameters<
    Exclude<DatoStructuredTextPropTypes<R>["renderLinkToRecord"], undefined>
  >[0];

function renderInlineRecordFallback<
  R extends StructuredTextGraphQlResponseRecord
>({ record }: RenderInlineRecordContext<R>, locale: string) {
  switch (record.__typename) {
    case "ArticleRecord":
      return (
        <Link to={`/${locale}/posts/${record.slug}`}>
          {String(record.title)}
        </Link>
      );
    default:
      throw new Error("Unknown record type");
  }
}

function renderLinkToRecordFallback<
  R extends StructuredTextGraphQlResponseRecord
>({ record, children }: RenderRecordLinkContext<R>, locale: string) {
  switch (record.__typename) {
    case "ArticleRecord":
      return (
        <Link to={`/${locale}/posts/${record.slug}`}>{children}</Link>
      );
    default:
      throw new Error("Unknown record type");
  }
}

/**
 * An general fallback utility.
 * Returns a function which runs `fallible` first and if first itself or the returned value is null or undefined, runs fallback.
 *
 * @param fallible A first function which may be nully or the return value may.
 * @param fallback A fallback function.
 * @param additional An array of arguments only for fallback function.
 * @returns A function that runs both as described.
 */
function fallback<P extends any[], R, A extends any[]>(
  fallible: ((...args: P) => R | undefined | null) | undefined,
  fallback: (...args: [...P, ...A]) => R,
	additional: A
) {
  return (...args: P) => {
    return fallible?.(...args) ?? fallback(...[...args, ...additional]);
  };
}

export interface StructuredTextPropTypes<
  R extends StructuredTextGraphQlResponseRecord
> extends DatoStructuredTextPropTypes<R> {
  locale: string;
}

export function StructuredText<R extends StructuredTextGraphQlResponseRecord>({
  renderInlineRecord,
  renderLinkToRecord,
	locale,
  ...props
}: StructuredTextPropTypes<R>) {
  return (
    <DatoStructuredText
      renderInlineRecord={fallback(
        renderInlineRecord,
        renderInlineRecordFallback,
				[locale]
      )}
      renderLinkToRecord={fallback(
        renderLinkToRecord,
        renderLinkToRecordFallback,
				[locale]
      )}
      {...props}
    />
  );
}
