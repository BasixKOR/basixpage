import SyntaxHighlighter from 'react-syntax-highlighter';
import invariant from 'tiny-invariant';
import { CodeBlockFragment } from '~/graphql/generated';
import { gql } from '~/utils/dato';

export const fragment = gql`
	fragment codeBlock on CodeBlockRecord {
		id
		language
		code
	}
`

export default function CodeBlock({ language, code }: CodeBlockFragment) {
	invariant(language, 'language is null');
	return <SyntaxHighlighter language={language}>{code}</SyntaxHighlighter>
}