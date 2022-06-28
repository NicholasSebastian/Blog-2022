import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import dayjs from 'dayjs';
import { ParsedUrlQuery } from 'querystring';
import { getPosts, getPost, PostProperties } from '../../lib/notion';
import { slugify } from '../../utils/slug';

const Post: NextPage<IPostProps> = ({ post, markdown }) => {
  return (
    <main>
      <h1>{post.name}</h1>
      <Image src={post.cover} alt="Cover" layout='responsive' width={640} height={360} />
      <div>{dayjs(post.created_on).format('MMMM D, YYYY')}</div>
      <article>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </article>
    </main>
  );
}

export default Post;

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params as ParsedUrlQuery;
  const { post, markdown } = await getPost(slug as string);
  return {
    props: { post, markdown }
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return {
    fallback: false,
    paths: posts.map(post => ({
      params: {
        slug: slugify(post.name)
      }
    }))
  };
}

interface IPostProps {
  post: PostProperties
  markdown: string
}
