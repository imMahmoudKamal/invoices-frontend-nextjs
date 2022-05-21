import { useState, useCallback, useEffect } from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import userImg from '/public/images/user.webp';
import MoonIcon from '/public/images/icon-moon.svg';
import SunIcon from '/public/images/icon-sun.svg';

export default function Header() {
  const [theme, setTheme] = useState(null);

  const changeThemeHandler = useCallback(() => {
    if (document.documentElement.dataset.theme === 'dark') {
      document.documentElement.dataset.theme = 'light';
      localStorage.theme = 'light';
      setTheme('light');
    } else {
      document.documentElement.dataset.theme = 'dark';
      localStorage.theme = 'dark';
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    setTheme(() => localStorage.theme);
  }, []);

  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={styles.header__logo}>
          <div className={styles.header__logo__icon}></div>
        </a>
      </Link>

      <div className={styles.header__more}>
        <div className={styles.header__more__theme} onClick={changeThemeHandler}>
          {theme === 'light' && <MoonIcon />}
          {theme === 'dark' && <SunIcon />}
        </div>

        <div className={styles.header__more__user}>
          <div>
            <Image src={userImg} alt="user logo" placeholder="blur" />
          </div>
        </div>
      </div>
    </header>
  );
}
