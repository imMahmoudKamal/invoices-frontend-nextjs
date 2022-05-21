import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const theme = `
    if (localStorage.theme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    } else {
      document.documentElement.dataset.theme = 'light';
    }`;

  return (
    <Html data-theme="light">
      <Head>
        <link rel="preload" href="/font/Spartan-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/font/Spartan-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: theme }}></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
