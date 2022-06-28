import { FC, PropsWithChildren } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const DEFAULT_TITLE = "Blog";

const Layout: FC<PropsWithChildren<ILayoutProps>> = (props) => {
  const { children, title, description } = props;
  return (
    <>
      <Head>
        <title>{title ?? DEFAULT_TITLE}</title>
        <meta name="description" content={description} />
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
