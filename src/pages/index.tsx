import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';

import { FiUser, FiCalendar } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home() {
  const post = {
    data: {
      author: "George Soares",
      subtitle: "Tudo sobre como criar a sua primeira aplicação utilizando Create React App",
      title: "Criando um app CRA do zero"
    },
    first_publication_date: "19 Abr 2021",
    uid: "aprendendo-teste"
  };
  const [ posts, setPosts ] = useState<Post[]>([post, post, post, post, post, post]);

  return (
    <div className={ styles.container }>
      <Header />
      <div className={ styles.fieldPosts }>
        {posts.map(post => {
          return (
            <Link href={`/post/${post.uid}`}>
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
      <strong className={ styles.loadMorePosts }>Carregar mais posts</strong>
    </div>
  );
};

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
