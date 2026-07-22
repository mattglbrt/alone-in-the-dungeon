import { makeMarkdownEndpoint } from '../../utils/mdEndpoint';

export const { getStaticPaths, GET } = makeMarkdownEndpoint('review');
