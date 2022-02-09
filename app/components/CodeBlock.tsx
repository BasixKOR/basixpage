import SyntaxHighlighter from 'react-syntax-highlighter';
import invariant from 'tiny-invariant';
import { CodeBlockFragment } from '~/graphql/generated';
import { gql } from '~/utils/dato';
import { monokai } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export const fragment = gql`
	fragment codeBlock on CodeBlockRecord {
		__typename
		id
		language
		code
	}
`

export default function CodeBlock({ language, code }: CodeBlockFragment) {
	invariant(language, 'language is null');
	return <SyntaxHighlighter className="code-block" style={monokai} language={language}>{code}</SyntaxHighlighter>
}