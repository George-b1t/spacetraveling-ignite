import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { useEffect, useState } from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

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
        type: string;
        spans: { 
          data: {
            link_type: string,
            url: string;
          }
          end: number;
          start: number;
          type: string;
        }[];
      }[];
    }[];
  };
};

interface PostProps {
  post: Post;
};

export default function Post({ post }: PostProps) {
  const [ time, setTime ] = useState("");
  const [ date, setDate ] = useState("");

  const router = useRouter()

  if (router.isFallback) {
    return <div>Carregando...</div>;
  };

  useEffect(() => {
    let wordCounter = 0;

    post.data.content.forEach(item => {
      wordCounter += item.heading.split(" ").length;
      wordCounter += RichText.asText(item.body).split(" ").length;
      wordCounter += RichText.asText(item.body).split("-").length;
    });

    setTime((wordCounter / 200 + 1).toFixed(0));

    const formatedDate = format(new Date(post.first_publication_date), 'PP', {
      locale: ptBR
    });
  
    setDate(formatedDate);
  }, []);

  return (
    <div className={ styles.container }>
      <Header />
      <img src={post.data.banner.url} alt="banner" className={ styles.banner } />
      <div className={ `${commonStyles.center700}` }>
        <div className={ styles.contentHeader }>
          <h1>{post.data.title}</h1>
          <section>
            <div>
              <FiCalendar />
              <time>{date}</time>
            </div>
            <div>
              <FiUser />
              <p>{post.data.author}</p>
            </div>
            <div>
              <FiClock />
              <p>{time} min</p>
            </div>
          </section>
        </div>
        {
          post.data.content.map((item, i) => {
            return (
              <div key={ i } className={ styles.contentItem }>
                <h2>{item.heading}</h2>
                <div dangerouslySetInnerHTML={{ __html: RichText.asHtml(item.body) }} />
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    pageSize: 1
  });

  const paths = posts.results.map(i => ({
    params: {
      slug: i.uid
    }
  }));

  return {
    paths,
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      content: response.data.content,
      author: response.data.author,
      banner: response.data.banner
    }
  };

  return {
    props: {
      post
    },
    revalidate: 1
  }
};
