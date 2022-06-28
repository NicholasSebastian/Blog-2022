import { Client } from '@notionhq/client';

const client = new Client({ auth: process.env.NOTION_KEY });

export async function getPosts() {
  return await client.databases.query({ database_id: process.env.NOTION_DATABASE! });
}

export async function getPost(id: string) {
  return await client.pages.retrieve({ page_id: id });
}

export async function getContent(id: string) {
  return await client.blocks.children.list({ block_id: id });
}
