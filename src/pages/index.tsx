import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';
import Prismic from '@prismicio/client';

import { FiUser, FiCalendar } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

export default function Home({ postsPagination }: HomeProps) {

  return (
    <div className={ styles.container }>
      <Header />
      <div className={ `${styles.fieldPosts} ${commonStyles.center700}` }>
        {postsPagination.results.map(post => {
          return (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a className={ styles.post }>
                <h2>{post.data.title}</h2>
                <p>{post.data.subtitle}</p>
                <section>
                  <div>
                    <FiCalendar />
                    <time>{post.first_publication_date}</time>
                  </div>
                  <div>
                    <FiUser />
                    <p>{post.data.author}</p>
                  </div>
                </section>
              </a>
            </Link>
          );
        })}
      </div>
      <strong className={ `${styles.loadMorePosts} ${commonStyles.center700}` }>Carregar mais posts</strong>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    pageSize: 100
  });

  const filteredResult = response.results.map(item => {
    const formatedDate = format(new Date(item.first_publication_date), 'PP', {
      locale: ptBR
    });

    const arrDate = formatedDate.split(' ');

    for (var i = 0; i < arrDate.length; i++) {
      arrDate[i] = arrDate[i].charAt(0).toUpperCase() + arrDate[i].slice(1);
    };
    
    return {
      data: {
        author: item.data.author,
        title: item.data.title,
        subtitle: item.data.subtitle
      },
      uid: item.uid,
      first_publication_date: arrDate.join(" ")
    }
  });

  return {
    props: {
      postsPagination: {
        results: filteredResult,
        next_page: response.next_page
      }
    }
  };
};
