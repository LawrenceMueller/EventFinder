import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import Showcase from './Showcase';

import styles from '@/styles/Layout.module.css';

export default function Layout({ title, keywords, description, children }) {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
      </Head>

      <Header />

      {/* The following bit of logic is conditional rendering
          in order to render the Hero Showcase Banner.
          This comment is to note that the double ampersand is
          basically a shorthand for else. So the following line
          reads if pathname is equal to home then render showcase
      */}
      {router.pathname === '/' && <Showcase />}

      <div className={styles.container}>{children}</div>
      <Footer />
    </div>
  );
}

Layout.defaultProps = {
  title: 'Sustainable Events',
  description: 'Find local events to help the environement',
  keywords: 'sustainability, climate change, climate, volunteer, help',
};
