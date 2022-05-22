import styles from './footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footer__copy}>Made with ❤️ by Mahmoud Kamal © {new Date().getFullYear()}</p>
    </footer>
  );
}
