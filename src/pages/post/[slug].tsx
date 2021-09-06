import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import formatter from '../../utils/formatter';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  const [readingTime, setReadingTime] = useState(0);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const getReadingTime = useCallback(() => {
    // amend the whole text into one
    const text = post.data.content.reduce((acc, cont) => {
      return `${acc} ${RichText.asText(cont.body)}`;
    }, '');
    const words = text.split(' ').length;
    const time = Math.ceil(words / 200);
    setReadingTime(time);
  }, [post.data.content]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getReadingTime();
  }, [getReadingTime]);

  return (
    <div>
      <Head>
        <title>{post.data.title}</title>
      </Head>
      <main className={commonStyles.container}>
        <img src={post.data.banner.url} alt={post.data.title} />
        <h1>{post.data.title}</h1>
        <div className={styles.infoContainer}>
          <div className={commonStyles.info}>
            <FiCalendar className={commonStyles.icon} />
            <p className={commonStyles.infoText}>
              {formatter(new Date(post.first_publication_date))}
            </p>
          </div>
          <div className={commonStyles.info}>
            <FiUser className={commonStyles.icon} />
            <p className={commonStyles.infoText}>{post.data.author}</p>
          </div>
          <div className={commonStyles.info}>
            <FiClock className={commonStyles.icon} />
            <p className={commonStyles.infoText}>{`${readingTime} min`}</p>
          </div>
        </div>
        {post.data.content.map(content => (
          <div className={styles.textContent} key={content.heading}>
            <h2>{content.heading}</h2>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
            />
          </div>
        ))}
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      fetch: ['posts.title', 'posts.author', 'posts.banner', 'posts.content'],
    }
  );

  return {
    paths: posts.results.map(post => {
      return {
        params: {
          slug: post.uid,
        },
      };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { params } = context;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(params.slug), {});

  return {
    props: {
      post: response,
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};
