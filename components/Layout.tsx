import { FC, PropsWithChildren } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Layout: FC<PropsWithChildren<ILayoutProps>> = (props) => {
  const { children, title, description } = props;
  const _title = title ?? "Blog";
  return (
    <>
      <Head>
        <title>{_title}</title>
        <meta name='og:title' title='og:title' content={_title} />
        <meta name='description' title='description' content={description} />
        <meta name='og:description' title='og:description' content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Link href='/'>Home</Link>
      </header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}

export default Layout;

interface ILayoutProps {
  title?: string
  description?: string
}
