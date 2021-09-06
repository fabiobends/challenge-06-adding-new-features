import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import formatter from '../utils/formatter';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  async function loadMore(): Promise<void> {
    const response = await fetch(postsPagination.next_page);
    const fetchedPosts = await response.json();
    setPosts(prev => [...prev, ...fetchedPosts.results]);
  }

  return (
    <>
      <Head>
        <title>Spacetraveling</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.content}>
          <ul>
            {posts.map(post => (
              <li key={post.uid}>
                <Link href={`/post/${post.uid}`}>
                  <a>
                    <h2>{post.data.title}</h2>
                    <p>{post.data.subtitle}</p>
                    <div className={styles.infoContainer}>
                      <div className={commonStyles.info}>
                        <FiCalendar className={commonStyles.icon} />
                        <p className={commonStyles.infoText}>
                          {formatter(new Date(post.first_publication_date))}
                        </p>
                      </div>
                      <div className={commonStyles.info}>
                        <FiUser className={commonStyles.icon} />
                        <p className={commonStyles.infoText}>
                          {post.data.author}
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          {postsPagination.next_page && (
            <button className={styles.button} type="button" onClick={loadMore}>
              <span>Carregar mais posts</span>
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsPagination = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 20,
    }
  );

  return {
    props: {
      postsPagination,
    },
  };
};
