import type { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import { getPosts } from '../lib/notion';
import { IPost } from './posts/[id]';

const Home: NextPage<IPageProps> = ({ posts }) => {
  return (
    <main>
      <h1>Latest Posts</h1>
      {posts.map(post => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <div>{post.name}</div>
        </Link>
      ))}
    </main>
  )
}

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const { results } = await getPosts();
  return {
    props: {
      posts: results.map((post: any) => ({
        id: post.id,
        created_on: post.created_time,
        name: post.properties.Name.title[0].plain_text,
        tags: post.properties.Tags.multi_select.map((tag: any) => tag.name),
        cover: post.cover.file.url
      }))
    }
  };
}

interface IPageProps {
  posts: Array<IPost>
}
