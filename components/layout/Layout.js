import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import AppContextProvider from '../../context';
import Head from 'next/head';
import Header from './header/Header';
import Footer from './footer/Footer';
import Form from '../form/Form';

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <AnimatePresence exitBeforeEnter>
      <AppContextProvider key={router.route}>
        <Head>
          <title>Invoices App</title>
          <meta name="description" content="Invoices App By Mahmoud Kamal" />
          <meta name="robots" content="noindex, nofollow" />
          <link rel="shortcut icon" href="/images/logo.svg" type="image/x-icon" />
        </Head>

        <Header />

        <main>
          {children}
          <Form />
        </main>

        <Footer />
      </AppContextProvider>
    </AnimatePresence>
  );
}
