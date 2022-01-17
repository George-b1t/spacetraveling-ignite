import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={ styles.container }>
      <img src="logo.svg" alt="logo" />
    </div>
  );
};
