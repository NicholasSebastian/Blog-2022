import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { unslugify } from '../utils/slug';

const client = new Client({ auth: process.env.NOTION_KEY });
const parser = new NotionToMarkdown({ notionClient: client });

const extractPageProps = (post: any) => ({
  id: post.id,
  created_on: post.created_time,
  name: post.properties.Name.title[0].plain_text,
  tags: post.properties.Tags.multi_select.map((tag: any) => tag.name),
  cover: post.cover.file.url
});

export async function getPosts() {
  const { results } = await client.databases.query({ 
    database_id: process.env.NOTION_DATABASE!,
    sorts: [{ timestamp: "created_time", direction: "descending" }] 
  });
  return results.map(extractPageProps);
}

export async function getPost(slug: string) {
  const { results } = await client.databases.query({
    database_id: process.env.NOTION_DATABASE!,
    filter: {
      property: "Name",
      rich_text: {
        equals: unslugify(slug)
      } 
    }
  });

  const [page] = results;
  const post = extractPageProps(page);
  const blocks = await parser.pageToMarkdown(page.id);
  const markdown = parser.toMarkdownString(blocks);
  return { post, markdown };
}

export type PostProperties = ReturnType<typeof extractPageProps>;
