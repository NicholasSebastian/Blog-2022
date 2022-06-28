import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { getPosts, getPost, getContent } from '../../lib/notion';

function renderBlock(block: IBlock) {
  try {
    switch (block.type) {
      case 'paragraph': {
        const lines = block.paragraph.rich_text;
        return lines.map((line: any, i: number) => <p key={i}>{line.text.content}</p>);
      }
      case 'heading_1': {
        const lines = block.heading_1.rich_text;
        return lines.map((line: any, i: number) => <h1 key={i}>{line.plain_text}</h1>);
      }
      case 'heading_2': {
        const lines = block.heading_2.rich_text;
        return lines.map((line: any, i: number) => <h2 key={i}>{line.plain_text}</h2>);
      }
      case 'heading_3': {
        const lines = block.heading_3.rich_text;
        return lines.map((line: any, i: number) => <h3 key={i}>{line.plain_text}</h3>);
      }
      case 'image': {
        return <Image src={block.image.external.url} alt="Cover Image" />
      }
      case 'bulleted_list_item': {
        const lines = block.bulleted_list_item.rich_text;
        return lines.map((line: any, i: number) => <li key={i}>{line.plain_text}</li>);
      }
      case 'numbered_list_item': {
        const lines = block.numbered_list_item.rich_text;
        return lines.map((line: any, i: number) => <li key={i}>{line.plain_text}</li>);
      }
      default:
        console.error("Undefined Type", block);
    }
  }
  catch {
    console.error("Unable to Render", block);
  }
}

const Post: NextPage<IPostProps> = ({ post, content }) => {
  return (
    <main>
      <h1>{post.name}</h1>
      {content.map((block, i) => (
        <div key={i}>{renderBlock(block)}</div>
      ))}
    </main>
  );
}

export default Post;

export const getStaticProps: GetStaticProps = async context => {
  const { id } = context.params as IParams;
  const post = await getPost(id) as any;
  const { results } = await getContent(id);
  return {
    props: { 
      post: {
        id: post.id,
        created_on: post.created_time,
        name: post.properties.Name.title[0].plain_text,
        tags: post.properties.Tags.multi_select.map((tag: any) => tag.name),
        cover: post.cover.file.url
      }, 
      content: results
    }
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { results } = await getPosts();
  return {
    fallback: false,
    paths: results.map(post => ({
      params: {
        id: post.id
      }
    }))
  };
}

interface IParams extends ParsedUrlQuery {
  id: string
}

interface IPostProps {
  post: IPost
  content: Array<IBlock>
}

export interface IPost {
  id: string
  created_on: string
  name: string
  tags: Array<string>
  cover: string
}

interface IBlock {
  type: string
  [key: string]: any
}
